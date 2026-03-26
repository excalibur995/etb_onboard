export const FALLBACK_JOURNEYS = {
  PLAT_AUTH_ONBOARDING: {
    journeyId: 'PLAT_AUTH_ONBOARDING',
    navigator: 'CurrentAccountJourneyNavigator',
    initialState: {
      consentAccepted: false,
      username: null,
      password: null,
      newUsername: null,
      newPassword: null,
      confirmPassword: null,
      securityImage: null,
    },
    initialScreenId: 'PLAT_AUTH_CONSENT',
    initialPresentation: 'card',
    preInitiateScreen: 'LoginScreen',
    isFallback: true,
  },
};
