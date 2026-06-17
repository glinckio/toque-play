import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useLivePulse(active: boolean) {
  const pulse = useRef(new Animated.Value(0)).current;
  const pulseRunning = useRef(true);

  useEffect(() => {
    if (!active) return;
    pulseRunning.current = true;
    const animate = () => {
      if (!pulseRunning.current) return;
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) animate();
      });
    };
    animate();
    return () => {
      pulseRunning.current = false;
      pulse.stopAnimation();
    };
  }, [active, pulse]);

  return pulse;
}
