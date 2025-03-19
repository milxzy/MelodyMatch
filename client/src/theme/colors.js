// MelodyMatch Color Palette - Kawaii Cute & Cozy
// Soft pastels, warm and playful, like a cozy hug

export const colors = {
  // Base backgrounds - warm, cozy dark (not cold/harsh)
  bg: {
    base: '#1A1520',      // Warm purple-black
    surface: '#241E2C',   // Card surface - slightly purple
    elevated: '#2E2638',  // Elevated elements
    muted: '#1E1826',     // Muted backgrounds
  },
  
  // Soft whites - pastel creamy tones instead of harsh white
  white: {
    pure: '#FFF8F9',      // Warm cream white (use instead of #fff/white)
    soft: '#FFF0F2',      // Soft pink-white
    cream: '#FFF5F0',     // Creamy peachy white
    snow: '#F8F4F9',      // Cool lavender white
  },
  
  // Warm border colors - pink-tinted instead of cold white
  border: {
    subtle: 'rgba(255, 200, 210, 0.08)',    // Very subtle warm border
    light: 'rgba(255, 200, 210, 0.12)',     // Light warm border
    medium: 'rgba(255, 200, 210, 0.18)',    // Medium warm border
    strong: 'rgba(255, 200, 210, 0.25)',    // Stronger warm border
  },
  
  // Kawaii pastel palette - soft, cute, happy
  kawaii: {
    // Primary - soft coral pink (warm, friendly)
    pink: '#FFB5BA',
    pinkLight: '#FFCDD0',
    pinkSoft: '#FFE4E6',
    pinkGlow: 'rgba(255, 181, 186, 0.25)', // Soft focus ring, no glow
    
    // Secondary - soft lilac/lavender (dreamy, calm)
    lilac: '#D4BFFF',
    lilacLight: '#E4D6FF',
    lilacSoft: '#F0EAFF',
    lilacGlow: 'rgba(212, 191, 255, 0.25)', // Soft focus ring, no glow
    
    // Accent - peachy cream (warm, cozy)
    peach: '#FFCFB5',
    peachLight: '#FFE0CE',
    
    // Accent - soft mint (fresh, happy)
    mint: '#B5EADD',
    mintLight: '#D0F2E9',
    mintGlow: 'rgba(181, 234, 221, 0.25)', // Soft focus ring, no glow
    
    // Accent - soft sky blue (calming)
    sky: '#B5D9FF',
    skyLight: '#D0E8FF',
    
    // Accent - soft butter yellow (happy, sunny)
    butter: '#FFF2B5',
    butterLight: '#FFF7D0',
  },
  
  // Keep neon for backwards compatibility - map to kawaii
  neon: {
    pink: '#FFB5BA',
    pinkDim: '#E8A3A8',
    cyan: '#B5EADD',
    cyanDim: '#9DD8CA',
    purple: '#D4BFFF',
    purpleDim: '#BCA8E8',
  },
  
  // Bubble compat
  bubble: {
    pink: '#FFB5BA',
    pinkLight: '#FFCDD0',
    pinkSoft: '#FFE4E6',
    mint: '#B5EADD',
    mintLight: '#D0F2E9',
    lavender: '#D4BFFF',
    lavenderLight: '#E4D6FF',
  },
  
  // Text colors - soft, easy on eyes
  text: {
    primary: '#FFF8F9',   // Warm white
    secondary: '#E8D8E0', // Soft pink-gray
    muted: '#9A8A94',     // Muted mauve
    inverse: '#1A1520',
  },
  
  // Semantic colors - soft versions
  success: '#B5EADD',
  warning: '#FFE0B5',
  error: '#FFB5B5',
  
  // Gradients - soft, dreamy, cute
  gradients: {
    kawaii: 'linear-gradient(135deg, #FFB5BA 0%, #D4BFFF 50%, #B5EADD 100%)',
    pinkLilac: 'linear-gradient(135deg, #FFB5BA 0%, #D4BFFF 100%)',
    peachy: 'linear-gradient(135deg, #FFCFB5 0%, #FFB5BA 100%)',
    dreamy: 'linear-gradient(135deg, #D4BFFF 0%, #B5D9FF 100%)',
    sunset: 'linear-gradient(135deg, #FFB5BA 0%, #FFCFB5 50%, #FFF2B5 100%)',
    cotton: 'linear-gradient(135deg, #FFE4E6 0%, #F0EAFF 50%, #D0F2E9 100%)',
  },
  
  // Shadows - soft, flat, no inset effects
  shadows: {
    // Soft card shadow - flat
    cozyCard: '0 2px 8px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
    cozyCardHover: '0 4px 12px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.12)',
    // Soft button shadow - flat
    cuteButton: '0 3px 10px rgba(0, 0, 0, 0.15)',
    cuteButtonPressed: '0 1px 3px rgba(0, 0, 0, 0.15)',
    // Simple subtle shadows
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 2px 8px rgba(0, 0, 0, 0.15)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.18)',
    // Legacy compat - flat
    glowPink: '0 4px 12px rgba(0, 0, 0, 0.15)',
    glowLilac: '0 4px 12px rgba(0, 0, 0, 0.15)',
    glowMint: '0 4px 12px rgba(0, 0, 0, 0.15)',
    glowPeach: '0 4px 12px rgba(0, 0, 0, 0.15)',
    glowCyan: '0 4px 12px rgba(0, 0, 0, 0.15)',
    glowPurple: '0 4px 12px rgba(0, 0, 0, 0.15)',
    clayCard: '0 2px 8px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
    clayCardHover: '0 4px 12px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.12)',
    clayButton: '0 3px 10px rgba(0, 0, 0, 0.15)',
    clayButtonPressed: '0 1px 3px rgba(0, 0, 0, 0.15)',
    bubbleCard: '0 2px 8px rgba(0, 0, 0, 0.15)',
    bubbleCardHover: '0 4px 12px rgba(0, 0, 0, 0.18)',
    bubbleButton: '0 3px 10px rgba(0, 0, 0, 0.15)',
    bubbleButtonPressed: '0 1px 3px rgba(0, 0, 0, 0.15)',
  },
};

export default colors;
