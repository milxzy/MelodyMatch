// MelodyMatch Typography - Kawaii Cute & Cozy
// Quicksand (bubbly headings) + Nunito (soft, friendly body)

export const fonts = {
  heading: "'Quicksand', sans-serif",
  body: "'Nunito', sans-serif",
  mono: "'Nunito', sans-serif",
};

export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  md: '1rem',       // 16px
  lg: '1.125rem',   // 18px
  xl: '1.375rem',   // 22px
  '2xl': '1.75rem', // 28px
  '3xl': '2.25rem', // 36px
  '4xl': '3rem',    // 48px
  '5xl': '3.75rem', // 60px
};

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

export const lineHeights = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
  loose: 1.8,
};

export const letterSpacings = {
  tighter: '-0.03em',
  tight: '-0.01em',
  normal: '0',
  wide: '0.02em',
  wider: '0.04em',
  widest: '0.08em',
};

// Text styles for Chakra - cute and friendly
export const textStyles = {
  h1: {
    fontFamily: 'heading',
    fontSize: ['3xl', '4xl', '5xl'],
    fontWeight: 'bold',
    lineHeight: 'tight',
    letterSpacing: 'tight',
  },
  h2: {
    fontFamily: 'heading',
    fontSize: ['2xl', '3xl'],
    fontWeight: 'bold',
    lineHeight: 'snug',
    letterSpacing: 'tight',
  },
  h3: {
    fontFamily: 'heading',
    fontSize: ['xl', '2xl'],
    fontWeight: 'semibold',
    lineHeight: 'snug',
  },
  h4: {
    fontFamily: 'heading',
    fontSize: ['lg', 'xl'],
    fontWeight: 'semibold',
    lineHeight: 'normal',
  },
  body: {
    fontFamily: 'body',
    fontSize: 'md',
    fontWeight: 'normal',
    lineHeight: 'relaxed',
  },
  bodyLarge: {
    fontFamily: 'body',
    fontSize: 'lg',
    fontWeight: 'normal',
    lineHeight: 'relaxed',
  },
  caption: {
    fontFamily: 'body',
    fontSize: 'sm',
    fontWeight: 'medium',
    lineHeight: 'normal',
  },
  label: {
    fontFamily: 'body',
    fontSize: 'sm',
    fontWeight: 'bold',
    letterSpacing: 'wide',
  },
  cute: {
    fontFamily: 'heading',
    fontWeight: 'semibold',
    letterSpacing: 'wide',
  },
};

export default { fonts, fontSizes, fontWeights, lineHeights, letterSpacings, textStyles };
