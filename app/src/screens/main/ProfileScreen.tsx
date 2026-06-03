import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../components/AppHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { useAuthStore } from '../../stores/authStore';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Editar Perfil', screen: 'EditProfile' },
  { icon: 'trophy-outline', label: 'Meus Torneios', screen: 'MyTournaments' },
  { icon: 'clipboard-outline', label: 'Minhas Inscrições', screen: 'MyRegistrations' },
  { icon: 'flash-outline', label: 'Meus Amistosos', screen: 'MyFriendlies' },
  { icon: 'settings-outline', label: 'Configurações', screen: 'Settings' },
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return (
    <View style={styles.root}>
      <AppHeader title="PERFIL" showAvatar={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
                {(user?.name ?? 'J').charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
          <Text style={styles.profileName}>{user?.name ?? 'Jogador'}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
          {user?.isEmailVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>
          )}
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.screen} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={clearAuth} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>SAIR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    overflow: 'hidden',
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
});
