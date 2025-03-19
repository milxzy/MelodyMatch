// CuteBadge component styles - Kawaii pill badges (no glow)
import { colors } from '../colors';

export const Badge = {
  baseStyle: {
    fontFamily: 'heading',
    fontWeight: 'semibold',
    letterSpacing: 'wide',
    borderRadius: 'full',
    px: 4,
    py: 1.5,
    fontSize: 'xs',
    transition: 'all 0.2s ease',
  },
  
  variants: {
    // Pink badge - soft and cute
    neonPink: {
      bg: 'rgba(255, 181, 186, 0.25)',
      color: colors.kawaii.pink,
      border: '2px solid',
      borderColor: 'rgba(255, 181, 186, 0.5)',
    },
    
    // Mint badge - fresh
    neonCyan: {
      bg: 'rgba(181, 234, 221, 0.25)',
      color: colors.kawaii.mint,
      border: '2px solid',
      borderColor: 'rgba(181, 234, 221, 0.5)',
    },
    
    // Lilac badge - dreamy
    neonPurple: {
      bg: 'rgba(212, 191, 255, 0.25)',
      color: colors.kawaii.lilac,
      border: '2px solid',
      borderColor: 'rgba(212, 191, 255, 0.5)',
    },
    
    // Peach badge - warm
    neonPeach: {
      bg: 'rgba(255, 207, 181, 0.25)',
      color: colors.kawaii.peach,
      border: '2px solid',
      borderColor: 'rgba(255, 207, 181, 0.5)',
    },
    
    // Success - soft mint
    success: {
      bg: 'rgba(181, 234, 221, 0.25)',
      color: colors.success,
      border: '2px solid',
      borderColor: 'rgba(181, 234, 221, 0.5)',
    },
    
    // Warning - soft butter
    warning: {
      bg: 'rgba(255, 224, 181, 0.25)',
      color: colors.warning,
      border: '2px solid',
      borderColor: 'rgba(255, 224, 181, 0.5)',
    },
    
    // Error - soft red
    error: {
      bg: 'rgba(255, 181, 181, 0.25)',
      color: colors.error,
      border: '2px solid',
      borderColor: 'rgba(255, 181, 181, 0.5)',
    },
    
    // Solid pink
    solid: {
      bg: colors.kawaii.pink,
      color: colors.text.inverse,
      border: 'none',
    },
    
    // Solid mint
    solidCyan: {
      bg: colors.kawaii.mint,
      color: colors.text.inverse,
      border: 'none',
    },
    
    // Solid lilac
    solidLilac: {
      bg: colors.kawaii.lilac,
      color: colors.text.inverse,
      border: 'none',
    },
    
    // Muted
    muted: {
      bg: 'rgba(255, 255, 255, 0.1)',
      color: colors.text.secondary,
      border: '2px solid',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    
    // Compatibility badges - cute versions
    perfect: {
      bg: 'rgba(181, 234, 221, 0.3)',
      color: colors.success,
      border: '2px solid',
      borderColor: 'rgba(181, 234, 221, 0.6)',
    },
    
    great: {
      bg: 'rgba(181, 234, 221, 0.25)',
      color: colors.kawaii.mint,
      border: '2px solid',
      borderColor: 'rgba(181, 234, 221, 0.5)',
    },
    
    good: {
      bg: 'rgba(255, 242, 181, 0.25)',
      color: colors.kawaii.butter,
      border: '2px solid',
      borderColor: 'rgba(255, 242, 181, 0.5)',
    },
    
    fair: {
      bg: 'rgba(255, 207, 181, 0.25)',
      color: colors.kawaii.peach,
      border: '2px solid',
      borderColor: 'rgba(255, 207, 181, 0.5)',
    },
  },
  
  defaultProps: {
    variant: 'neonCyan',
  },
};

export default Badge;
