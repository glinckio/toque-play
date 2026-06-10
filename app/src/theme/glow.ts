export const glow = {
  primary: {
    shadowColor: '#6D2EC0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 8,
  },
  soft: {
    shadowColor: 'rgba(20, 10, 30, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  card: {
    shadowColor: 'rgba(20, 10, 30, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  button: {
    shadowColor: '#6D2EC0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const opacity = {
  watermark: 0.06,
  light: 0.07,
  medium: 0.15,
  high: 0.5,
  overlay: 0.7,
} as const;
