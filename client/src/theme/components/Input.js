// SoftInput component styles for Chakra UI - Kawaii style (no glow)
import { colors } from '../colors';

export const Input = {
  baseStyle: {
    field: {
      fontFamily: 'body',
      color: colors.text.primary,
      _placeholder: {
        color: colors.text.muted,
      },
    },
  },
  
  sizes: {
    md: {
      field: {
        fontSize: 'md',
        px: 4,
        h: '48px',
        borderRadius: '2xl',
      },
    },
    lg: {
      field: {
        fontSize: 'lg',
        px: 5,
        h: '56px',
        borderRadius: '2xl',
      },
    },
  },
  
  variants: {
    // Soft kawaii style - no glow
    soft: {
      field: {
        bg: colors.bg.muted,
        border: '2px solid',
        borderColor: 'rgba(255, 200, 210, 0.12)',
        transition: 'all 0.2s ease-out',
        _hover: {
          borderColor: 'rgba(255, 200, 210, 0.2)',
        },
        _focus: {
          borderColor: colors.kawaii.lilac,
          boxShadow: `0 0 0 1px ${colors.kawaii.lilacGlow}`,
          bg: colors.bg.surface,
        },
        _invalid: {
          borderColor: colors.error,
          boxShadow: 'none',
        },
      },
    },
    
    // Legacy alias for backwards compatibility
    glow: {
      field: {
        bg: colors.bg.muted,
        border: '2px solid',
        borderColor: 'rgba(255, 200, 210, 0.12)',
        transition: 'all 0.2s ease-out',
        _hover: {
          borderColor: 'rgba(255, 200, 210, 0.2)',
        },
        _focus: {
          borderColor: colors.kawaii.lilac,
          boxShadow: `0 0 0 1px ${colors.kawaii.lilacGlow}`,
          bg: colors.bg.surface,
        },
        _invalid: {
          borderColor: colors.error,
          boxShadow: 'none',
        },
      },
    },
    
    glowPink: {
      field: {
        bg: colors.bg.muted,
        border: '2px solid',
        borderColor: 'rgba(255, 200, 210, 0.12)',
        transition: 'all 0.2s ease-out',
        _hover: {
          borderColor: 'rgba(255, 200, 210, 0.2)',
        },
        _focus: {
          borderColor: colors.kawaii.pink,
          boxShadow: `0 0 0 1px ${colors.kawaii.pinkGlow}`,
          bg: colors.bg.surface,
        },
      },
    },
    
    filled: {
      field: {
        bg: colors.bg.elevated,
        border: '2px solid',
        borderColor: 'transparent',
        _hover: {
          bg: colors.bg.surface,
        },
        _focus: {
          bg: colors.bg.surface,
          borderColor: colors.kawaii.lilac,
          boxShadow: 'none',
        },
      },
    },
  },
  
  defaultProps: {
    size: 'md',
    variant: 'soft',
  },
};

// Textarea shares same styles
export const Textarea = {
  baseStyle: {
    fontFamily: 'body',
    color: colors.text.primary,
    _placeholder: {
      color: colors.text.muted,
    },
  },
  
  variants: {
    soft: {
      bg: colors.bg.muted,
      border: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.12)',
      borderRadius: '2xl',
      px: 4,
      py: 3,
      transition: 'all 0.2s ease-out',
      _hover: {
        borderColor: 'rgba(255, 200, 210, 0.2)',
      },
      _focus: {
        borderColor: colors.kawaii.lilac,
        boxShadow: `0 0 0 1px ${colors.kawaii.lilacGlow}`,
        bg: colors.bg.surface,
      },
    },
    // Legacy alias
    glow: {
      bg: colors.bg.muted,
      border: '2px solid',
      borderColor: 'rgba(255, 200, 210, 0.12)',
      borderRadius: '2xl',
      px: 4,
      py: 3,
      transition: 'all 0.2s ease-out',
      _hover: {
        borderColor: 'rgba(255, 200, 210, 0.2)',
      },
      _focus: {
        borderColor: colors.kawaii.lilac,
        boxShadow: `0 0 0 1px ${colors.kawaii.lilacGlow}`,
        bg: colors.bg.surface,
      },
    },
  },
  
  defaultProps: {
    variant: 'soft',
  },
};

export default { Input, Textarea };
