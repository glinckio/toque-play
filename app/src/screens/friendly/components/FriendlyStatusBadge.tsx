import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { typography } from '../../../theme/typography';
import { fonts } from '../../../theme/fonts';
import StatusBadge from '../../../components/StatusBadge';
import { LIVE_COLOR } from '../constants';

interface Props {
  isLive: boolean;
  status: any;
  pulse: Animated.Value;
}

export function FriendlyStatusBadge({ isLive, status, pulse }: Props) {
  if (!isLive) {
    return <StatusBadge status={status} />;
  }
  return (
    <View style={styles.liveBadge}>
      <Animated.View
        style={[
          styles.liveGlow,
          {
            opacity: pulse.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.8, 0.1],
            }),
          },
        ]}
      />
      <Text style={styles.liveText}>AO VIVO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(224,69,69,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  liveGlow: { width: 12, height: 12, borderRadius: 6, backgroundColor: LIVE_COLOR },
  liveText: {
    fontFamily: fonts.title.regular,
    fontSize: typography.sizes.md,
    color: LIVE_COLOR,
    letterSpacing: typography.letterSpacing.extraWide,
  },
});
