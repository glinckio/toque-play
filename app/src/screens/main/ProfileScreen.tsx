import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { useAuthStore } from '../../stores/authStore';
import { userService } from '../../services/user';
import { formatPhoneBR } from '../../utils/phone';
import HeroHeader from '../../components/HeroHeader';
import type { RootStackParamList } from '../../navigation/types';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

const MANAGEMENT_ITEMS = [
  { icon: 'shield-outline', label: 'Meus times', screen: 'MyTeams' as const },
  { icon: 'trophy-outline', label: 'Meus torneios', screen: 'MyTournaments' as const },
  { icon: 'clipboard-outline', label: 'Minhas inscrições', screen: 'MyRegistrations' as const },
  { icon: 'flash-outline', label: 'Meus amistosos', screen: 'MyFriendlies' as const },
  { icon: 'eye-outline', label: 'Minhas arbitragens', screen: 'MyReferees' as const },
  { icon: 'lock-closed-outline', label: 'Privacidade e consentimentos', screen: 'PrivacyConsents' as const },
];

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const rootNav = useNavigation<RootNav>();
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);

  const uploadAndSetAvatar = async (uri: string) => {
    setUploadingAvatar(true);
    try {
      const updated = await userService.uploadAvatar(uri);
      setUser(updated);
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar o avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAndSetAvatar(result.assets[0].uri);
    }
  };

  const handleGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAndSetAvatar(result.assets[0].uri);
    }
  };

  const handleAvatarPress = () => {
    Alert.alert('Foto de perfil', undefined, [
      { text: 'Tirar foto', onPress: handleCamera },
      { text: 'Escolher da galeria', onPress: handleGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

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
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.7}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                {uploadingAvatar ? (
                  <ActivityIndicator color={colors.primary} />
                ) : user?.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarLetter}>
                    {(user?.name ?? 'J').charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={13} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
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

        {/* Contact card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CONTATO</Text>
          <TouchableOpacity
            style={styles.contactEditBtn}
            onPress={() => rootNav.navigate('EditProfile')}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>NOME</Text>
              <Text style={styles.contactValue} numberOfLines={1}>{user?.name ?? '—'}</Text>
            </View>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>TELEFONE</Text>
              <Text style={styles.contactValue}>
                {user?.phone ? formatPhoneBR(user.phone) : 'Não informado'}
              </Text>
            </View>
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
                  rootNav.navigate(item.screen as any);
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
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 24,
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

  // ─── Contact card ────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  contactEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.xs,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  contactIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.xs,
    color: colors.textPlaceholder,
    letterSpacing: typography.letterSpacing.extraWide,
    marginBottom: 2,
  },
  contactValue: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.input,
    color: colors.text,
  },
  contactDivider: {
    height: 1,
    backgroundColor: '#F4EFFA',
    marginLeft: 54,
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
