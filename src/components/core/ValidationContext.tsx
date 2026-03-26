import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { useJourneyStore } from '../../store/useJourneyStore';
import { SduiValidation } from '../../types/api';

type ValidationContextType = {
  errors: Record<string, string>;
  registerValidation: (path: string, validations: SduiValidation[]) => void;
  unregisterValidation: (path: string) => void;
  validateAll: () => boolean;
  validateField: (path: string, value: unknown) => boolean;
  clearError: (path: string) => void;
  clearErrors: () => void;
};

const ValidationContext = createContext<ValidationContextType | undefined>(
  undefined,
);

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within a ValidationProvider');
  }
  return context;
};

/**
 * Evaluate a single SduiValidation rule against a value.
 * Returns the error message if the rule fails, undefined if it passes.
 */
const evaluateRule = (
  rule: SduiValidation,
  value: unknown,
): string | undefined => {
  const str = typeof value === 'string' ? value : '';

  switch (rule.rule) {
    case 'required':
      if (value === undefined || value === null || str === '') {
        return rule.message || 'This field is required';
      }
      break;
    case 'minLength': {
      const min = Number(rule.value);
      if (str.length < min) return rule.message || `Minimum ${min} characters`;
      break;
    }
    case 'maxLength': {
      const max = Number(rule.value);
      if (str.length > max) return rule.message || `Maximum ${max} characters`;
      break;
    }
    case 'pattern': {
      if (str) {
        try {
          const regex = new RegExp(rule.value as string);
          if (!regex.test(str)) {
            return rule.message || 'Invalid format';
          }
        } catch {
          console.warn(`[Validation] Invalid regex: ${rule.value}`);
        }
      }
      break;
    }
    case 'email': {
      if (str && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
        return rule.message || 'Invalid email address';
      }
      break;
    }
  }
  return undefined;
};

/** Run all rules for a path/value, return the first error message or undefined. */
const runRules = (
  rules: SduiValidation[],
  value: unknown,
): string | undefined => {
  for (const rule of rules) {
    const err = evaluateRule(rule, value);
    if (err) return err;
  }
  return undefined;
};

export const ValidationProvider: React.FC<{
  journeyId: string;
  children: React.ReactNode;
}> = ({ journeyId, children }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validationRules = useRef<Record<string, SduiValidation[]>>({});

  const registerValidation = useCallback(
    (path: string, validations: SduiValidation[]) => {
      validationRules.current[path] = validations;
    },
    [],
  );

  const unregisterValidation = useCallback((path: string) => {
    delete validationRules.current[path];
    setErrors(prev => {
      if (prev[path]) {
        const next = { ...prev };
        delete next[path];
        return next;
      }
      return prev;
    });
  }, []);

  const clearError = useCallback((path: string) => {
    setErrors(prev => {
      if (prev[path]) {
        const next = { ...prev };
        delete next[path];
        return next;
      }
      return prev;
    });
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  /**
   * Validate a single field immediately (e.g. on blur).
   * Only runs if the field has registered rules.
   * Returns true if valid.
   */
  const validateField = useCallback((path: string, value: unknown): boolean => {
    const rules = validationRules.current[path];
    if (!rules || rules.length === 0) return true;

    const error = runRules(rules, value);
    setErrors(prev => {
      if (!error) {
        if (!prev[path]) return prev; // no change
        const next = { ...prev };
        delete next[path];
        return next;
      }
      if (prev[path] === error) return prev; // no change
      return { ...prev, [path]: error };
    });
    return !error;
  }, []);

  const getSession = useJourneyStore(state => state.getSession);

  const validateAll = useCallback(() => {
    const session = getSession(journeyId);
    const state = session?.journeyState || {};

    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(validationRules.current).forEach(([path, rules]) => {
      const error = runRules(rules, state[path]);
      if (error) {
        newErrors[path] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [journeyId, getSession]);

  return (
    <ValidationContext.Provider
      value={{
        errors,
        registerValidation,
        unregisterValidation,
        validateAll,
        validateField,
        clearError,
        clearErrors,
      }}
    >
      {children}
    </ValidationContext.Provider>
  );
};
