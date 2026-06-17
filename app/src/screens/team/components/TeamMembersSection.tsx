import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import type { TeamMember } from '../../../types/team';
import { TeamMemberCard } from './TeamMemberCard';

interface Props {
  members: TeamMember[];
  isOwner: boolean;
  onAddMember: () => void;
  onInfo: (member: TeamMember) => void;
  onEdit: (member: TeamMember) => void;
  onToggleCaptain: (member: TeamMember) => void;
  onRemove: (member: TeamMember) => void;
}

export function TeamMembersSection({
  members,
  isOwner,
  onAddMember,
  onInfo,
  onEdit,
  onToggleCaptain,
  onRemove,
}: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ATLETAS</Text>
        {isOwner && (
          <TouchableOpacity style={styles.addBtn} onPress={onAddMember} activeOpacity={0.7}>
            <Ionicons name="person-add-outline" size={16} color={colors.primary} />
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>

      {members.length > 0 ? (
        <View style={styles.memberList}>
          {members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              isOwner={isOwner}
              onInfo={onInfo}
              onEdit={onEdit}
              onToggleCaptain={onToggleCaptain}
              onRemove={onRemove}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyMembers}>
          <Ionicons name="people-outline" size={32} color={colors.textPlaceholder} />
          <Text style={styles.emptyMembersText}>Nenhum membro ainda</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xxl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
  },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addBtnText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.primary,
  },
  memberList: { gap: spacing.md },
  emptyMembers: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyMembersText: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
});
