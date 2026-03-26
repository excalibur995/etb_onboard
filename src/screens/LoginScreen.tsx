import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const { width } = Dimensions.get('window');

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  const { t } = useTranslation('auth_onboarding');

  return (
    <View style={styles.container}>
      {/* Top Half */}
      <View style={[styles.topHalf, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoCircleText}>$</Text>
            </View>
            <Text style={styles.logoText}>Maybank</Text>
          </View>
          <LanguageSwitcher />
        </View>

        <View style={styles.illustrationContainer}>
          <Text style={styles.globeEmoji}>🌍</Text>
        </View>

        <View style={styles.textContent}>
          <Text style={styles.title}>{t('landing.page_title')}</Text>
          <Text style={styles.subtitle}>{t('landing.description')}</Text>
        </View>
      </View>

      {/* Bottom Half */}
      <View style={[styles.bottomHalf, { paddingBottom: insets.bottom }]}>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('JourneyLauncher', {
                journeyId: 'PLAT_AUTH_ONBOARDING',
              })
            }
          >
            <Text style={styles.primaryButtonText}>
              {t('landing.cta_existing_customer')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>
              {t('landing.cta_new_customer')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton} activeOpacity={0.8}>
            <Text style={styles.tertiaryButtonText}>
              {t('landing.cta_guest')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHalf: {
    flex: 1,
    backgroundColor: '#F5FAEB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD600',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  logoCircleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#000',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  globeEmoji: {
    fontSize: width * 0.45,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomHalf: {
    flex: 0.5,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  actionsContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FFD600',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  tertiaryButton: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0055FF',
  },
});
