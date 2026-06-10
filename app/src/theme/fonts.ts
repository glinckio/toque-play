export const fonts = {
  title: {
    regular: 'BebasNeue-Regular',
  },
  text: {
    regular: 'Manrope-Regular',
    medium: 'Manrope-Medium',
    semiBold: 'Manrope-SemiBold',
    bold: 'Manrope-Bold',
  },
  mono: {
    regular: 'AzeretMono-Regular',
    bold: 'AzeretMono-Bold',
  },
  form: {
    regular: 'IBMPlexSans-Regular',
    medium: 'IBMPlexSans-Medium',
    semiBold: 'IBMPlexSans-SemiBold',
  },
} as const;

export const fontAssets = {
  fonts: [
    require('../../assets/fonts/Bebas_Neue/BebasNeue-Regular.ttf'),
    require('../../assets/fonts/Manrope/Manrope-Regular.ttf'),
    require('../../assets/fonts/Manrope/Manrope-Medium.ttf'),
    require('../../assets/fonts/Manrope/Manrope-SemiBold.ttf'),
    require('../../assets/fonts/Manrope/Manrope-Bold.ttf'),
    require('../../assets/fonts/Azeret_Mono/AzeretMono-Regular.ttf'),
    require('../../assets/fonts/Azeret_Mono/AzeretMono-Bold.ttf'),
    require('../../assets/fonts/IBM_Plex_Sans/IBMPlexSans-Regular.ttf'),
    require('../../assets/fonts/IBM_Plex_Sans/IBMPlexSans-Medium.ttf'),
    require('../../assets/fonts/IBM_Plex_Sans/IBMPlexSans-SemiBold.ttf'),
  ],
};
