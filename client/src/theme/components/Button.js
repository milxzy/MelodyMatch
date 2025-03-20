// CuteButton component styles - Kawaii, squishy, satisfying (no glow)
import { colors } from '../colors';

export const Button = {
  baseStyle: {
    fontFamily: 'heading',
    fontWeight: 'semibold',
    letterSpacing: 'wide',
    borderRadius: 'full', // Super round pill shape
    cursor: 'pointer',
    transition: 'background-color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    overflow: 'hidden',
    _focus: {
      outline: 'none',
      boxShadow: `0 0 0 3px rgba(212, 191, 255, 0.4)`,
    },
    _focusVisible: {
      outline: 'none',
      boxShadow: `0 0 0 3px rgba(212, 191, 255, 0.4)`,
    },

  },
  
  sizes: {
    sm: {
      fontSize: 'xs',
      px: 5,
      py: 2.5,
      minH: '40px',
    },
    md: {
      fontSize: 'sm',
      px: 7,
      py: 3,
      minH: '50px',
    },
    lg: {
      fontSize: 'md',
      px: 9,
      py: 4,
      minH: '58px',
    },
    xl: {
      fontSize: 'lg',
      px: 11,
      py: 5,
      minH: '66px',
    },
  },
  
  variants: {
    // Primary pink - soft coral, super cute (flat)
    clay: {
      bg: colors.kawaii.pink,
      color: colors.text.inverse,
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
      _hover: {
        bg: colors.kawaii.pinkLight,
        transform: 'translateY(-4px) scale(1.03)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
      },
      _active: {
        transform: 'translateY(2px) scale(0.96)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
      },
    },
    
    // Mint button - fresh and happy (flat)
    clayCyan: {
      bg: colors.kawaii.mint,
      color: colors.text.inverse,
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
      _hover: {
        bg: colors.kawaii.mintLight,
        transform: 'translateY(-4px) scale(1.03)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
      },
      _active: {
        transform: 'translateY(2px) scale(0.96)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
      },
    },
    
    // Lilac button - dreamy and cute (flat)
    clayLilac: {
      bg: colors.kawaii.lilac,
      color: colors.text.inverse,
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
      _hover: {
        bg: colors.kawaii.lilacLight,
        transform: 'translateY(-4px) scale(1.03)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
      },
      _active: {
        transform: 'translateY(2px) scale(0.96)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
      },
    },
    
    // Peach button - warm and cozy (flat)
    clayPeach: {
      bg: colors.kawaii.peach,
      color: colors.text.inverse,
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
      _hover: {
        bg: colors.kawaii.peachLight,
        transform: 'translateY(-4px) scale(1.03)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)',
      },
      _active: {
        transform: 'translateY(2px) scale(0.96)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
      },
    },
    
    // Outline pink - soft border
    clayOutline: {
      bg: 'rgba(255, 181, 186, 0.1)',
      color: colors.kawaii.pink,
      border: '2px solid',
      borderColor: colors.kawaii.pink,
      boxShadow: 'none',
      _hover: {
        bg: 'rgba(255, 181, 186, 0.2)',
        transform: 'translateY(-3px)',
        borderColor: colors.kawaii.pinkLight,
      },
      _active: {
        transform: 'scale(0.97)',
        bg: 'rgba(255, 181, 186, 0.25)',
      },
    },
    
    // Outline mint
    clayOutlineCyan: {
      bg: 'rgba(181, 234, 221, 0.1)',
      color: colors.kawaii.mint,
      border: '2px solid',
      borderColor: colors.kawaii.mint,
      boxShadow: 'none',
      _hover: {
        bg: 'rgba(181, 234, 221, 0.2)',
        transform: 'translateY(-3px)',
        borderColor: colors.kawaii.mintLight,
      },
      _active: {
        transform: 'scale(0.97)',
        bg: 'rgba(181, 234, 221, 0.25)',
      },
    },
    
    // Ghost button
    ghost: {
      bg: 'transparent',
      color: colors.text.secondary,
      _hover: {
        bg: 'rgba(255, 181, 186, 0.12)',
        color: colors.kawaii.pink,
      },
      _active: {
        bg: 'rgba(255, 181, 186, 0.18)',
      },
    },
    
    // Danger button - soft red (flat)
    danger: {
      bg: colors.error,
      color: colors.text.inverse,
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
      _hover: {
        filter: 'brightness(1.1)',
        transform: 'translateY(-3px)',
        boxShadow: '0 5px 14px rgba(0, 0, 0, 0.18)',
      },
      _active: {
        transform: 'scale(0.97)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  
  defaultProps: {
    size: 'md',
    variant: 'clay',
  },
};

export default Button;
