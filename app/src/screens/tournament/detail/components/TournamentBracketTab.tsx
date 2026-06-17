import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import { fonts } from '../../../../theme/fonts';
import { spacing } from '../../../../theme/spacing';
import type { BracketResponse } from '../../../../types/match';
import { EliminationBracketView } from '../../components/EliminationBracketView';
import { DoubleEliminationBracketView } from '../../components/DoubleEliminationBracketView';
import { GroupsThenEliminationBracketView } from '../../components/GroupsThenEliminationBracketView';
import { RoundRobinBracketView } from '../../components/RoundRobinBracketView';
import { FORMAT_LABELS, TYPE_LABELS } from '../detail.constants';

interface Props {
  bracketData: BracketResponse[] | null;
  canViewBrackets: boolean;
  onPressMatch: (matchId: string) => void;
}

export function TournamentBracketTab({ bracketData, canViewBrackets, onPressMatch }: Props) {
  if (!canViewBrackets) {
    return <Text style={styles.emptyText}>Chaveamento ainda não gerado.</Text>;
  }
  if (!bracketData) {
    return <ActivityIndicator color={colors.primary} style={{ marginVertical: 40 }} />;
  }
  if (bracketData.length === 0) {
    return <Text style={styles.emptyText}>Nenhuma chave encontrada.</Text>;
  }
  const multi = bracketData.length > 1;
  return (
    <View style={styles.wrap}>
      {bracketData.map((bracket) => {
        const catLabel = `${TYPE_LABELS[bracket.category.type] ?? bracket.category.type} · ${
          FORMAT_LABELS[bracket.category.format] ?? bracket.category.format
        }`;
        if (bracket.type === 'ROUND_ROBIN') {
          return (
            <RoundRobinBracketView
              key={bracket.id}
              bracket={bracket}
              multiCategory={multi}
              categoryLabel={catLabel}
              onPressMatch={onPressMatch}
            />
          );
        }
        if (bracket.type === 'DOUBLE_ELIMINATION') {
          return (
            <DoubleEliminationBracketView
              key={bracket.id}
              bracket={bracket}
              multiCategory={multi}
              categoryLabel={catLabel}
              onPressMatch={onPressMatch}
            />
          );
        }
        if (bracket.type === 'GROUPS_THEN_ELIMINATION') {
          return (
            <GroupsThenEliminationBracketView
              key={bracket.id}
              bracket={bracket}
              multiCategory={multi}
              categoryLabel={catLabel}
              onPressMatch={onPressMatch}
            />
          );
        }
        return (
          <EliminationBracketView
            key={bracket.id}
            bracket={bracket}
            multiCategory={multi}
            categoryLabel={catLabel}
            onPressMatch={onPressMatch}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  emptyText: {
    fontFamily: fonts.text.regular,
    fontSize: 13,
    color: colors.textPlaceholder,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
});
