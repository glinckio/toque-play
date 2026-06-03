import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../theme/spacing';
import { fonts } from '../theme';

interface DividerProps {
  text?: string;
}

export default function Divider({ text }: DividerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      {!!text && <Text style={styles.text}>{text}</Text>}
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xxl,
    gap: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  text: {
    color: '#6E7382',
    fontSize: 12,
    letterSpacing: 1.5,
    fontFamily: fonts.text.regular,
  },
});
