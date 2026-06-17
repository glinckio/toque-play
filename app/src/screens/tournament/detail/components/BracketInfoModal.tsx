import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import { radius } from '../../../../theme/radius';
import { typography } from '../../../../theme/typography';
import { BracketType } from '../../../../types/tournament';
import { BRACKET_INFO } from '../detail.constants';

interface Props {
  visible: BracketType | null;
  onClose: () => void;
}

export function BracketInfoModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.content}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {visible && (() => {
            const info = BRACKET_INFO[visible];
            return (
              <>
                <View style={styles.header}>
                  <Text style={styles.title}>{info.title}</Text>
                  <TouchableOpacity
                    onPress={onClose}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={22} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.desc}>{info.description}</Text>
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleLabel}>EXEMPLO</Text>
                    <Text style={styles.example}>{info.example}</Text>
                  </View>
                </ScrollView>
              </>
            );
          })()}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.card,
    padding: spacing.xl,
    width: '100%',
    maxHeight: '80%',
    shadowColor: 'rgba(20,10,30,0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    flex: 1,
    fontFamily: fonts.title.regular,
    fontSize: 18,
    color: colors.text,
    letterSpacing: 0.3,
    marginRight: spacing.md,
  },
  desc: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  exampleBox: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  exampleLabel: {
    fontFamily: fonts.title.regular,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  example: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.text,
    lineHeight: 16,
  },
});
