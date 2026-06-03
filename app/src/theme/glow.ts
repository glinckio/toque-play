export const glow = {
  primary: {
    shadowColor: '#845CB9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 25,
    elevation: 8,
  },
  soft: {
    shadowColor: '#845CB9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

export const opacity = {
  light: 0.03,
  medium: 0.05,
  high: 0.08,
} as const;
