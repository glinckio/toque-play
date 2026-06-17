import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import { radius } from '../../../../theme/radius';
import { typography } from '../../../../theme/typography';
import ChevronButton from '../../../../components/ChevronButton';
import { BracketType } from '../../../../types/tournament';
import { BRACKET_TYPE_OPTIONS } from '../detail.constants';

interface Props {
  tournamentStatus: string;
  refereeEmail: string;
  referees: any[];
  addingReferee: boolean;
  refereeCode: string | null;
  codeLoading: boolean;
  bracketType: BracketType;
  generatingBracket: boolean;
  canGenerate: boolean;
  onRefereeEmailChange: (v: string) => void;
  onAddReferee: () => void;
  onRemoveReferee: (id: string) => void;
  onSetBracketType: (t: BracketType) => void;
  onShowBracketInfo: (t: BracketType) => void;
  onGenerateCode: () => void;
  onGenerateBracket: () => void;
}

export function TournamentOrganizerPanel({
  tournamentStatus,
  refereeEmail,
  referees,
  addingReferee,
  refereeCode,
  codeLoading,
  bracketType,
  generatingBracket,
  canGenerate,
  onRefereeEmailChange,
  onAddReferee,
  onRemoveReferee,
  onSetBracketType,
  onShowBracketInfo,
  onGenerateCode,
  onGenerateBracket,
}: Props) {
  return (
    <>
      {/* Referees */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ÁRBITROS</Text>
        <View style={styles.refAddRow}>
          <View style={styles.refInputWrap}>
            <Ionicons name="mail-outline" size={16} color={colors.textPlaceholder} />
            <TextInput
              style={styles.refInput}
              value={refereeEmail}
              onChangeText={onRefereeEmailChange}
              placeholder="Email do arbitro"
              placeholderTextColor={colors.textPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>
          <TouchableOpacity
            style={styles.refAddBtn}
            onPress={onAddReferee}
            disabled={addingReferee || !refereeEmail.trim()}
            activeOpacity={0.7}
          >
            {addingReferee ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
        {referees.length > 0 ? (
          referees.map((ref) => (
            <View key={ref.id} style={styles.refCard}>
              <View style={styles.refAvatar}>
                <Text style={styles.refAvatarText}>
                  {(ref.user?.name ?? '?').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.refInfo}>
                <Text style={styles.refName}>{ref.user?.name}</Text>
                <Text style={styles.refEmail}>{ref.user?.email}</Text>
              </View>
              <TouchableOpacity onPress={() => onRemoveReferee(ref.id)} activeOpacity={0.7}>
                <Ionicons name="close-circle-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum arbitro adicionado</Text>
        )}
      </View>

      {/* Referee Code */}
      {['BRACKET_GENERATED', 'IN_PROGRESS'].includes(tournamentStatus) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CÓDIGO DE ACESSO</Text>
          <View style={styles.codeSection}>
            <Text style={styles.codeDesc}>
              Gere um código e compartilhe com o árbitro para que ele possa apitar as partidas.
            </Text>
            {refereeCode ? (
              <View style={styles.codeCard}>
                <Ionicons name="key-outline" size={24} color={colors.primary} />
                <Text style={styles.codeLabel}>CÓDIGO DE ACESSO</Text>
                <Text style={styles.codeValue}>{refereeCode}</Text>
                <Text style={styles.codeHint}>
                  Compartilhe este código com o árbitro para que ele possa apitar a partida.
                </Text>
              </View>
            ) : (
              <ChevronButton
                variant="ghost"
                size="lg"
                fullWidth
                onPress={onGenerateCode}
                disabled={codeLoading}
                icon={
                  codeLoading ? undefined : (
                    <Ionicons name="key-outline" size={16} color={colors.primary} />
                  )
                }
              >
                {codeLoading ? 'GERANDO...' : 'GERAR CÓDIGO DE ACESSO'}
              </ChevronButton>
            )}
          </View>
        </View>
      )}

      {/* Bracket Generation */}
      {canGenerate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHAVEAMENTO</Text>
          <Text style={styles.bracketDesc}>Selecione o tipo de chaveamento.</Text>
          <View style={styles.bracketOptions}>
            {BRACKET_TYPE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.bracketOption,
                  bracketType === opt.key && styles.bracketOptionActive,
                ]}
                onPress={() => onSetBracketType(opt.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={20}
                  color={bracketType === opt.key ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.bracketOptionText,
                    bracketType === opt.key && styles.bracketOptionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                <TouchableOpacity
                  style={styles.bracketInfoBtn}
                  onPress={() => onShowBracketInfo(opt.key)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color={bracketType === opt.key ? colors.primary : colors.textMuted}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
          <ChevronButton
            variant="primary"
            size="lg"
            fullWidth
            onPress={onGenerateBracket}
            disabled={generatingBracket}
            icon={<Ionicons name="git-branch-outline" size={16} color="#FFFFFF" />}
          >
            {generatingBracket ? 'GERANDO...' : 'GERAR CHAVES'}
          </ChevronButton>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.xxl },
  sectionTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.lg,
  },
  refAddRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  refInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    gap: spacing.sm,
  },
  refInput: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.form.regular,
    fontSize: typography.sizes.input,
    paddingVertical: 0,
  },
  refAddBtn: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.sm },
  refCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  refAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refAvatarText: {
    fontFamily: fonts.title.regular,
    fontSize: 16,
    color: colors.primary,
  },
  refInfo: { flex: 1 },
  refName: {
    fontSize: typography.sizes.input,
    color: colors.text,
    fontFamily: fonts.text.semiBold,
  },
  refEmail: {
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
  },
  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: 13,
    color: colors.textPlaceholder,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
  codeSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  codeDesc: {
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    lineHeight: 18,
  },
  codeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  codeLabel: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.medium,
    color: colors.textMuted,
    marginTop: spacing.sm,
    letterSpacing: typography.letterSpacing.medium,
  },
  codeValue: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.hero,
    color: colors.primary,
    letterSpacing: 6,
  },
  codeHint: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 16,
  },
  bracketDesc: {
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    fontFamily: fonts.text.regular,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  bracketOptions: { gap: spacing.sm, marginBottom: spacing.lg },
  bracketOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: 'rgba(20,10,30,0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  bracketInfoBtn: { marginLeft: 'auto', padding: 4 },
  bracketOptionActive: {
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  bracketOptionText: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
  },
  bracketOptionTextActive: { color: colors.primary },
});
