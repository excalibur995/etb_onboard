import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'etb-onboard',
});

export const locale_language = createMMKV({
  id: 'locale-language',
});

