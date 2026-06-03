import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { BracketType } from '../../../types/tournament';
import Input from '../../../components/Input';

interface BracketOption {
  type: BracketType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  example: string;
}

const OPTIONS: BracketOption[] = [
  {
    type: BracketType.ROUND_ROBIN,
    label: 'Pontos Corridos',
    icon: 'reload-circle-outline',
    description: 'Todos os times jogam contra todos. A classificação final define o campeão.',
    example: '4 times → cada time joga 3 jogos → total 6 jogos',
  },
  {
    type: BracketType.SINGLE_ELIMINATION,
    label: 'Mata-mata Direto',
    icon: 'git-branch-outline',
    description: 'Eliminação direta. Perdeu, saiu. Vencedor avança para a próxima rodada.',
    example: '8 times → quartas → semifinal → final',
  },
  {
    type: BracketType.GROUPS_THEN_ELIMINATION,
    label: 'Fase de Grupos + Mata-mata',
    icon: 'grid-outline',
    description: 'Times divididos em grupos. Todos jogam dentro do grupo. Os melhores avançam para o mata-mata. Se não configurado, o sistema usa até 5 por grupo e top 3 avançam.',
    example: '12 times → 3 grupos de 4 → top 3 avançam → 9 no mata-mata. Se 3 por grupo → todos avançam.',
  },
];

interface Props {
  value?: BracketType | null;
  groupsCount?: number | null;
  teamsPerGroup?: number | null;
  teamsAdvancing?: number | null;
  onChange: (data: {
    bracketType: BracketType;
    groupsCount?: number;
    teamsPerGroup?: number;
    teamsAdvancing?: number;
  }) => void;
}

export default function BracketTypeSelector({
  value,
  groupsCount,
  teamsPerGroup,
  teamsAdvancing,
  onChange,
}: Props) {
  const [expandedTip, setExpandedTip] = useState<BracketType | null>(null);
  const selected = value ?? null;
  const isGroupsThenElimination = selected === BracketType.GROUPS_THEN_ELIMINATION;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>TIPO DE CHAVEAMENTO</Text>

      {OPTIONS.map((option) => {
        const isSelected = selected === option.type;
        const isExpanded = expandedTip === option.type;

        return (
          <View key={option.type} style={styles.optionWrapper}>
            <TouchableOpacity
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              onPress={() => {
                onChange({
                  bracketType: option.type,
                  groupsCount: option.type === BracketType.GROUPS_THEN_ELIMINATION ? groupsCount ?? undefined : undefined,
                  teamsPerGroup: option.type === BracketType.GROUPS_THEN_ELIMINATION ? teamsPerGroup ?? undefined : undefined,
                  teamsAdvancing: option.type === BracketType.GROUPS_THEN_ELIMINATION ? teamsAdvancing ?? undefined : undefined,
                });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionLeft}>
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={isSelected ? colors.primaryGlow : colors.textMuted}
                  />
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setExpandedTip(isExpanded ? null : option.type)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'information-circle-outline'}
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.optionDesc} numberOfLines={isExpanded ? undefined : 2}>
                {option.description}
              </Text>

              {isExpanded && (
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>EXEMPLO</Text>
                  <Text style={styles.exampleText}>{option.example}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}

      {isGroupsThenElimination && (
        <View style={styles.extraFields}>
          <Text style={styles.fieldLabel}>CONFIGURAÇÃO DOS GRUPOS</Text>

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <Input
                label="Nº de grupos"
                placeholder="Ex: 3"
                keyboardType="numeric"
                value={groupsCount?.toString() ?? ''}
                onChangeText={(v) => {
                  const n = parseInt(v, 10);
                  onChange({
                    bracketType: BracketType.GROUPS_THEN_ELIMINATION,
                    groupsCount: isNaN(n) ? undefined : n,
                    teamsPerGroup: undefined,
                    teamsAdvancing: teamsAdvancing ?? undefined,
                  });
                }}
              />
            </View>
            <Text style={styles.fieldOr}>ou</Text>
            <View style={styles.fieldHalf}>
              <Input
                label="Times por grupo"
                placeholder="Ex: 4"
                keyboardType="numeric"
                value={teamsPerGroup?.toString() ?? ''}
                onChangeText={(v) => {
                  const n = parseInt(v, 10);
                  onChange({
                    bracketType: BracketType.GROUPS_THEN_ELIMINATION,
                    groupsCount: undefined,
                    teamsPerGroup: isNaN(n) ? undefined : n,
                    teamsAdvancing: teamsAdvancing ?? undefined,
                  });
                }}
              />
            </View>
          </View>

          <Input
            label="Times que avançam por grupo"
            placeholder="Ex: 2"
            keyboardType="numeric"
            value={teamsAdvancing?.toString() ?? ''}
            onChangeText={(v) => {
              const n = parseInt(v, 10);
              onChange({
                bracketType: BracketType.GROUPS_THEN_ELIMINATION,
                groupsCount: groupsCount ?? undefined,
                teamsPerGroup: teamsPerGroup ?? undefined,
                teamsAdvancing: isNaN(n) ? undefined : n,
              });
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.title.display,
    color: colors.text,
    letterSpacing: 2,
  },
  optionWrapper: { marginBottom: spacing.sm },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(109,46,192,0.06)',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: fonts.text.semiBold,
    color: colors.textSecondary,
  },
  optionLabelSelected: {
    color: colors.primaryGlow,
  },
  optionDesc: {
    fontSize: 12,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    lineHeight: 18,
  },
  exampleBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  exampleLabel: {
    fontSize: 9,
    fontFamily: fonts.text.semiBold,
    color: colors.primaryGlow,
    letterSpacing: 2,
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 12,
    fontFamily: fonts.text.regular,
    color: colors.textSecondary,
  },
  extraFields: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  fieldLabel: {
    fontSize: 9,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  fieldHalf: { flex: 1 },
  fieldOr: {
    fontSize: 12,
    fontFamily: fonts.text.medium,
    color: colors.textMuted,
    marginTop: 16,
  },
});
