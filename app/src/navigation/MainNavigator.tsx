import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/main/HomeScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import TeamsScreen from '../screens/main/TeamsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import CustomTabBar from '../components/CustomTabBar';
import Sidebar from '../components/Sidebar';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home">
          {(props) => <HomeScreen {...props} onAvatarPress={openSidebar} />}
        </Tab.Screen>
        <Tab.Screen name="Explore">
          {(props) => <ExploreScreen {...props} onAvatarPress={openSidebar} />}
        </Tab.Screen>
        <Tab.Screen name="Teams">
          {(props) => <TeamsScreen {...props} onAvatarPress={openSidebar} />}
        </Tab.Screen>
        <Tab.Screen name="Notifications">
          {(props) => <NotificationsScreen {...props} onAvatarPress={openSidebar} />}
        </Tab.Screen>
      </Tab.Navigator>

      <Sidebar visible={sidebarOpen} onClose={closeSidebar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
