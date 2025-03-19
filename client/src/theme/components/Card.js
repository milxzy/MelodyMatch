// CuteCard component styles for Chakra UI - Kawaii style (no glow)
import { colors } from '../colors';

export const Card = {
  baseStyle: {
    container: {
      bg: colors.bg.surface,
      borderRadius: '3xl',
      border: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease-out',
      overflow: 'hidden',
    },
    header: {
      px: 6,
      py: 4,
      borderBottom: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.06)',
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
  
  variants: {
    clay: {
      container: {
        bg: colors.bg.surface,
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    
    elevated: {
      container: {
        bg: colors.bg.elevated,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)',
      },
    },
    
    // Legacy - no longer glows, just has soft pink border
    glowPink: {
      container: {
        bg: colors.bg.surface,
        borderColor: 'rgba(255, 181, 186, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    
    // Legacy - no longer glows, just has soft mint border
    glowCyan: {
      container: {
        bg: colors.bg.surface,
        borderColor: 'rgba(181, 234, 221, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    
    interactive: {
      container: {
        bg: colors.bg.surface,
        cursor: 'pointer',
        _hover: {
          transform: 'translateY(-2px) scale(1.01)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)',
        },
        _active: {
          transform: 'scale(0.98)',
        },
      },
    },
    
    flat: {
      container: {
        bg: colors.bg.muted,
        boxShadow: 'none',
        border: '2px solid',
        borderColor: 'rgba(255, 200, 210, 0.1)',
      },
    },
  },
  
  defaultProps: {
    variant: 'clay',
  },
};

export default Card;
