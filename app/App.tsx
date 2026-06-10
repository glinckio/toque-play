import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { fontAssets } from './src/theme/fonts';
import { colors } from './src/theme/colors';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import TournamentNavigator from './src/navigation/TournamentNavigator';
import TeamNavigator from './src/navigation/TeamNavigator';
import FriendlyNavigator from './src/navigation/FriendlyNavigator';
import RefereeCodeEntryScreen from './src/screens/match/RefereeCodeEntryScreen';
import MyRefereesScreen from './src/screens/main/MyRefereesScreen';
import MyTournamentsScreen from './src/screens/tournament/MyTournamentsScreen';
import MyRegistrationsScreen from './src/screens/registration/MyRegistrationsScreen';
import SplashScreen from './src/screens/splash/SplashScreen';
import { useAuthStore } from './src/stores/authStore';
import { preloadHomeData } from './src/utils/homePreload';

const RootStack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'BebasNeue-Regular': fontAssets.fonts[0],
    'Manrope-Regular': fontAssets.fonts[1],
    'Manrope-Medium': fontAssets.fonts[2],
    'Manrope-SemiBold': fontAssets.fonts[3],
    'Manrope-Bold': fontAssets.fonts[4],
    'AzeretMono-Regular': fontAssets.fonts[5],
    'AzeretMono-Bold': fontAssets.fonts[6],
    'IBMPlexSans-Regular': fontAssets.fonts[7],
    'IBMPlexSans-Medium': fontAssets.fonts[8],
    'IBMPlexSans-SemiBold': fontAssets.fonts[9],
  });

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const [forceReady, setForceReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fallback: force ready after 5s even if fonts or hydration stuck
  useEffect(() => {
    const t = setTimeout(() => setForceReady(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // Preload home data during splash so HomeScreen renders instantly
  useEffect(() => {
    if (isAuthenticated && hasHydrated) {
      preloadHomeData();
    }
  }, [isAuthenticated, hasHydrated]);

  const ready = (fontsLoaded || forceReady) && (hasHydrated || forceReady);

  const handleSplashEnd = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setSplashDone(true));
  };

  // Still loading — show splash
  if (!splashDone) {
    return (
      <>
        {ready && (
          <Animated.View style={[styles.navWrap, { opacity: fadeAnim }]}>
            <NavigationContainer>
              {isAuthenticated ? (
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                  <RootStack.Screen name="Main" component={MainNavigator} />
                  <RootStack.Screen name="Tournament" component={TournamentNavigator} options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                  <RootStack.Screen name="Team" component={TeamNavigator} options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                  <RootStack.Screen name="Friendly" component={FriendlyNavigator} options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                  <RootStack.Screen name="RefereeCodeEntry" component={RefereeCodeEntryScreen} options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
                  <RootStack.Screen name="MyReferees" component={MyRefereesScreen} />
                  <RootStack.Screen name="MyTournaments" component={MyTournamentsScreen} />
                  <RootStack.Screen name="MyRegistrations" component={MyRegistrationsScreen} />
                </RootStack.Navigator>
              ) : (
                <AuthNavigator />
              )}
            </NavigationContainer>
          </Animated.View>
        )}
        {/* Splash on top, fades out when ready */}
        {!splashDone && (
          <Animated.View style={[styles.splashWrap, { opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]} pointerEvents={ready ? 'none' : 'auto'}>
            <SplashScreen onAnimationEnd={handleSplashEnd} />
          </Animated.View>
        )}
      </>
    );
  }

  // Normal app
  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Main" component={MainNavigator} />
          <RootStack.Screen name="Tournament" component={TournamentNavigator} options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
          <RootStack.Screen name="Team" component={TeamNavigator} options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
          <RootStack.Screen name="Friendly" component={FriendlyNavigator} options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
          <RootStack.Screen name="RefereeCodeEntry" component={RefereeCodeEntryScreen} options={{ presentation: 'card', animation: 'slide_from_bottom' }} />
          <RootStack.Screen name="MyReferees" component={MyRefereesScreen} />
          <RootStack.Screen name="MyTournaments" component={MyTournamentsScreen} />
          <RootStack.Screen name="MyRegistrations" component={MyRegistrationsScreen} />
        </RootStack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  splashWrap: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  navWrap: {
    flex: 1,
  },
});
