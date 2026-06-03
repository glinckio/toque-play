export const fonts = {
  title: {
    display: 'BebasNeue-Regular',
    heading: 'Rajdhani-Bold',
  },
  text: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  display: {
    regular: 'SFProDisplay-Regular',
    medium: 'SFProDisplay-Medium',
    bold: 'SFProDisplay-Bold',
  },
  body: {
    light: 'Rajdhani-Light',
    regular: 'Rajdhani-Regular',
    medium: 'Rajdhani-Medium',
    semiBold: 'Rajdhani-SemiBold',
    bold: 'Rajdhani-Bold',
  },
} as const;

export const fontAssets = {
  fonts: [
    require('../../assets/fonts/Bebas_Neue/BebasNeue-Regular.ttf'),
    require('../../assets/fonts/Rajdhani/Rajdhani-Light.ttf'),
    require('../../assets/fonts/Rajdhani/Rajdhani-Regular.ttf'),
    require('../../assets/fonts/Rajdhani/Rajdhani-Medium.ttf'),
    require('../../assets/fonts/Rajdhani/Rajdhani-SemiBold.ttf'),
    require('../../assets/fonts/Rajdhani/Rajdhani-Bold.ttf'),
    require('../../assets/fonts/Inter/Inter_18pt-Regular.ttf'),
    require('../../assets/fonts/Inter/Inter_18pt-Medium.ttf'),
    require('../../assets/fonts/Inter/Inter_18pt-SemiBold.ttf'),
    require('../../assets/fonts/Inter/Inter_18pt-Bold.ttf'),
    require('../../assets/fonts/Sf_pro_display/SFPRODISPLAYREGULAR.otf'),
    require('../../assets/fonts/Sf_pro_display/SFPRODISPLAYMEDIUM.otf'),
    require('../../assets/fonts/Sf_pro_display/SFPRODISPLAYBOLD.otf'),
  ],
};
