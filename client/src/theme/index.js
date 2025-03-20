// MelodyMatch Custom Chakra Theme
// Kawaii Cute & Cozy - Soft, playful, satisfying

import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import { fonts, fontSizes, fontWeights, lineHeights, letterSpacings, textStyles } from './typography';
import { Button, Card, Input, Textarea, Badge, Modal, Drawer } from './components';

const theme = extendTheme({
  // Global styles
  styles: {
    global: {
      'html, body': {
        bg: colors.bg.base,
        color: colors.text.primary,
        fontFamily: 'body',
        lineHeight: 'relaxed',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '*::placeholder': {
        color: colors.text.muted,
      },
      '*, *::before, *::after': {
        borderColor: 'rgba(255, 200, 210, 0.08)',
      },
      // Reduced motion support
      '@media (prefers-reduced-motion: reduce)': {
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          animationIterationCount: '1 !important',
          transitionDuration: '0.01ms !important',
          scrollBehavior: 'auto !important',
        },
      },
      // Cute scrollbar
      '::-webkit-scrollbar': {
        width: '12px',
        height: '12px',
      },
      '::-webkit-scrollbar-track': {
        bg: colors.bg.muted,
        borderRadius: 'full',
      },
      '::-webkit-scrollbar-thumb': {
        bg: 'rgba(255, 181, 186, 0.4)',
        borderRadius: 'full',
        border: '3px solid transparent',
        backgroundClip: 'content-box',
        '&:hover': {
          bg: 'rgba(255, 181, 186, 0.6)',
        },
      },
      // Selection
      '::selection': {
        bg: 'rgba(212, 191, 255, 0.4)',
        color: colors.text.primary,
      },
    },
  },

  // Colors
  colors: {
    brand: {
      50: '#FFF0F2',
      100: '#FFE1E5',
      200: '#FFCDD0',
      300: '#FFB5BA',
      400: '#FFA3A9',
      500: '#FF8F96',
      600: '#E87A82',
      700: '#CC666D',
      800: '#994D52',
      900: '#663338',
    },
    mint: {
      50: '#F0FBF8',
      100: '#E1F7F1',
      200: '#D0F2E9',
      300: '#B5EADD',
      400: '#9DD8CA',
      500: '#85C6B7',
      600: '#6DB4A4',
      700: '#55A291',
      800: '#3D907E',
      900: '#257E6B',
    },
    lilac: {
      50: '#F8F5FF',
      100: '#F0EAFF',
      200: '#E4D6FF',
      300: '#D4BFFF',
      400: '#BCA8E8',
      500: '#A491D1',
      600: '#8C7ABA',
      700: '#7463A3',
      800: '#5C4C8C',
      900: '#443575',
    },
    peach: {
      50: '#FFF8F5',
      100: '#FFF0EA',
      200: '#FFE0CE',
      300: '#FFCFB5',
      400: '#E8B89E',
      500: '#D1A187',
      600: '#BA8A70',
      700: '#A37359',
      800: '#8C5C42',
      900: '#75452B',
    },
    sky: {
      50: '#F5FAFF',
      100: '#EAF4FF',
      200: '#D0E8FF',
      300: '#B5D9FF',
      400: '#9EC5E8',
      500: '#87B1D1',
      600: '#709DBA',
      700: '#5989A3',
      800: '#42758C',
      900: '#2B6175',
    },
    butter: {
      50: '#FFFDF5',
      100: '#FFFAEA',
      200: '#FFF7D0',
      300: '#FFF2B5',
      400: '#E8DB9E',
      500: '#D1C487',
      600: '#BAAD70',
      700: '#A39659',
      800: '#8C7F42',
      900: '#75682B',
    },
    // Compatibility with old names
    cyan: {
      50: '#F0FBF8',
      100: '#E1F7F1',
      200: '#D0F2E9',
      300: '#B5EADD',
      400: '#9DD8CA',
      500: '#85C6B7',
      600: '#6DB4A4',
      700: '#55A291',
      800: '#3D907E',
      900: '#257E6B',
    },
    purple: {
      50: '#F8F5FF',
      100: '#F0EAFF',
      200: '#E4D6FF',
      300: '#D4BFFF',
      400: '#BCA8E8',
      500: '#A491D1',
      600: '#8C7ABA',
      700: '#7463A3',
      800: '#5C4C8C',
      900: '#443575',
    },
    surface: {
      base: colors.bg.base,
      card: colors.bg.surface,
      elevated: colors.bg.elevated,
      muted: colors.bg.muted,
    },
    kawaii: colors.kawaii,
    bubble: colors.bubble,
    neon: colors.neon,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  },

  // Typography
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
  textStyles,

  // Spacing
  space: {
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
  },

  // Border radius - super round and cute
  radii: {
    none: '0',
    sm: '0.75rem',
    base: '1rem',
    md: '1.25rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
    full: '9999px',
  },

  // Shadows - soft, no glow, just gentle depth
  shadows: {
    sm: colors.shadows.sm,
    md: colors.shadows.md,
    lg: colors.shadows.lg,
    xl: '0 8px 30px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)',
    clay: colors.shadows.cozyCard,
    clayHover: colors.shadows.cozyCardHover,
    clayButton: colors.shadows.cuteButton,
    bubbleCard: colors.shadows.cozyCard,
    bubbleCardHover: colors.shadows.cozyCardHover,
    bubbleButton: colors.shadows.cuteButton,
    outline: '0 0 0 3px rgba(212, 191, 255, 0.4)',
  },

  // Z-index
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Transitions - bouncy and playful
  transition: {
    property: {
      common: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      colors: 'background-color, border-color, color, fill, stroke',
      dimensions: 'width, height',
      position: 'left, right, top, bottom',
      background: 'background-color, background-image, background-position',
    },
    easing: {
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      'ease-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      cute: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    duration: {
      'ultra-fast': '50ms',
      faster: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '400ms',
      'ultra-slow': '500ms',
    },
  },

  // Component styles
  components: {
    Button,
    Card,
    Input,
    Textarea,
    Badge,
    Modal,
    Drawer,
    
    // Heading - cute and friendly
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 'bold',
        color: colors.text.primary,
        letterSpacing: 'tight',
      },
    },
    
    // Text
    Text: {
      baseStyle: {
        fontFamily: 'body',
        color: colors.text.secondary,
      },
      variants: {
        muted: {
          color: colors.text.muted,
        },
        pink: {
          color: colors.kawaii.pink,
        },
        mint: {
          color: colors.kawaii.mint,
        },
        lilac: {
          color: colors.kawaii.lilac,
        },
        peach: {
          color: colors.kawaii.peach,
        },
        neonPink: {
          color: colors.kawaii.pink,
        },
        neonCyan: {
          color: colors.kawaii.mint,
        },
      },
    },
    
    // Link
    Link: {
      baseStyle: {
        color: colors.kawaii.pink,
        transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        _hover: {
          color: colors.kawaii.lilac,
          textDecoration: 'none',
        },
        _focus: {
          boxShadow: `0 0 0 3px ${colors.kawaii.lilacGlow}`,
          outline: 'none',
        },
      },
    },
    
    // FormLabel
    FormLabel: {
      baseStyle: {
        fontFamily: 'body',
        fontWeight: 'bold',
        fontSize: 'sm',
        color: colors.text.secondary,
        mb: 2,
      },
    },
    
    // Divider
    Divider: {
      baseStyle: {
        borderColor: 'rgba(255, 181, 186, 0.2)',
      },
    },
    
    // Tabs
    Tabs: {
      variants: {
        clay: {
          tablist: {
            bg: colors.bg.muted,
            borderRadius: '2xl',
            p: 1.5,
          },
          tab: {
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: 'sm',
            borderRadius: 'xl',
            color: colors.text.muted,
            _selected: {
              bg: colors.bg.surface,
              color: colors.kawaii.pink,
              boxShadow: colors.shadows.cozyCard,
            },
            _hover: {
              color: colors.text.primary,
            },
            _focus: {
              boxShadow: `0 0 0 3px ${colors.kawaii.lilacGlow}`,
            },
          },
          tabpanel: {
            p: 0,
            mt: 6,
          },
        },
      },
      defaultProps: {
        variant: 'clay',
      },
    },
    
    // Menu
    Menu: {
      baseStyle: {
        list: {
          bg: colors.bg.elevated,
          border: '2px solid',
          borderColor: 'rgba(255, 181, 186, 0.2)',
          borderRadius: '2xl',
          boxShadow: colors.shadows.cozyCard,
          py: 2,
        },
        item: {
          fontFamily: 'body',
          bg: 'transparent',
          color: colors.text.secondary,
          borderRadius: 'xl',
          mx: 2,
          _hover: {
            bg: 'rgba(255, 181, 186, 0.15)',
            color: colors.kawaii.pink,
          },
          _focus: {
            bg: 'rgba(255, 181, 186, 0.15)',
            color: colors.kawaii.pink,
          },
        },
      },
    },
    
    // Tooltip
    Tooltip: {
      baseStyle: {
        bg: colors.bg.elevated,
        color: colors.text.primary,
        fontFamily: 'body',
        fontSize: 'sm',
        borderRadius: 'xl',
        px: 4,
        py: 2,
        border: '2px solid',
        borderColor: 'rgba(255, 181, 186, 0.2)',
        boxShadow: colors.shadows.cozyCard,
      },
    },
    
    // Avatar
    Avatar: {
      baseStyle: {
        container: {
          border: '3px solid',
          borderColor: 'rgba(255, 181, 186, 0.4)',
          boxShadow: '0 4px 15px rgba(255, 181, 186, 0.25)',
        },
      },
    },
    
    // Progress
    Progress: {
      baseStyle: {
        track: {
          bg: colors.bg.muted,
          borderRadius: 'full',
        },
        filledTrack: {
          bgGradient: colors.gradients.pinkLilac,
          borderRadius: 'full',
        },
      },
    },
    
    // Spinner
    Spinner: {
      baseStyle: {
        color: colors.kawaii.pink,
      },
    },
    
    // Checkbox
    Checkbox: {
      baseStyle: {
        control: {
          borderRadius: 'lg',
          border: '2px solid',
          borderColor: 'rgba(255, 181, 186, 0.4)',
          _checked: {
            bg: colors.kawaii.pink,
            borderColor: colors.kawaii.pink,
            color: colors.text.inverse,
          },
          _focus: {
            boxShadow: `0 0 0 3px ${colors.kawaii.pinkGlow}`,
          },
        },
        label: {
          fontFamily: 'body',
          color: colors.text.secondary,
        },
      },
    },
    
    // Select
    Select: {
      variants: {
        glow: {
          field: {
            bg: colors.bg.muted,
            border: '2px solid',
            borderColor: 'rgba(255, 181, 186, 0.2)',
            borderRadius: '2xl',
            fontFamily: 'body',
            color: colors.text.primary,
            _hover: {
              borderColor: 'rgba(255, 181, 186, 0.4)',
            },
            _focus: {
              borderColor: colors.kawaii.pink,
              boxShadow: `0 0 0 2px ${colors.kawaii.pinkGlow}`,
            },
          },
          icon: {
            color: colors.kawaii.pink,
          },
        },
      },
      defaultProps: {
        variant: 'glow',
      },
    },
    
    // Alert
    Alert: {
      variants: {
        clay: (props) => {
          const colorMap = {
            info: colors.kawaii.lilac,
            success: colors.kawaii.mint,
            warning: colors.kawaii.peach,
            error: colors.error,
          };
          const color = colorMap[props.status] || colors.kawaii.lilac;
          
          return {
            container: {
              bg: colors.bg.surface,
              border: '2px solid',
              borderColor: color,
              borderRadius: '2xl',
            },
            icon: {
              color: color,
            },
            title: {
              fontFamily: 'body',
              fontWeight: 'bold',
              color: colors.text.primary,
            },
            description: {
              fontFamily: 'body',
              color: colors.text.secondary,
            },
          };
        },
      },
      defaultProps: {
        variant: 'clay',
      },
    },
  },

  // Config
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    cssVarPrefix: 'mm',
  },
});

export default theme;
