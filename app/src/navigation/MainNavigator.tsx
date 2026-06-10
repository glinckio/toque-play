import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/main/HomeScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import TeamsScreen from '../screens/main/TeamsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CustomTabBar from '../components/CustomTabBar';
import TabScreenWrapper from './TabScreenWrapper';

const Tab = createBottomTabNavigator<MainTabParamList>();

const withWrapper = (Component: React.ComponentType) =>
  function AnimatedScreen(props: any) {
    return (
      <TabScreenWrapper>
        <Component {...props} />
      </TabScreenWrapper>
    );
  };

export default function MainNavigator() {
  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={withWrapper(HomeScreen)} />
        <Tab.Screen name="Explore" component={withWrapper(ExploreScreen)} />
        <Tab.Screen name="Teams" component={withWrapper(TeamsScreen)} />
        <Tab.Screen name="Notifications" component={withWrapper(NotificationsScreen)} />
        <Tab.Screen name="Profile" component={withWrapper(ProfileScreen)} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
