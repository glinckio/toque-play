import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { teamService } from '../../services/team';
import { registrationService } from '../../services/registration';
import type { TournamentStackParamList } from '../../navigation/types';
import type { TeamMember } from '../../types/team';

type Nav = NativeStackNavigationProp<TournamentStackParamList, 'RegistrationMemberSelect'>;
type Route = RouteProp<TournamentStackParamList, 'RegistrationMemberSelect'>;

export default function RegistrationMemberSelect() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tournamentId, teamId, categoryId, minMembers, maxMembers } = route.params;

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const [teamMembers, regData] = await Promise.all([
            teamService.findMembers(teamId),
            registrationService.getRegisteredMembers(tournamentId, teamId).catch(() => ({ memberIds: [] })),
          ]);
          setMembers(teamMembers);
          setBlockedIds(new Set(regData.memberIds));
        } catch {} finally {
          setLoading(false);
        }
      };
      setLoading(true);
      load();
    }, [teamId, tournamentId]),
  );

  const toggleMember = useCallback((memberId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        if (next.size <= minMembers) return prev;
        next.delete(memberId);
        setCaptainId((cap) => (cap === memberId ? null : cap));
      } else {
        if (next.size >= maxMembers) return prev;
        next.add(memberId);
        setCaptainId((cap) => cap ?? memberId);
      }
      return next;
    });
  }, [minMembers, maxMembers]);

  const setCaptain = useCallback((memberId: string) => {
    if (!selected.has(memberId)) return;
    setCaptainId(memberId);
  }, [selected]);

  const canSubmit = selected.size >= minMembers && selected.size <= maxMembers;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const reg = await registrationService.registerTeam(tournamentId, {
        teamId,
        categoryId,
        memberIds: Array.from(selected),
        captainMemberId: captainId ?? undefined,
      });
      navigation.replace('RegistrationSummary', { registrationId: reg.id });
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Erro ao inscrever time';
      Alert.alert('Erro', typeof msg === 'string' ? msg : 'Erro ao inscrever time');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  const availableCount = members.filter((m) => !blockedIds.has(m.id)).length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SELECIONAR ATLETAS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Info */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            Selecione {minMembers}{minMembers !== maxMembers ? `–${maxMembers}` : ''} jogadores
          </Text>
          <Text style={styles.infoCount}>
            {selected.size}/{maxMembers}
          </Text>
        </View>

        {availableCount < minMembers && (
          <View style={styles.warningCard}>
            <Ionicons name="alert-circle-outline" size={18} color="#FF9800" />
            <Text style={styles.warningText}>
              Jogadores insuficientes. Mínimo {minMembers} necessários, mas só {availableCount} disponíve{availableCount !== 1 ? 'is' : 'l'}.
            </Text>
          </View>
        )}

        {/* Member list */}
        <View style={styles.memberList}>
          {members.map((member) => {
            const isBlocked = blockedIds.has(member.id);
            const isSelected = selected.has(member.id);
            const isCaptain = captainId === member.id;
            const name = member.user?.name ?? member.guestName ?? '?';

            if (isBlocked) {
              return (
                <View key={member.id} style={[styles.memberCard, styles.memberCardBlocked]}>
                  <View style={styles.memberAvatarWrap}>
                    <View style={styles.memberAvatarBlocked}>
                      <Text style={styles.memberAvatarLetterMuted}>{name.charAt(0).toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberNameBlocked} numberOfLines={1}>{name}</Text>
                    <Text style={styles.blockedText}>Já inscrito neste torneio</Text>
                  </View>
                  <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberCard,
                  isSelected && styles.memberCardSelected,
                ]}
                onPress={() => toggleMember(member.id)}
                activeOpacity={0.7}
              >
                <View style={styles.memberAvatarWrap}>
                  <LinearGradient
                    colors={isSelected ? [colors.primary, colors.primaryGlow] : [colors.surfaceSoft, colors.surfaceSoft]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.memberAvatarGradient}
                  >
                    <Text style={[styles.memberAvatarLetter, !isSelected && styles.memberAvatarLetterMuted]}>
                      {name.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, isSelected && styles.memberNameSelected]} numberOfLines={1}>
                    {name}
                  </Text>
                  {member.isCaptain && (
                    <View style={styles.originalCaptainBadge}>
                      <Ionicons name="ribbon" size={10} color={colors.primaryGlow} />
                      <Text style={styles.originalCaptainText}>CAPITÃO DO TIME</Text>
                    </View>
                  )}
                </View>
                {isSelected && (
                  <View style={styles.memberActions}>
                    <TouchableOpacity
                      onPress={() => setCaptain(member.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={isCaptain ? 'star' : 'star-outline'}
                        size={20}
                        color={isCaptain ? '#FFD700' : colors.textMuted}
                      />
                    </TouchableOpacity>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primaryGlow} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom action */}
      {canSubmit && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryGlow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              {submitting ? (
                <ActivityIndicator color={colors.text} size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.text} />
                  <Text style={styles.ctaText}>CONFIRMAR INSCRIÇÃO</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontFamily: fonts.title.display, fontSize: 22, color: colors.text, letterSpacing: 2 },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  infoCount: {
    fontFamily: fonts.title.display,
    fontSize: 20,
    color: colors.text,
    letterSpacing: 1,
  },

  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,152,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,152,0,0.2)',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#FF9800',
    fontFamily: fonts.text.regular,
    lineHeight: 16,
  },

  memberList: { gap: spacing.md },

  // Available member
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  memberCardSelected: {
    borderColor: 'rgba(157,115,230,0.3)',
    backgroundColor: 'rgba(109,46,192,0.08)',
  },
  memberCardBlocked: {
    opacity: 0.45,
  },
  memberAvatarWrap: {},
  memberAvatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarBlocked: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarLetter: {
    fontFamily: fonts.title.display,
    fontSize: 18,
    color: colors.text,
  },
  memberAvatarLetterMuted: {
    color: colors.textMuted,
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 14,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  memberNameSelected: {
    color: colors.primaryGlow,
  },
  memberNameBlocked: {
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: fonts.text.semiBold,
  },
  blockedText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    marginTop: 2,
  },
  originalCaptainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  originalCaptainText: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.primaryGlow,
    fontFamily: fonts.text.bold,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Bottom
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(5,6,10,0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  ctaBtn: { borderRadius: 14, overflow: 'hidden' },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  ctaText: { fontSize: 14, letterSpacing: 2, color: colors.text, fontFamily: fonts.text.semiBold },
});
