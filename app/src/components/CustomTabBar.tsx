import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { useNotifStore } from '../stores/notifStore';
import CreateSheet from './CreateSheet';
import type { RootStackParamList } from '../navigation/types';

const { width: SCREEN_W } = Dimensions.get('window');
const BAR_W = Math.min(SCREEN_W - 32, 358);

const TAB_CONFIG: Record<string, { icon: string; iconFocused: string; label: string }> = {
  Home: { icon: 'home-outline', iconFocused: 'home', label: 'Início' },
  Explore: { icon: 'compass-outline', iconFocused: 'compass', label: 'Explorar' },
  Teams: { icon: 'shield-outline', iconFocused: 'shield', label: 'Criar' },
  Notifications: { icon: 'notifications-outline', iconFocused: 'notifications', label: 'Avisos' },
  Profile: { icon: 'person-outline', iconFocused: 'person', label: 'Perfil' },
};

const CREATE_INDEX = 2;

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const unreadCount = useNotifStore((s) => s.unreadCount);
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <CreateSheet
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onTournament={() => {
          setCreateOpen(false);
          rootNav.navigate('Tournament', { screen: 'CreateTournament' });
        }}
        onTeam={() => {
          setCreateOpen(false);
          navigation.navigate('Teams');
        }}
        onFriendly={() => {
          setCreateOpen(false);
          rootNav.navigate('Friendly', { screen: 'CreateFriendly' });
        }}
      />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.bar}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG[route.name] ?? TAB_CONFIG.Home;
            const isCenter = index === CREATE_INDEX;

            const onPress = () => {
              if (isCenter) {
                setCreateOpen(true);
                return;
              }
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Center create button
            if (isCenter) {
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  activeOpacity={0.7}
                  style={styles.centerButton}
                >
                  <Ionicons name="add" size={24} color="#FFFFFF" strokeWidth={2.5} />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={styles.tab}
              >
                <Ionicons
                  name={isFocused ? config.iconFocused : config.icon}
                  size={22}
                  color={isFocused ? colors.primary : colors.textMuted}
                />
                {route.name === 'Notifications' && unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                  </View>
                )}
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    width: BAR_W,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 8,
  },
  tab: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 44,
  },
  tabLabel: {
    fontFamily: fonts.text.semiBold,
    fontSize: 10,
    color: colors.textMuted,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF5050',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: fonts.text.bold,
    fontSize: 9,
    color: '#FFFFFF',
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
});
