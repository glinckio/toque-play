import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeamStackParamList } from './types';
import TeamDetailModal from '../screens/team/TeamDetailModal';
import AddMemberModal from '../screens/team/AddMemberModal';

const Stack = createNativeStackNavigator<TeamStackParamList>();

export default function TeamNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="TeamDetail" component={TeamDetailModal} />
      <Stack.Screen name="AddMember" component={AddMemberModal} />
    </Stack.Navigator>
  );
}
