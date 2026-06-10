import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { radius } from '../theme/radius';

interface Props {
  value: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function ScoreBox({ value, onAdd, onRemove }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={onRemove} activeOpacity={0.7}>
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.score}>{value}</Text>
      <TouchableOpacity style={styles.btn} onPress={onAdd} activeOpacity={0.7}>
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    gap: 8,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: fonts.text.regular,
    lineHeight: 32,
  },
  score: {
    fontFamily: fonts.title.regular,
    fontSize: 64,
    color: '#FFFFFF',
    lineHeight: 1,
  },
});
