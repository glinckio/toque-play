import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Line,
  Path,
  Rect,
  Defs,
  RadialGradient as SvgRadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { fonts } from '../../theme/fonts';
import { colors } from '../../theme/colors';

const { width: W, height: H } = Dimensions.get('window');

interface Props {
  onAnimationEnd: () => void;
}

// Pre-decoded rgb strings for tinted strokes (cheaper than rgba() parsing at runtime)
const PRIMARY_RGB = '109,46,192'; // colors.primary
const EASE_OUT = Easing.out(Easing.cubic);
const EASE_OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);

// Animated SVG path (module-scope so we don't recreate the wrapper each render)
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function SplashScreen({ onAnimationEnd }: Props) {
  // Spotlight
  const spotlightOpacity = useRef(new Animated.Value(0)).current;
  const spotlightScale = useRef(new Animated.Value(0.85)).current;

  // Logo
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  // Rings (slowed shockwave)
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  // Court lines (staggered reveal)
  const netOpacity = useRef(new Animated.Value(0)).current;
  const netScale = useRef(new Animated.Value(0.94)).current;
  const trapOpacity = useRef(new Animated.Value(0)).current;
  const trapScale = useRef(new Animated.Value(0.94)).current;
  const centerOpacity = useRef(new Animated.Value(0)).current;
  const streakOpacity = useRef(new Animated.Value(0)).current;
  const streakDashOffset = useRef(new Animated.Value(0)).current;

  // Tagline (word-by-word)
  const w1Opacity = useRef(new Animated.Value(0)).current;
  const w1Y = useRef(new Animated.Value(12)).current;
  const w2Opacity = useRef(new Animated.Value(0)).current;
  const w2Y = useRef(new Animated.Value(12)).current;
  const w3Opacity = useRef(new Animated.Value(0)).current;
  const w3Y = useRef(new Animated.Value(12)).current;
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;

  // Progress
  const progressWrapOpacity = useRef(new Animated.Value(0)).current;
  const progressWrapY = useRef(new Animated.Value(16)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ─── Spotlight breathes in ───
    Animated.parallel([
      Animated.timing(spotlightOpacity, {
        toValue: 1, duration: 900, delay: 0, easing: EASE_OUT, useNativeDriver: true,
      }),
      Animated.timing(spotlightScale, {
        toValue: 1, duration: 1300, delay: 0, easing: EASE_OUT_EXPO, useNativeDriver: true,
      }),
    ]).start();

    // ─── Court lines stagger in with subtle scale ───
    Animated.parallel([
      Animated.parallel([
        Animated.timing(netOpacity, { toValue: 1, duration: 900, delay: 200, easing: EASE_OUT, useNativeDriver: true }),
        Animated.timing(netScale, { toValue: 1, duration: 900, delay: 200, easing: EASE_OUT_EXPO, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(trapOpacity, { toValue: 1, duration: 1100, delay: 380, easing: EASE_OUT, useNativeDriver: true }),
        Animated.timing(trapScale, { toValue: 1, duration: 1100, delay: 380, easing: EASE_OUT_EXPO, useNativeDriver: true }),
      ]),
      Animated.timing(centerOpacity, { toValue: 1, duration: 700, delay: 650, easing: EASE_OUT, useNativeDriver: true }),
      Animated.timing(streakOpacity, { toValue: 1, duration: 1200, delay: 500, easing: EASE_OUT, useNativeDriver: true }),
    ]).start();

    // ─── Streak dashes flow along arc (reads as spike trajectory) ───
    Animated.loop(
      Animated.timing(streakDashOffset, {
        toValue: -60,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ).start();

    // ─── Rings — slowed for cinematic pulse ───
    const ringLoop = (r: Animated.Value, d: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(r, { toValue: 1, duration: 3500, delay: d, easing: EASE_OUT, useNativeDriver: true }),
          Animated.timing(r, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ).start();
    };
    ringLoop(ring1, 600);
    ringLoop(ring2, 1500);
    ringLoop(ring3, 2400);

    // ─── Logo entrance ───
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1, duration: 700, delay: 750, easing: EASE_OUT, useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1, duration: 1100, delay: 750, easing: Easing.elastic(0.9), useNativeDriver: true,
      }),
    ]).start();

    // ─── Tagline word-by-word stagger ───
    const wordIn = (opacity: Animated.Value, y: Animated.Value, delay: number) =>
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 500, delay, easing: EASE_OUT, useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 500, delay, easing: EASE_OUT_EXPO, useNativeDriver: true }),
      ]);
    wordIn(w1Opacity, w1Y, 1600).start();
    Animated.timing(dot1Opacity, { toValue: 1, duration: 400, delay: 1800, useNativeDriver: true }).start();
    wordIn(w2Opacity, w2Y, 1950).start();
    Animated.timing(dot2Opacity, { toValue: 1, duration: 400, delay: 2150, useNativeDriver: true }).start();
    wordIn(w3Opacity, w3Y, 2300).start();

    // ─── Progress wrapper ───
    Animated.parallel([
      Animated.timing(progressWrapOpacity, { toValue: 1, duration: 500, delay: 2700, useNativeDriver: true }),
      Animated.timing(progressWrapY, { toValue: 0, duration: 500, delay: 2700, easing: EASE_OUT_EXPO, useNativeDriver: true }),
    ]).start();

    // ─── Progress fill ───
    Animated.timing(progress, {
      toValue: 1,
      duration: 2400,
      delay: 2800,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) onAnimationEnd();
    });
  }, []);

  const ringAnim = (a: Animated.Value) => ({
    opacity: a.interpolate({ inputRange: [0, 0.1, 0.7, 1], outputRange: [0, 0.5, 0.15, 0] }),
    transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.55] }) }],
  });

  return (
    <View style={s.root}>
      {/* Base light gradient */}
      <LinearGradient
        colors={['#FFFFFF', colors.background, colors.backgroundSecondary]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Radial spotlight — gives the scene depth on light bg */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { opacity: spotlightOpacity, transform: [{ scale: spotlightScale }] },
        ]}
      >
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <SvgRadialGradient id="spot" cx="50%" cy="45%" r="60%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <Stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <Stop offset="100%" stopColor={colors.backgroundSecondary} stopOpacity="0" />
            </SvgRadialGradient>
          </Defs>
          <Rect x="0" y="0" width={W} height={H} fill="url(#spot)" />
        </Svg>
      </Animated.View>

      {/* Court lines */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {/* Net (horizontal) */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: netOpacity, transform: [{ scale: netScale }] }]}
          pointerEvents="none"
        >
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Line
              x1="0" y1={H * 0.5} x2={W} y2={H * 0.5}
              stroke={`rgba(${PRIMARY_RGB},0.18)`}
              strokeWidth={1.2}
              strokeDasharray="3 7"
            />
          </Svg>
        </Animated.View>

        {/* Trapezoid court (attack zone perspective) */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: trapOpacity, transform: [{ scale: trapScale }] }]}
          pointerEvents="none"
        >
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Path
              d={`M 60 ${H * 0.9} L ${W - 60} ${H * 0.9} L ${W - 110} ${H * 0.64} L 110 ${H * 0.64} Z`}
              stroke={`rgba(${PRIMARY_RGB},0.24)`}
              strokeWidth={1.3}
              fill="none"
            />
          </Svg>
        </Animated.View>

        {/* Center vertical (net plane) */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: centerOpacity }]}
          pointerEvents="none"
        >
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Line
              x1={W / 2} y1={H * 0.64} x2={W / 2} y2={H * 0.9}
              stroke={`rgba(${PRIMARY_RGB},0.18)`}
              strokeWidth={1.2}
            />
          </Svg>
        </Animated.View>

        {/* Streak — parabolic spike trajectory with flowing dashes */}
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: streakOpacity }]}
          pointerEvents="none"
        >
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Defs>
              <SvgLinearGradient id="sg2" x1="0" y1="1" x2="1" y2="0">
                <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.25" />
                <Stop offset="50%" stopColor={colors.primaryLight} stopOpacity="0.95" />
                <Stop offset="100%" stopColor={colors.primaryLight} stopOpacity="0.35" />
              </SvgLinearGradient>
            </Defs>
            <AnimatedPath
              d={`M -50 ${H * 0.87} Q ${W * 0.33} ${H * 0.24} ${W + 70} ${H * 0.07}`}
              stroke="url(#sg2)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="3 12"
              strokeDashoffset={streakDashOffset}
              fill="none"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Center content */}
      <View style={s.center}>
        {[ring1, ring2, ring3].map((ring, i) => (
          <Animated.View key={i} style={[s.ring, ringAnim(ring)]} />
        ))}

        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <View style={s.logoGlow}>
            <Image source={require('../../../assets/splash-logo.png')} style={s.logo} resizeMode="contain" />
          </View>
        </Animated.View>
      </View>

      {/* Tagline — word-by-word */}
      <View style={s.taglineWrap}>
        <View style={s.taglineRow}>
          <Animated.Text style={[s.taglineText, { opacity: w1Opacity, transform: [{ translateY: w1Y }] }]}>
            Cada Saque
          </Animated.Text>
          <Animated.View style={[s.taglineDot, { opacity: dot1Opacity }]} />
          <Animated.Text style={[s.taglineText, { opacity: w2Opacity, transform: [{ translateY: w2Y }] }]}>
            Cada Toque
          </Animated.Text>
          <Animated.View style={[s.taglineDot, { opacity: dot2Opacity }]} />
          <Animated.Text style={[s.taglineText, { opacity: w3Opacity, transform: [{ translateY: w3Y }] }]}>
            Cada Ataque
          </Animated.Text>
        </View>
      </View>

      {/* Segmented progress */}
      <Animated.View
        style={[s.progressWrap, { opacity: progressWrapOpacity, transform: [{ translateY: progressWrapY }] }]}
      >
        <View style={s.segmentsRow}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SegmentedBar key={i} index={i} progress={progress} />
          ))}
        </View>
        <Text style={s.progressText}>ENTRANDO EM QUADRA…</Text>
      </Animated.View>
    </View>
  );
}

