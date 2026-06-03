import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import FriendlyDetailScreen from '../screens/friendly/FriendlyDetailScreen';
import CreateFriendlyScreen from '../screens/friendly/CreateFriendlyScreen';
import MyFriendliesScreen from '../screens/friendly/MyFriendliesScreen';
import LiveMatchScreen from '../screens/match/LiveMatchScreen';

const Stack = createNativeStackNavigator();

export default function FriendlyNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="FriendlyDetail" component={FriendlyDetailScreen} />
      <Stack.Screen name="CreateFriendly" component={CreateFriendlyScreen} />
      <Stack.Screen name="MyFriendlies" component={MyFriendliesScreen} />
      <Stack.Screen name="LiveMatch" component={LiveMatchScreen} options={{ presentation: 'fullScreenModal' }} />
    </Stack.Navigator>
  );
}
