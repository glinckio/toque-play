import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import EmailConfirmationScreen from '../screens/auth/EmailConfirmationScreen';
import EmailConfirmedScreen from '../screens/auth/EmailConfirmedScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<AuthStackParamList>();

function SplashWrapper() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  return <SplashScreen onDone={() => navigation.replace('Login')} />;
}

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{
      headerShown: false,
      animation: 'fade',
    }}>
      <Stack.Screen name="Splash" component={SplashWrapper} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="EmailConfirmation" component={EmailConfirmationScreen} />
      <Stack.Screen name="EmailConfirmed" component={EmailConfirmedScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
