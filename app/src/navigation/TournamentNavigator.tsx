import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TournamentStackParamList } from './types';
import TournamentDetailModal from '../screens/tournament/TournamentDetailModal';
import RegistrationTeamSelect from '../screens/tournament/RegistrationTeamSelect';
import RegistrationSummary from '../screens/tournament/RegistrationSummary';
import RegistrationMemberSelect from '../screens/tournament/RegistrationMemberSelect';
import PaymentWebView from '../screens/tournament/PaymentWebView';
import BracketScreen from '../screens/tournament/BracketScreen';
import LiveMatchScreen from '../screens/match/LiveMatchScreen';
import CreateTournamentScreen from '../screens/tournament/CreateTournamentScreen';

const Stack = createNativeStackNavigator<TournamentStackParamList>();

export default function TournamentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TournamentDetail" component={TournamentDetailModal} options={{ presentation: 'modal' }} />
      <Stack.Screen name="RegistrationTeamSelect" component={RegistrationTeamSelect} />
      <Stack.Screen name="RegistrationMemberSelect" component={RegistrationMemberSelect} />
      <Stack.Screen name="RegistrationSummary" component={RegistrationSummary} />
      <Stack.Screen
        name="PaymentWebView"
        component={PaymentWebView}
      />
      <Stack.Screen name="BracketView" component={BracketScreen} />
      <Stack.Screen
        name="LiveMatch"
        component={LiveMatchScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} />
    </Stack.Navigator>
  );
}
