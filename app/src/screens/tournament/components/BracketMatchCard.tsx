import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Match } from '../../../types/match';

interface Props {
  match: Match;
  onPress: (matchId: string) => void;
}

export function BracketMatchCard({ match, onPress }: Props) {
  const isTeamAWinner = match.winnerId === match.teamAId;
  const isTeamBWinner = match.winnerId === match.teamBId;
  return (
    <TouchableOpacity
      style={styles.bracketMatch}
      activeOpacity={0.7}
      onPress={() => {
        if (match.teamA && match.teamB) {
          onPress(match.id);
        }
      }}
    >
      <View style={[styles.bracketTeamRow, isTeamAWinner && styles.bracketWinnerRow]}>
        <Text
          style={[styles.bracketTeamName, isTeamAWinner && styles.bracketTeamNameWinner]}
          numberOfLines={1}
        >
          {match.teamA?.name ?? 'TBD'}
        </Text>
        <Text style={[styles.bracketScore, isTeamAWinner && styles.bracketScoreWinner]}>
          {match.status !== 'SCHEDULED' ? match.scoreTeamA : ''}
        </Text>
      </View>
      <View style={styles.bracketDivider} />
      <View style={[styles.bracketTeamRow, isTeamBWinner && styles.bracketWinnerRow]}>
        <Text
          style={[styles.bracketTeamName, isTeamBWinner && styles.bracketTeamNameWinner]}
          numberOfLines={1}
        >
          {match.teamB?.name ?? 'TBD'}
        </Text>
        <Text style={[styles.bracketScore, isTeamBWinner && styles.bracketScoreWinner]}>
          {match.status !== 'SCHEDULED' ? match.scoreTeamB : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bracketMatch: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F4EFFA',
  },
  bracketTeamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bracketWinnerRow: {
    backgroundColor: 'rgba(31,184,122,0.1)',
  },
  bracketTeamName: {
    flex: 1,
    fontFamily: 'System',
    fontWeight: '600',
    fontSize: 12,
    color: '#150A1F',
  },
  bracketTeamNameWinner: {
    color: '#0E7A4A',
  },
  bracketScore: {
    fontWeight: '700',
    fontSize: 14,
    color: '#A89BBA',
    minWidth: 20,
    textAlign: 'right',
  },
  bracketScoreWinner: {
    color: '#0E7A4A',
  },
  bracketDivider: {
    height: 1,
    backgroundColor: '#F4EFFA',
  },
});
