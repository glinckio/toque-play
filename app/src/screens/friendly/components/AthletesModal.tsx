import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { fonts } from '../../../theme/fonts';
import { radius } from '../../../theme/radius';
import { typography } from '../../../theme/typography';
import type { FriendlyAthlete } from '../../../types/friendly';

interface Props {
  visible: boolean;
  side: 'REQUESTER' | 'CHALLENGED' | null;
  teamName: string;
  athletes: FriendlyAthlete[];
  onClose: () => void;
}

export function AthletesModal({ visible, side, teamName, athletes, onClose }: Props) {
  const filtered = side ? athletes.filter((a) => a.side === side) : [];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>{teamName}</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            removeClippedSubviews
            maxToRenderPerBatch={10}
            initialNumToRender={8}
            windowSize={5}
            getItemLayout={(_, index) => ({ length: 64, offset: 64 * index, index })}
            renderItem={({ item: athlete }) => {
              const name = athlete.teamMember?.user?.name ?? athlete.teamMember?.guestName ?? '?';
              return (
                <View style={styles.item}>
                  <View style={styles.avatar}>
                    <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    {athlete.isCaptain && <Text style={styles.capBadge}>CAPITÃO</Text>}
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={<Text style={styles.empty}>Nenhum atleta informado</Text>}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20,10,30,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: radius.section,
    width: '85%',
    maxHeight: '60%',
    padding: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.button,
    fontFamily: fonts.text.bold,
    color: colors.text,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: typography.sizes.subtitle,
    fontFamily: fonts.title.regular,
    color: colors.primary,
  },
  info: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
  },
  capBadge: {
    fontSize: 11,
    fontFamily: fonts.text.bold,
    color: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 1,
  },
  empty: {
    fontSize: typography.sizes.body,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
