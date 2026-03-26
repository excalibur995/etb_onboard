import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useJourneyStore } from '../../store/useJourneyStore';
import {
  GuardRule,
  NavigateActionPayload,
  ScreenAction,
} from '../../types/api';

export interface ButtonWidgetProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  action: ScreenAction;
  journeyId: string;
  onNavigate: (payload: NavigateActionPayload & { actionId?: string }) => void;
  isExecuting?: boolean;
}

export const ButtonWidget: React.FC<ButtonWidgetProps> = ({
  label,
  variant = 'primary',
  action,
  journeyId,
  onNavigate,
  isExecuting = false,
}) => {
  const { t } = useTranslation('auth_onboarding') as any;

  const handlePress = () => {
    // Evaluate guards from action.guards (logic.op shape from Strapi)
    if (action.guards && action.guards.length > 0) {
      const session = useJourneyStore.getState().getSession(journeyId);
      console.log({ state: session?.journeyState, guard: action.guards });
      const failedGuard = action.guards.find(
        guard => !evaluateGuard(guard, session?.journeyState),
      );
      if (failedGuard) {
        Alert.alert(
          'Cannot proceed',
          failedGuard.description ?? 'Please fill in all required fields.',
        );
        return;
      }
    }

    // Always route via action.key → steps[].onSubmit[].actionId in useJourneyNavigation
    // action.payload is null when the backend stores direction in steps, which is the norm.
    onNavigate({
      direction: 'next',
      navigation_type: 'push',
      actionId: action.key,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isExecuting}
      style={[styles.base, styles[variant], isExecuting && styles.executing]}
      activeOpacity={0.75}
    >
      {isExecuting ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#000000' : '#6B7280'}
        />
      ) : (
        <Text
          style={[
            styles.label,
            styles[`${variant}Label` as keyof typeof styles],
          ]}
        >
          {t(label)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const evaluateGuard = (
  guard: GuardRule,
  journeyState: Record<string, unknown> | undefined,
): boolean => {
  if (!journeyState) return false;

  // logic can be a single condition or an array of AND conditions
  const conditions = Array.isArray(guard.logic) ? guard.logic : [guard.logic];

  return conditions.every(({ field, op, value }) => {
    const stateValue = journeyState[field];
    const journeyValue = journeyState[value as string];
    switch (op) {
      case 'notEmpty':
        return (
          stateValue !== null && stateValue !== undefined && stateValue !== ''
        );
      case 'equals':
      case 'eq':
        return stateValue === journeyValue;
      case 'notEquals':
        return stateValue !== journeyValue;
      case 'minLength':
        return (
          typeof stateValue === 'string' && stateValue.length >= Number(value)
        );
      default:
        console.warn(`[ButtonWidget] Unknown guard op: ${op}`);
        return true; // Fail-open for unknown ops
    }
  });
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    width: '100%',
  },
  primary: {
    backgroundColor: '#FFCC00',
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#EF4444',
  },
  executing: {
    opacity: 0.7,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryLabel: {
    color: '#000000',
  },
  secondaryLabel: {
    color: '#000000',
  },
  ghostLabel: {
    color: '#2563EB',
    fontWeight: '600',
  },
  dangerLabel: {
    color: '#FFFFFF',
  },
});
