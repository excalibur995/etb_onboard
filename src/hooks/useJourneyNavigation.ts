import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useJourneyStore } from '../store/useJourneyStore';
import { NavigateActionPayload } from '../types/api';
import { FALLBACK_JOURNEYS } from '../utils/config/fallbackJourney';
import { useJourney } from '../utils/queries/journeyQueries';
import { executeSystemStep } from '../utils/stepExecutor';

export const useJourneyNavigation = (
  journeyId?: string,
  currentScreenId?: string,
) => {
  const navigation = useNavigation<any>();
  const updateSession = useJourneyStore(state => state.updateSession);
  const clearSession = useJourneyStore(state => state.clearSession);
  const [isExecuting, setIsExecuting] = useState(false);

  const restartJourney = useCallback(
    (id: string, target: string) => {
      clearSession(id);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: target, params: { journeyId: id } }],
        }),
      );
    },
    [clearSession, navigation],
  );

  const { data: journey } = useJourney(journeyId);
  const navigator = journey?.navigator || '';
  const currentIndex =
    journey?.screens?.findIndex(s => s.screenId === currentScreenId) ?? -1;

  // Find the step owned by the current screen
  const currentStep =
    journey?.steps?.find(s => s.screen?.screenId === currentScreenId) ?? null;

  const preStartScreen =
    journey?.preInitiateScreen ||
    FALLBACK_JOURNEYS[journeyId as keyof typeof FALLBACK_JOURNEYS]
      .preInitiateScreen;

  const resolveDirection = (
    actionId: string | undefined,
  ): { direction: string; target?: string } => {
    if (!actionId || !currentStep?.onSubmit) return { direction: 'next' };

    const match = currentStep.onSubmit.find(a => a.actionId === actionId);
    return {
      direction: match?.direction ?? 'next',
      target: (match as any)?.target,
    };
  };

  const pushToScreen = (
    direction: string,
    targetScreenId?: string,
    navType: 'push' | 'replace' | 'reset' = 'push',
  ) => {
    if (!journey?.screens || !journeyId) return;

    const dir = direction.toLowerCase();

    if (dir === 'finish') {
      clearSession(journeyId);
      if (targetScreenId) {
        navigation.reset({
          index: 0,
          routes: [{ name: targetScreenId as never }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: preStartScreen as never }],
        });
      }
      return;
    }

    let nextIndex = currentIndex;

    switch (dir) {
      case 'next':
        nextIndex = currentIndex + 1;
        break;
      case 'back':
        nextIndex = currentIndex - 1;
        break;
      case 'jump':
        nextIndex = journey.screens.findIndex(
          s => s.screenId === targetScreenId,
        );
        break;
    }

    if (nextIndex < 0 || nextIndex >= journey.screens.length) return;

    const nextScreen = journey.screens[nextIndex];
    updateSession(journeyId, { currentScreenIndex: nextIndex });

    if (dir === 'back') {
      navigation.goBack();
      return;
    }

    if (navType === 'replace') {
      navigation.dispatch(
        StackActions.replace(nextScreen.screenId, { journeyId }),
      );
    } else {
      navigation.navigate(nextScreen.screenId, { journeyId });
    }
  };

  /**
   * Main entry point called by any button/action in the SDUI layer.
   *
   * - If the current step is `system` type → run the system step handler,
   *   then navigate via onSuccess/onFailure direction.
   * - If the current step is `user` type → resolve direction from steps.onSubmit
   *   by matching actionId, then navigate.
   */
  const navigate = async (
    action: NavigateActionPayload & { actionId?: string },
  ) => {
    if (!journey || !journeyId || !journey.screens) return;
    console.log({ action });
    const navType = action.navigation_type || 'push';
    const targetScreenId =
      'target' in action ? (action as any).target : undefined;

    if (action.navigation_type === 'reset' && targetScreenId) {
      return restartJourney(journeyId, targetScreenId);
    }

    // ── Back navigation always bypasses system step ────────────────────────
    const earlyResolved = action?.actionId
      ? resolveDirection(action.actionId)
      : { direction: action?.direction ?? 'next' };
    const earlyDirection = (
      typeof earlyResolved === 'string'
        ? earlyResolved
        : earlyResolved.direction
    ).toLowerCase();

    if (earlyDirection === 'back') {
      pushToScreen('back', targetScreenId, navType);
      return;
    }

    // ── System step: call API, navigate on result ──────────────────────────
    if (currentStep?.type === 'system') {
      if (isExecuting) return; // debounce double-taps
      setIsExecuting(true);

      try {
        const result = await executeSystemStep(
          currentStep.service ?? '',
          currentStep.operation ?? '',
          currentStep.params,
        );

        if (result.success) {
          const successDir =
            (currentStep.onSuccess as any)?.direction ?? 'next';
          pushToScreen(successDir, targetScreenId, navType);
        } else {
          const failDir = (currentStep.onFailure as any)?.direction;
          if (failDir) {
            pushToScreen(failDir, targetScreenId, navType);
          } else {
            Alert.alert(
              'Something went wrong',
              result.error || 'An unexpected error occurred. Please try again.',
            );
          }
        }
      } finally {
        setIsExecuting(false);
      }
      return;
    }

    // ── User step: resolve direction from onSubmit actionId ────────────────
    const resolved = action?.actionId
      ? resolveDirection(action.actionId)
      : { direction: action?.direction ?? 'next' };

    const direction = resolved.direction.toLowerCase();
    const resolvedTarget = resolved.target ?? targetScreenId;
    pushToScreen(direction, resolvedTarget, navType);
  };

  const isFirst = currentIndex === 0;
  const isLast = journey
    ? currentIndex === (journey?.screens?.length ?? 0) - 1
    : false;
  const currentScreen = journey?.screens?.[currentIndex] ?? null;
  const totalSteps = journey?.screens?.length ?? 0;

  return {
    navigate,
    goNext: () => navigate({ direction: 'next', navigation_type: 'push' }),
    goBack: () => navigate({ direction: 'back', navigation_type: 'push' }),
    jumpTo: (target: string) =>
      navigate({ direction: 'jump', target, navigation_type: 'push' }),
    currentScreen,
    currentIndex,
    isFirst,
    isLast,
    totalSteps,
    journey,
    restartJourney,
    navigator,
    clearSession,
    isExecuting,
    currentStep,
    preStartScreen,
  };
};
