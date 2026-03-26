import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useJourneyStore } from '../../store/useJourneyStore';
import {
  NavigateActionPayload,
  SduiBinding,
  SduiValidation,
} from '../../types/api';
import { useValidation } from '../core/ValidationContext';

type Props = {
  label?: string;
  placeholder?: string;
  binding: SduiBinding;
  keyboard: KeyboardTypeOptions;
  secured?: boolean;
  validation: SduiValidation[];
  journeyId: string;
  onNavigate: (payload: NavigateActionPayload) => void;
};

export const TextInputWidget: React.FC<Props> = ({
  label,
  placeholder,
  binding,
  journeyId,
  keyboard,
  secured = false,
  validation,
}) => {
  const { t } = useTranslation();
  const {
    registerValidation,
    unregisterValidation,
    errors,
    clearError,
    validateField,
  } = useValidation();

  React.useEffect(() => {
    if (validation && validation.length > 0) {
      registerValidation(binding.path, validation);
    }
    return () => unregisterValidation(binding.path);
  }, [binding.path, validation, registerValidation, unregisterValidation]);

  const updateSession = useJourneyStore(state => state.updateSession);
  const session = useJourneyStore(state => state.getSession(journeyId));
  const value = (session?.journeyState[binding.path] ??
    binding.defaultValue ??
    '') as string;
  const error = errors[binding.path];

  const handleChange = (text: string) => {
    updateSession(journeyId, {
      journeyState: {
        ...session?.journeyState,
        [binding.path]: text,
      },
    });
    if (error) clearError(binding.path);
  };

  const handleBlur = () => {
    if (validation && validation.length > 0) {
      validateField(binding.path, value);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{t(label)}</Text>}
      <TextInput
        placeholder={t(placeholder || '')}
        placeholderTextColor="#9CA3AF"
        value={value}
        keyboardType={keyboard}
        secureTextEntry={secured}
        onChangeText={handleChange}
        onBlur={handleBlur}
        style={[styles.input, error ? styles.inputError : null]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});
