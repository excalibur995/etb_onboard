import { getLocales } from 'react-native-localize';
import { AVAILABLE_REGION } from '../constants/constant';

export const useRegion = () => {
  const { 0: locale } = getLocales();
  const currentLocale = AVAILABLE_REGION.test(locale.languageCode)
    ? locale.languageCode
    : 'en';

  return { currentLocale };
};
