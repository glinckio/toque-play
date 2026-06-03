import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';

const { width: SCREEN_W } = Dimensions.get('window');

const TAB_CONFIG: Record<string, { icon: string; iconFocused: string; label: string }> = {
  Home: { icon: 'home-outline', iconFocused: 'home', label: 'INÍCIO' },
  Explore: { icon: 'search-outline', iconFocused: 'search', label: 'EXPLORAR' },
  Teams: { icon: 'shield-outline', iconFocused: 'shield', label: 'EQUIPES' },
  Notifications: { icon: 'notifications-outline', iconFocused: 'notifications', label: 'AVISOS' },
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] ?? TAB_CONFIG.Home;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Ionicons
                  name={isFocused ? config.iconFocused : config.icon}
                  size={22}
                  color={isFocused ? colors.text : colors.textMuted}
                />
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10,10,16,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 36,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  tabLabelActive: {
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
});
