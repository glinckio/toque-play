import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: Props) {
  return (
    <View style={styles.container}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;

        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: i <= currentStep ? colors.primary : colors.border,
                  },
                ]}
              />
            )}
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    (isCompleted || isCurrent) && styles.stepNumberActive,
                  ]}
                >
                  {isCompleted ? '✓' : `${i + 1}`}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  (isCompleted || isCurrent) && styles.stepLabelActive,
                ]}
                numberOfLines={1}
              >
                {step}
              </Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  stepContainer: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EDEDF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCompleted: {
    backgroundColor: colors.primary,
  },
  circleCurrent: {
    backgroundColor: colors.primary,
  },
  stepNumber: {
    fontFamily: fonts.text.bold,
    fontSize: 12,
    color: colors.textMuted,
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontFamily: fonts.text.medium,
    fontSize: 10,
    color: colors.textPlaceholder,
  },
  stepLabelActive: {
    color: colors.text,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
});
