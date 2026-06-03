import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const { width: SCREEN_W } = Dimensions.get('window');
const SIDEBAR_W = SCREEN_W * 0.82;

const MENU_ITEMS = [
  // { icon: 'person-outline', label: 'Editar Perfil', screen: 'EditProfile' },
  { icon: 'trophy-outline', label: 'Meus Torneios', screen: 'MyTournaments' },
  { icon: 'clipboard-outline', label: 'Minhas Inscrições', screen: 'MyRegistrations' },
  { icon: 'flash-outline', label: 'Meus Amistosos', screen: 'MyFriendlies' },
  { icon: 'flag-outline', label: 'Minhas Arbitragens', screen: 'MyReferees' },
  // { icon: 'settings-outline', label: 'Configurações', screen: 'Settings' },
];

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const firstName = user?.name ?? 'Jogador';

  const slideX = useRef(new Animated.Value(SIDEBAR_W)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isOpen = useRef(false);

  useEffect(() => {
    if (visible) {
      isOpen.current = true;
      Animated.parallel([
        Animated.timing(slideX, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      if (isOpen.current) {
        isOpen.current = false;
        Animated.parallel([
          Animated.timing(slideX, {
            toValue: SIDEBAR_W,
            duration: 250,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();
      }
      isOpen.current = false;
    }
  }, [visible]);

  if (!visible && !isOpen.current) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropOpacity }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Panel */}
      <Animated.View
        style={[styles.panel, { transform: [{ translateX: slideX }] }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        {/* Header glow */}
        <View style={styles.headerGlow} />

        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <LinearGradient
              colors={[colors.primary, colors.primaryGlow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitial}>
                {firstName.charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>{user?.name ?? 'Jogador'}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.screen} style={styles.menuItem} activeOpacity={0.7}
              onPress={() => {
                onClose();
                if (item.screen === 'MyReferees') {
                  rootNav.navigate('MyReferees');
                } else if (item.screen === 'MyTournaments') {
                  rootNav.navigate('MyTournaments');
                } else if (item.screen === 'MyRegistrations') {
                  rootNav.navigate('MyRegistrations');
                } else if (item.screen === 'MyFriendlies') {
                  rootNav.navigate('Friendly', { screen: 'MyFriendlies' });
                }
              }}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            onClose();
            clearAuth();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>toqueplay v1.0.0</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 90,
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: SIDEBAR_W,
    backgroundColor: colors.background,
    zIndex: 100,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.04)',
  },
  headerGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.08,
  },

  closeBtn: {
    position: 'absolute',
    top: 60,
    left: spacing.xl,
    zIndex: 10,
  },

  profileCard: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  avatarGradient: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: fonts.title.display,
    fontSize: 32,
    color: colors.text,
  },
  profileName: {
    fontFamily: fonts.title.display,
    fontSize: 24,
    color: colors.text,
    letterSpacing: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontFamily: fonts.text.regular,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(76,175,80,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    color: colors.success,
    fontFamily: fonts.text.semiBold,
    letterSpacing: 1,
  },

  menu: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: fonts.text.regular,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: 16,
    backgroundColor: 'rgba(255,77,77,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,77,77,0.15)',
  },
  logoutText: {
    fontSize: 14,
    color: colors.error,
    letterSpacing: 2,
    fontFamily: fonts.text.semiBold,
  },

  version: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    letterSpacing: 1,
  },
});
