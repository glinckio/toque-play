import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';

type AnyStatus = string;

interface Props {
  status: AnyStatus;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, { bg: string; fg: string; label: string }> = {
  // Tournament
  DRAFT: { bg: '#EDEDF0', fg: '#3D2C52', label: 'RASCUNHO' },
  PUBLISHED: { bg: '#E0E7FF', fg: '#4338CA', label: 'PUBLICADO' },
  REGISTRATION_OPEN: { bg: '#DBEAFE', fg: '#2563EB', label: 'INSCRIÇÕES' },
  REGISTRATION_CLOSED: { bg: '#FEF3C7', fg: '#92400E', label: 'FECHADO' },
  BRACKET_GENERATED: { bg: '#F4EFFA', fg: '#6D2EC0', label: 'MONTADO' },
  IN_PROGRESS: { bg: '#D1FAE5', fg: '#065F46', label: 'AO VIVO' },
  FINISHED: { bg: '#EDEDF0', fg: '#3D2C52', label: 'FINALIZADO' },
  CANCELLED: { bg: '#FEE2E2', fg: '#991B1B', label: 'CANCELADO' },
  COMPLETED: { bg: '#EDEDF0', fg: '#3D2C52', label: 'CONCLUÍDO' },
  // Match
  SCHEDULED: { bg: '#DBEAFE', fg: '#2563EB', label: 'AGENDADO' },
  WALKOVER: { bg: '#FEF3C7', fg: '#92400E', label: 'WO' },
  // Friendly
  PENDING: { bg: '#FEF3C7', fg: '#92400E', label: 'PENDENTE' },
  ACCEPTED: { bg: '#D1FAE5', fg: '#065F46', label: 'ACEITO' },
  REJECTED: { bg: '#FEE2E2', fg: '#991B1B', label: 'REJEITADO' },
};

export default function StatusBadge({ status, size = 'md' }: Props) {
  const c = colorMap[status] ?? { bg: '#ECECF0', fg: '#3D2C52', label: status };
  const fs = size === 'sm' ? 10 : 11;
  const py = size === 'sm' ? 2 : 4;

  return (
    <View style={[styles.badge, { backgroundColor: c.bg, paddingVertical: py }]}>
      <Text style={[styles.text, { color: c.fg, fontSize: fs }]}>
        {c.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.title.regular,
    letterSpacing: typography.letterSpacing.extraWide,
  },
});
