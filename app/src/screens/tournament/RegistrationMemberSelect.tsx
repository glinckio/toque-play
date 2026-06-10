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
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts } from '../../theme/fonts';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';
import { teamService } from '../../services/team';
import { registrationService } from '../../services/registration';
import type { TournamentStackParamList } from '../../navigation/types';
import type { TeamMember } from '../../types/team';
import HeroHeader from '../../components/HeroHeader';
import ChevronButton from '../../components/ChevronButton';

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
        <HeroHeader title="SELECIONAR" watermark="PICK" onBack={() => navigation.goBack()} rounded />
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const availableCount = members.filter((m) => !blockedIds.has(m.id)).length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <HeroHeader title="SELECIONAR ATLETAS" watermark="PICK" onBack={() => navigation.goBack()} rounded />

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
            <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
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
                  <View style={styles.memberAvatarBlocked}>
                    <Text style={styles.memberAvatarLetterMuted}>{name.charAt(0).toUpperCase()}</Text>
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
                <View style={[styles.memberAvatar, isSelected && styles.memberAvatarSelected]}>
                  <Text style={[styles.memberAvatarLetter, !isSelected && styles.memberAvatarLetterMuted]}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, isSelected && styles.memberNameSelected]} numberOfLines={1}>
                    {name}
                  </Text>
                  {member.isCaptain && (
                    <View style={styles.captainBadge}>
                      <Ionicons name="ribbon" size={10} color={colors.primary} />
                      <Text style={styles.captainBadgeText}>CAPITÃO DO TIME</Text>
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
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
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
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit}
            disabled={submitting}
            icon={<Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />}
          >
            {submitting ? 'INSCREVENDO...' : 'CONFIRMAR INSCRIÇÃO'}
          </ChevronButton>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  infoText: {
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  infoCount: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.title,
    color: colors.text,
  },

  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(240,160,48,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(240,160,48,0.2)',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  warningText: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.warning,
    fontFamily: fonts.text.regular,
    lineHeight: 16,
  },

  memberList: { gap: spacing.md },

  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  memberCardSelected: {
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  memberCardBlocked: { opacity: 0.45 },

  memberAvatar: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center', justifyContent: 'center',
  },
  memberAvatarSelected: { backgroundColor: colors.primary },
  memberAvatarBlocked: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.inputBackground,
    alignItems: 'center', justifyContent: 'center',
  },
  memberAvatarLetter: {
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: '#FFFFFF',
  },
  memberAvatarLetterMuted: { color: colors.textMuted },

  memberInfo: { flex: 1 },
  memberName: {
    fontSize: typography.sizes.input,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  memberNameSelected: { color: colors.primary },
  memberNameBlocked: {
    fontSize: typography.sizes.input,
    color: colors.textMuted,
    fontFamily: fonts.text.semiBold,
  },
  blockedText: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    marginTop: 2,
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  captainBadgeText: {
    fontSize: typography.sizes.md,
    letterSpacing: typography.letterSpacing.medium,
    color: colors.primary,
    fontFamily: fonts.text.bold,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
