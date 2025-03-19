// Modal component styles for Chakra UI - Kawaii style (no glow)
import { colors } from '../colors';

export const Modal = {
  baseStyle: {
    overlay: {
      bg: 'rgba(15, 15, 26, 0.85)',
      backdropFilter: 'blur(8px)',
    },
    dialog: {
      bg: colors.bg.elevated,
      borderRadius: '3xl',
      border: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.12)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)',
      mx: 4,
    },
    header: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      color: colors.text.primary,
      px: 6,
      py: 5,
      borderBottom: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.06)',
    },
    closeButton: {
      color: colors.text.muted,
      borderRadius: 'full',
      _hover: {
        bg: 'rgba(255, 181, 186, 0.15)',
        color: colors.kawaii.pink,
      },
      _focus: {
        boxShadow: `0 0 0 2px ${colors.kawaii.pinkGlow}`,
      },
    },
    body: {
      px: 6,
      py: 5,
      color: colors.text.secondary,
    },
    footer: {
      px: 6,
      py: 4,
      borderTop: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.06)',
    },
  },
  
  sizes: {
    md: {
      dialog: {
        maxW: '500px',
      },
    },
    lg: {
      dialog: {
        maxW: '700px',
      },
    },
    xl: {
      dialog: {
        maxW: '900px',
      },
    },
    full: {
      dialog: {
        maxW: '100vw',
        minH: '100vh',
        my: 0,
        borderRadius: 0,
      },
    },
  },
};

export const Drawer = {
  baseStyle: {
    overlay: {
      bg: 'rgba(15, 15, 26, 0.85)',
      backdropFilter: 'blur(8px)',
    },
    dialog: {
      bg: colors.bg.surface,
      boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.3)',
    },
    header: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      color: colors.text.primary,
      px: 6,
      py: 5,
      borderBottom: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.06)',
    },
    closeButton: {
      color: colors.text.muted,
      borderRadius: 'full',
      _hover: {
        bg: 'rgba(255, 181, 186, 0.15)',
        color: colors.kawaii.pink,
      },
    },
    body: {
      px: 6,
      py: 5,
    },
    footer: {
      px: 6,
      py: 4,
      borderTop: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.06)',
    },
  },
};

export default { Modal, Drawer };
