import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { MainNavigatorParamList } from '../navigation/MainNavigator';
import { useJourneyStore } from '../store/useJourneyStore';
import { FALLBACK_JOURNEYS } from '../utils/config/fallbackJourney';
import { useJourney } from '../utils/queries/journeyQueries';

const JourneyLauncher: React.FC<
  NativeStackScreenProps<MainNavigatorParamList, 'JourneyLauncher'>
> = ({ route, navigation }) => {
  const { journeyId } = route.params;
  const setSession = useJourneyStore(state => state.setSession);

  const {
    data: journeyData,
    isLoading,
    isError,
    isPaused, // React Query sets this when offline
    refetch,
  } = useJourney(journeyId);
  console.log('isLoading', isLoading);
  // Resolve: live data → persisted cache (automatic) → bundled fallback

  const resolvedJourney =
    journeyData ??
    FALLBACK_JOURNEYS[journeyId as keyof typeof FALLBACK_JOURNEYS];

  useEffect(() => {
    console.log({ resolvedJourney });
    if (!resolvedJourney) return;

    if ('isFallback' in resolvedJourney && resolvedJourney.isFallback) {
      console.warn(`[JourneyLauncher] Using bundled fallback for ${journeyId}`);
    }

    const firstScreen =
      'screens' in resolvedJourney && resolvedJourney?.screens?.[0];

    console.log({ firstScreen });
    if (!firstScreen) return;

    setSession(journeyId, {
      currentScreenIndex: 0,
      journeyState:
        (resolvedJourney.initialState as Record<string, unknown>) ?? {},
    });

    navigation.replace(resolvedJourney.navigator as any, { journeyId });
  }, [resolvedJourney, journeyId, navigation, setSession]);

  // We have a fallback — skip the loader entirely
  if (resolvedJourney) return null;

  if (isLoading || isPaused) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="orange" />
        {isPaused && (
          <Text style={styles.offlineHint}>Waiting for connection…</Text>
        )}
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Unable to load journey.</Text>
        <Text style={styles.retry} onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { fontSize: 16, color: '#333', marginBottom: 8 },
  retry: { fontSize: 14, color: '#1A56DB' },
  offlineHint: { fontSize: 12, color: '#666' },
});

export default JourneyLauncher;