/* ─── Segment ─── */

function SegmentedBar({ index, progress }: { index: number; progress: Animated.Value }) {
  const segStart = index / 8;
  const fillWidth = progress.interpolate({
    inputRange: [segStart, segStart + 1 / 8],
    outputRange: [0, 100],
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <View style={s.segment}>
      <Animated.View
        style={[
          s.segmentFill,
          {
            width: fillWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center', marginBottom: 40, zIndex: 20 },
  ring: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1.5,
    borderColor: `rgba(${PRIMARY_RGB},0.35)`,
  },
  logoGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
  },
  logo: { width: 170, height: 170 },
  taglineWrap: { position: 'absolute', bottom: H * 0.24, alignItems: 'center', zIndex: 20 },
  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  taglineText: {
    fontFamily: fonts.text.semiBold,
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  taglineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary },
  progressWrap: {
    position: 'absolute',
    bottom: H * 0.08,
    left: 56,
    right: 56,
    alignItems: 'center',
    zIndex: 20,
    gap: 16,
  },
  segmentsRow: { flexDirection: 'row', gap: 6, width: '100%' },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: `rgba(${PRIMARY_RGB},0.12)`,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: colors.primary,
  },
  progressText: {
    fontFamily: fonts.text.regular,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 3,
  },
});
