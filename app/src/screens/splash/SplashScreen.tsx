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
import Svg, { Line, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { fonts } from '../../theme/fonts';

const { width: W, height: H } = Dimensions.get('window');

interface Props {
  onAnimationEnd: () => void;
}

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: (i * 53) % 100,
  y: (i * 71) % 100,
  size: 1 + ((i * 7) % 3),
  delay: (i % 8) * 250,
  duration: 4000 + (i % 5) * 800,
}));

export default function SplashScreen({ onAnimationEnd }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;

  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;

  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(16)).current;
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;

  const netOpacity = useRef(new Animated.Value(0)).current;
  const trapOpacity = useRef(new Animated.Value(0)).current;
  const centerOpacity = useRef(new Animated.Value(0)).current;
  const streakOpacity = useRef(new Animated.Value(0)).current;

  const progressWrapOpacity = useRef(new Animated.Value(0)).current;
  const progressWrapY = useRef(new Animated.Value(20)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        delay: 300,
        easing: Easing.elastic(1.1),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Shockwave rings
    const ringLoop = (r: Animated.Value, d: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(r, { toValue: 1, duration: 2600, delay: d, useNativeDriver: true }),
          Animated.timing(r, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ).start();
    };
    ringLoop(ring1, 400);
    ringLoop(ring2, 800);
    ringLoop(ring3, 1200);

    // Tagline
    Animated.parallel([
      Animated.timing(taglineOpacity, { toValue: 1, duration: 700, delay: 1100, useNativeDriver: true }),
      Animated.timing(taglineY, { toValue: 0, duration: 700, delay: 1100, useNativeDriver: true }),
    ]).start();

    // Tagline dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(dot1Opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot2Opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(dot2Opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    ).start();

    // Court lines (fade in with stagger)
    Animated.timing(netOpacity, { toValue: 1, duration: 1200, delay: 300, useNativeDriver: true }).start();
    Animated.timing(trapOpacity, { toValue: 1, duration: 1400, delay: 500, useNativeDriver: true }).start();
    Animated.timing(centerOpacity, { toValue: 1, duration: 800, delay: 900, useNativeDriver: true }).start();
    Animated.timing(streakOpacity, { toValue: 0.5, duration: 2600, delay: 0, useNativeDriver: true }).start();

    // Progress bar wrapper
    Animated.parallel([
      Animated.timing(progressWrapOpacity, { toValue: 1, duration: 500, delay: 1200, useNativeDriver: true }),
      Animated.timing(progressWrapY, { toValue: 0, duration: 500, delay: 1200, useNativeDriver: true }),
    ]).start();

    // Progress fill
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      delay: 1200,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) onAnimationEnd();
    });
  }, []);

  const ringAnim = (a: Animated.Value) => ({
    opacity: a.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 0.6, 0.2, 0] }),
    transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.4] }) }],
  });

  return (
    <View style={s.root}>
      {/* Gradient background */}
      <LinearGradient
        colors={['#2a0a55', '#150428', '#08030f']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Vignette */}
      <LinearGradient
        colors={['transparent', 'transparent', 'rgba(0,0,0,0.7)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Court lines */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: netOpacity }]} pointerEvents="none">
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Line x1="0" y1={H * 0.5} x2={W} y2={H * 0.5} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="3 6" />
          </Svg>
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: trapOpacity }]} pointerEvents="none">
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Path
              d={`M 60 ${H * 0.9} L ${W - 60} ${H * 0.9} L ${W - 110} ${H * 0.64} L 110 ${H * 0.64} Z`}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              fill="none"
            />
          </Svg>
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: centerOpacity }]} pointerEvents="none">
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Line x1={W / 2} y1={H * 0.64} x2={W / 2} y2={H * 0.9} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          </Svg>
        </Animated.View>

        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: streakOpacity }]} pointerEvents="none">
          <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <Defs>
              <SvgLinearGradient id="sg2" x1="0" y1="1" x2="1" y2="0">
                <Stop offset="0%" stopColor="#6D2EC0" stopOpacity="0.2" />
                <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                <Stop offset="100%" stopColor="#B47CFF" stopOpacity="0.4" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d={`M -50 ${H * 0.87} Q ${W * 0.33} ${H * 0.24} ${W + 70} ${H * 0.07}`}
              stroke="url(#sg2)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="2 10"
              fill="none"
            />
          </Svg>
        </Animated.View>
      </View>

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <Particle key={p.id} p={p} />
      ))}

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

      {/* Tagline */}
      <Animated.View
        style={[s.taglineWrap, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}
      >
        <View style={s.taglineRow}>
          <Text style={s.taglineText}>Every Spike</Text>
          <Animated.View style={[s.taglineDot, { opacity: dot1Opacity }]} />
          <Text style={s.taglineText}>Every Set</Text>
          <Animated.View style={[s.taglineDot, { opacity: dot2Opacity }]} />
          <Text style={s.taglineText}>Every Block</Text>
        </View>
      </Animated.View>

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

/* ─── Particle ─── */

function Particle({ p }: { p: (typeof PARTICLES)[number] }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.6, duration: p.duration * 0.3, delay: p.delay, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: p.duration * 0.7, useNativeDriver: true }),
        ]),
        Animated.timing(translateY, { toValue: -70, duration: p.duration, delay: p.delay, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: `${p.x}%` as any,
        top: `${p.y}%` as any,
        width: p.size,
        height: p.size,
        borderRadius: p.size / 2,
        backgroundColor: 'rgba(255,255,255,0.6)',
        opacity,
        transform: [{ translateY }],
      }}
    />
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
  root: { flex: 1, backgroundColor: '#08030f', alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center', marginBottom: 40, zIndex: 20 },
  ring: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgba(180,124,255,0.45)' },
  logoGlow: {
    shadowColor: '#B47CFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
  },
  logo: { width: 170, height: 170 },
  taglineWrap: { position: 'absolute', bottom: H * 0.24, alignItems: 'center', zIndex: 20 },
  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taglineText: {
    fontFamily: fonts.text.semiBold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  taglineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#B47CFF' },
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
  segment: { flex: 1, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  segmentFill: {
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: '#A855F7',
  },
  progressText: {
    fontFamily: fonts.text.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 3,
  },
});
