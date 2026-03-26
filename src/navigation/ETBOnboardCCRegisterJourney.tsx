import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useJourney } from '../utils/queries/journeyQueries';

import { I18nextProvider } from 'react-i18next';
import AuthConsentScreen from '../screens/auth/AuthConsentScreen';
import AuthLoginUsernameScreen from '../screens/auth/AuthLoginUsernameScreen';
import AuthM2uCreatePasswordScreen from '../screens/auth/AuthM2uCreatePasswordScreen';
import AuthM2uCreateUsernameScreen from '../screens/auth/AuthM2uCreateUsernameScreen';
import AuthRegCcScreen from '../screens/auth/AuthRegCcScreen';
import AuthSecurityImageScreen from '../screens/auth/AuthSecurityImageScreen';
import { FALLBACK_JOURNEYS } from '../utils/config/fallbackJourney';
import i18n from '../utils/i18n';

export type AuthJourneyParamList = {
  PLAT_AUTH_CONSENT: { journeyId?: string };
  PLAT_AUTH_LOGIN_USERNAME: { journeyId?: string };
  PLAT_AUTH_M2U_CREATE_USERNAME: { journeyId?: string };
  PLAT_AUTH_M2U_CREATE_PASSWORD: { journeyId?: string };
  PLAT_AUTH_SECURITY_IMAGE: { journeyId?: string };
  PLAT_AUTH_REG_CC_DETAILS: { journeyId?: string };
};

const Stack = createNativeStackNavigator<AuthJourneyParamList>();

export default function ETBOnboardCCRegisterJourney({ route }: any) {
  const { journeyId } = route.params ?? {};

  const { data: journey, isLoading } = useJourney(journeyId);

  const { initialRouteName, presentation } = useMemo(() => {
    if (!journey || !journey.screens || journey.screens.length === 0) {
      return {
        initialRouteName: FALLBACK_JOURNEYS.PLAT_AUTH_ONBOARDING
          .initialScreenId as keyof AuthJourneyParamList,
        presentation: FALLBACK_JOURNEYS.PLAT_AUTH_ONBOARDING
          .initialPresentation as any,
      };
    }

    return {
      initialRouteName: journey.screens[0]
        .screenId as keyof AuthJourneyParamList,
      presentation:
        (journey.presentation as any) ??
        FALLBACK_JOURNEYS.PLAT_AUTH_ONBOARDING.initialPresentation,
    };
  }, [journey]);

  if (isLoading) {
    return (
      <View style={style.center}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS={'auth_onboarding'}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          contentStyle: {
            backgroundColor: '#F9F8F4',
          },
          presentation,
        }}
      >
        <Stack.Screen
          name="PLAT_AUTH_CONSENT"
          component={AuthConsentScreen}
          initialParams={{ journeyId }}
        />
        <Stack.Screen
          name="PLAT_AUTH_LOGIN_USERNAME"
          component={AuthLoginUsernameScreen}
          initialParams={{ journeyId }}
        />
        <Stack.Screen
          name="PLAT_AUTH_REG_CC_DETAILS"
          component={AuthRegCcScreen}
          initialParams={{ journeyId }}
        />
        <Stack.Screen
          name="PLAT_AUTH_M2U_CREATE_USERNAME"
          component={AuthM2uCreateUsernameScreen}
          initialParams={{ journeyId }}
        />
        <Stack.Screen
          name="PLAT_AUTH_M2U_CREATE_PASSWORD"
          component={AuthM2uCreatePasswordScreen}
          initialParams={{ journeyId }}
        />
        <Stack.Screen
          name="PLAT_AUTH_SECURITY_IMAGE"
          component={AuthSecurityImageScreen}
          initialParams={{ journeyId }}
        />
      </Stack.Navigator>
    </I18nextProvider>
  );
}

const style = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
