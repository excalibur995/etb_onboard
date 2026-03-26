import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguageStore } from '../store/useLanguageStore';
import { injectIntoI18next } from '../utils/i18n';
import { useLang } from '../utils/queries/journeyQueries';

const LANGS = ['en', 'id'] as const;
type Lang = (typeof LANGS)[number];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguageStore();

  useLang(language);

  const switchTo = async (lang: Lang) => {
    if (lang === language) return;
    try {
      setLanguage(lang);
    } catch {
      injectIntoI18next(lang, {});
      setLanguage(lang);
    }
  };

  return (
    <View style={styles.container}>
      {LANGS.map((lang, i) => {
        const isActive = language === lang;
        return (
          <React.Fragment key={lang}>
            {i > 0 && <Text style={styles.divider}>|</Text>}
            <TouchableOpacity
              onPress={() => switchTo(lang)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {lang.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    fontSize: 12,
    color: '#CCC',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    letterSpacing: 0.5,
  },
  labelActive: {
    color: '#000',
    fontWeight: '800',
  },
});
