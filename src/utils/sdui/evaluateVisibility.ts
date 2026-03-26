import { useJourneyStore } from '../../store/useJourneyStore';

export const evaluateVisibility = (
  visibility: any,
  journeyId: string,
): boolean => {
  // null visibility = always show
  if (!visibility) return true;

  const getSession = useJourneyStore.getState().getSession;
  const session = getSession(journeyId);
  const state = session?.journeyState || {};
  const fieldValue = state[visibility.rule.field];
  const ruleResult = evaluateRule(visibility.rule, fieldValue);

  if (visibility.action === 'show') return ruleResult;
  if (visibility.action === 'hide') return !ruleResult;
  return true;
};

const evaluateRule = (rule: any, value: any): boolean => {
  switch (rule.operator) {
    case 'eq':
      return value === rule.value;
    case 'neq':
      return value !== rule.value;
    case 'exists':
      return value !== null && value !== undefined && value !== '';
    case 'empty':
      return value === null || value === undefined || value === '';
    case 'gt':
      return value > rule.value;
    case 'lt':
      return value < rule.value;
    case 'contains':
      if (Array.isArray(value)) return value.includes(rule.value);
      if (typeof value === 'string') return value.includes(rule.value);
      return false;
    default:
      return true;
  }
};
