import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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
import { useAuthStore } from './src/stores/authStore';

const RootStack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'BebasNeue-Regular': fontAssets.fonts[0],
    'Rajdhani-Light': fontAssets.fonts[1],
    'Rajdhani-Regular': fontAssets.fonts[2],
    'Rajdhani-Medium': fontAssets.fonts[3],
    'Rajdhani-SemiBold': fontAssets.fonts[4],
    'Rajdhani-Bold': fontAssets.fonts[5],
    'Inter-Regular': fontAssets.fonts[6],
    'Inter-Medium': fontAssets.fonts[7],
    'Inter-SemiBold': fontAssets.fonts[8],
    'Inter-Bold': fontAssets.fonts[9],
    'SFProDisplay-Regular': fontAssets.fonts[10],
    'SFProDisplay-Medium': fontAssets.fonts[11],
    'SFProDisplay-Bold': fontAssets.fonts[12],
  });

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  if (!fontsLoaded || !hasHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Main" component={MainNavigator} />
          <RootStack.Screen
            name="Tournament"
            component={TournamentNavigator}
            options={{ presentation: 'modal' }}
          />
          <RootStack.Screen
            name="Team"
            component={TeamNavigator}
            options={{ presentation: 'modal' }}
          />
          <RootStack.Screen
            name="Friendly"
            component={FriendlyNavigator}
            options={{ presentation: 'modal' }}
          />
          <RootStack.Screen
            name="RefereeCodeEntry"
            component={RefereeCodeEntryScreen}
            options={{ presentation: 'modal' }}
          />
          <RootStack.Screen
            name="MyReferees"
            component={MyRefereesScreen}
          />
          <RootStack.Screen
            name="MyTournaments"
            component={MyTournamentsScreen}
          />
          <RootStack.Screen
            name="MyRegistrations"
            component={MyRegistrationsScreen}
          />
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
});
