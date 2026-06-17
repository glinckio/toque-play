import { StyleSheet } from 'react-native';
import { colors } from '../../../../theme/colors';
import { spacing } from '../../../../theme/spacing';
import { fonts } from '../../../../theme/fonts';
import { radius } from '../../../../theme/radius';
import { typography } from '../../../../theme/typography';

export const formStyles = StyleSheet.create({
  stepTitle: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.heading,
    color: colors.text,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  fieldLabel: {
    fontFamily: fonts.form.medium,
    fontSize: typography.sizes.input,
    color: colors.textDefault,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  fieldHint: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: -spacing.xs,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    height: 48,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.input,
    fontFamily: fonts.form.regular,
    paddingVertical: 0,
  },
  inputMultilineWrap: { alignItems: 'flex-start', minHeight: 80 },
  inputMultiline: { minHeight: 60, textAlignVertical: 'top' },

  chipRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: radius.lg,
    backgroundColor: colors.inputBackground,
  },
  chipActive: {
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
  },
  chipTextActive: { color: colors.primary },

  chipRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chipSm: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBackground,
  },
  chipSmActive: {
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipSmText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.medium,
    color: colors.textMuted,
  },
  chipSmTextActive: { color: colors.primary },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.medium,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginBottom: spacing.lg,
  },
  addBtnText: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.primary,
    letterSpacing: typography.letterSpacing.medium,
  },

  row2: { flexDirection: 'row', gap: spacing.md },
  col2: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xl },
  sponsorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  bannerArea: {
    height: 140,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    backgroundColor: colors.inputBackground,
  },
  bannerPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bannerPlaceholderText: {
    fontFamily: fonts.text.medium,
    fontSize: typography.sizes.input,
    color: colors.textPlaceholder,
    marginTop: spacing.sm,
  },
  bannerPlaceholderHint: {
    fontFamily: fonts.text.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  bannerEditBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  bannerEditText: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.sm,
    color: '#FFFFFF',
  },

  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  reviewLabel: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.semiBold,
    color: colors.textMuted,
    letterSpacing: typography.letterSpacing.medium,
    marginBottom: spacing.sm,
  },
  reviewValue: {
    fontSize: typography.sizes.input,
    fontFamily: fonts.text.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  reviewMeta: {
    fontSize: typography.sizes.md,
    fontFamily: fonts.text.regular,
    color: colors.textMuted,
    lineHeight: 18,
  },
  reviewItem: { marginBottom: spacing.md },
});
