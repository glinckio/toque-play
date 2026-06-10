import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

type Variant = 'underline' | 'pill';

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  variant?: Variant;
}

export default function TabBar({ tabs, activeTab, onTabChange, variant = 'underline' }: Props) {
  return (
    <View style={[styles.container, variant === 'pill' && styles.pillContainer]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[
              styles.tab,
              variant === 'underline' && styles.underlineTab,
              variant === 'pill' && styles.pillTab,
              variant === 'underline' && isActive && styles.underlineActive,
              variant === 'pill' && isActive && styles.pillActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabLabel,
                variant === 'underline' && isActive && styles.underlineLabelActive,
                variant === 'pill' && isActive && styles.pillLabelActive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.count !== undefined && tab.count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{tab.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  pillContainer: {
    backgroundColor: '#EDEDF0',
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  underlineTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  pillTab: {
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
  },
  underlineActive: {
    borderBottomColor: colors.primary,
  },
  pillActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabLabel: {
    fontFamily: fonts.text.semiBold,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  underlineLabelActive: {
    color: colors.primary,
  },
  pillLabelActive: {
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: fonts.text.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
});
