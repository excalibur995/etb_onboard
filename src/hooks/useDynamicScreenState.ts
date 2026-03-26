import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useJourneyStore } from '../store/useJourneyStore';

import { DynamicScreenContentProps } from '../components/core/DynamicScreenZone';
import { useValidation } from '../components/core/ValidationContext';
import { NavigateActionPayload } from '../types/api';
import { useJourneyNavigation } from './useJourneyNavigation';

export function useDynamicScreenState(props: DynamicScreenContentProps) {
  const { screenData, journeyId, navigate, screenId } = props;
  const { validateAll } = useValidation();

  const navigation = useNavigation();

  const { isFirst, currentIndex, totalSteps, preStartScreen } =
    useJourneyNavigation(journeyId ?? '', screenId);

  const clearSession = useJourneyStore(state => state.clearSession);

  const handleExit = useCallback(() => {
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. Discard them and leave the screen?',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => {} },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            clearSession(journeyId);
            navigation.reset({
              index: 0,
              routes: [{ name: preStartScreen as never }],
            });
          },
        },
      ],
    );
  }, [clearSession, journeyId, preStartScreen, navigation]);

  const handleNavigate = useCallback(
    (action: NavigateActionPayload) => {
      if (action?.direction !== 'back') {
        const isValid = validateAll();
        if (!isValid) {
          return;
        }
      }
      navigate(action);
    },
    [validateAll, navigate],
  );

  return {
    handleExit,
    handleNavigate,
    isFirst,
    currentIndex,
    totalSteps,
    screenData,
    journeyId,
    screenId,
    navigate,
    validateAll,
    clearSession,
    navigation,
  };
}
