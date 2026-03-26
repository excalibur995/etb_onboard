import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRegion } from '../hooks/useRegion';
import { useLang } from '../utils/queries/journeyQueries';

export const SplashScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { currentLocale } = useRegion();
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const [animationDone, setAnimationDone] = useState(false);

  const { isFetched } = useLang(currentLocale);

  // phase 1 & 2 — logo + tagline
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });

    const timer = setTimeout(() => setAnimationDone(true), 2200);
    return () => clearTimeout(timer);
  }, [logoOpacity, logoScale, taglineOpacity]);

  // phase 3 — only navigate when BOTH animation and fetch are done
  useEffect(() => {
    if (!animationDone || !isFetched) return;

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 350,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('LoginScreen');
    });
  }, [animationDone, isFetched, screenOpacity, navigation]);

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
        { opacity: screenOpacity },
      ]}
    >
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoWrapper,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoCircleText}>$</Text>
          </View>
          <Text style={styles.wordmark}>Maybank</Text>
        </Animated.View>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Humanising Financial Services
        </Animated.Text>
      </View>

      <Animated.Text style={[styles.footer, { opacity: taglineOpacity }]}>
        Secure · Trusted · Global
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD600',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  logoWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircleText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFD600',
  },
  wordmark: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1.5,
    color: '#000000',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    letterSpacing: 0.2,
  },
  footer: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555555',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
