import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { useAuthStore } from '../../stores/authStore';
import HeroHeader from '../../components/HeroHeader';
import type { RootStackParamList } from '../../navigation/types';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

const MANAGEMENT_ITEMS = [
  { icon: 'shield-outline', label: 'Meus times', screen: 'Teams' as const },
  { icon: 'trophy-outline', label: 'Meus torneios', screen: 'MyTournaments' as const },
  { icon: 'clipboard-outline', label: 'Minhas inscrições', screen: 'MyRegistrations' as const },
  { icon: 'flash-outline', label: 'Meus amistosos', screen: 'Friendly' as const },
  { icon: 'eye-outline', label: 'Minhas arbitragens', screen: 'MyReferees' as const },
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const rootNav = useNavigation<RootNav>();

  return (
    <View style={styles.root}>
      <HeroHeader
        title="PERFIL"
        watermark="PERFIL"
        rounded
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {(user?.name ?? 'J').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'Jogador'}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          {user?.isEmailVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>
          )}
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Times</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Torneios</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Vitórias</Text>
          </View>
        </View>

        {/* Management menu */}
        <Text style={styles.sectionTitle}>GERENCIAMENTO</Text>
        <View style={styles.menu}>
          {MANAGEMENT_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, i < MANAGEMENT_ITEMS.length - 1 && styles.menuItemBorder]}
              activeOpacity={0.7}
              onPress={() => {
                if (item.screen === 'Friendly') {
                  rootNav.navigate('Friendly', { screen: 'MyFriendlies' });
                } else {
                  rootNav.navigate(item.screen as any);
                }
              }}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={18} color={colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textPlaceholder} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Account menu */}
        <Text style={styles.sectionTitle}>CONTA</Text>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name="settings-outline" size={18} color={colors.textDefault} />
              </View>
              <Text style={styles.menuLabel}>Configurações</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textPlaceholder} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={clearAuth} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },

  userCard: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarLetter: {
    fontFamily: fonts.title.regular,
    fontSize: 32,
    color: colors.primary,
    lineHeight: 1,
  },
  userName: {
    fontFamily: fonts.text.bold,
    fontSize: typography.sizes.button,
    color: colors.text,
  },
  userEmail: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(31,184,122,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
  },
  verifiedText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.success,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: 4,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.title,
    color: colors.text,
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },

  sectionTitle: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.textPlaceholder,
    letterSpacing: typography.letterSpacing.extraWide,
    marginBottom: spacing.md,
  },

  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFFA',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.input,
    color: colors.text,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(224,69,69,0.08)',
  },
  logoutText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.error,
  },
});
