import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import { radius } from '../../../../theme/radius';
import { typography } from '../../../../theme/typography';

interface Props {
  visible: boolean;
  defaultBanners: string[];
  imageUrl: string | null;
  onClose: () => void;
  onPickDefault: (url: string) => void;
  onUpload: () => void;
  onRemove: () => void;
}

export function TournamentBannerPickerModal({
  visible,
  defaultBanners,
  imageUrl,
  onClose,
  onPickDefault,
  onUpload,
  onRemove,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.content} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Escolher Banner</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Banners padrão</Text>
          <View style={styles.grid}>
            {defaultBanners.map((url) => (
              <TouchableOpacity
                key={url}
                style={[styles.gridThumb, imageUrl === url && styles.gridThumbActive]}
                onPress={() => onPickDefault(url)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: url }} style={styles.gridImg} resizeMode="cover" />
                {imageUrl === url && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.subtitle}>Enviar minha foto</Text>
          <TouchableOpacity style={styles.uploadCard} onPress={onUpload} activeOpacity={0.7}>
            <Ionicons name="cloud-upload-outline" size={28} color={colors.primary} />
            <Text style={styles.uploadLabel}>Escolher da galeria</Text>
            <Text style={styles.uploadHint}>JPG ou PNG, máximo 10MB</Text>
          </TouchableOpacity>

          {imageUrl && (
            <TouchableOpacity style={styles.removeOption} onPress={onRemove}>
              <Ionicons name="trash-outline" size={16} color={colors.error} />
              <Text style={styles.removeText}>Remover banner</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
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
    padding: spacing.xl,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.title.regular,
    fontSize: 20,
    color: colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  gridThumb: {
    width: '47%',
    height: 80,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gridThumbActive: { borderColor: colors.primary },
  gridImg: { width: '100%', height: '100%' },
  checkBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  uploadCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    gap: 4,
  },
  uploadLabel: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  uploadHint: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  removeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  removeText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.input,
    color: colors.error,
  },
});
