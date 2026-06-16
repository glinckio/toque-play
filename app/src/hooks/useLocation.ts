import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { userService } from '../services/user';

export function useLocation() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (status !== 'granted') {
          setPermissionDenied(true);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;

        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        // Send to backend silently
        userService.updateLocation(latitude, longitude).catch(() => {});
      } catch {
        if (!cancelled) setPermissionDenied(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { location, permissionDenied };
}
