import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { DevToolsBubble } from 'react-native-react-query-devtools';
import HomeScreen from '../screens/base/HomeScreen';
import JourneyLauncher from '../screens/JourneyLauncher';
import { LoginScreen } from '../screens/LoginScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { queryClient } from '../utils/queryClient';
import ETBOnboardCCRegisterJourney from './ETBOnboardCCRegisterJourney';

export type MainNavigatorParamList = {
  SplashScreen: undefined;
  LoginScreen: undefined;
  JourneyLauncher: { journeyId: string };
  ETBOnboardCCRegisterJourney: { journeyId: string };
  HomeScreen: undefined;
};

const Stack = createNativeStackNavigator<MainNavigatorParamList>();

export const MainNavigator = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="JourneyLauncher" component={JourneyLauncher} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="ETBOnboardCCRegisterJourney"
            component={ETBOnboardCCRegisterJourney}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <DevToolsBubble queryClient={queryClient} />
    </QueryClientProvider>
  );
};
