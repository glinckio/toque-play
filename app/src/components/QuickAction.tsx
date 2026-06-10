import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';

interface Props {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export default function QuickAction({ label, icon, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconBox}>{icon}</View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.lg,
    padding: 12,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 8,
    fontFamily: fonts.text.semiBold,
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 14,
  },
});
