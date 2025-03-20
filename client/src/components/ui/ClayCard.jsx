// CuteCard - Super soft, kawaii-style card component (no glow)
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ClayCard = ({ 
  children, 
  hover = true,
  glow = null, // kept for backwards compat but no longer glows
  onClick,
  ...props 
}) => {
  // Map old names for backwards compat
  const accentColor = glow === 'cyan' ? 'mint' : glow;
  
  const accentColors = {
    pink: 'rgba(255, 181, 186, 0.4)',
    lilac: 'rgba(212, 191, 255, 0.4)',
    mint: 'rgba(181, 234, 221, 0.4)',
    peach: 'rgba(255, 207, 181, 0.4)',
  };

  const borderColor = accentColor 
    ? accentColors[accentColor] 
    : 'rgba(255, 200, 210, 0.12)';

  const hoverAnimation = hover ? {
    whileHover: { 
      y: -8,
      scale: 1.02,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }
    },
  } : {};

  const clickAnimation = onClick ? {
    whileTap: { 
      scale: 0.97,
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }
    },
    cursor: 'pointer',
  } : {};

  return (
    <MotionBox
      bg="surface.card"
      borderRadius="3xl"
      border="2px solid"
      borderColor={borderColor}
      overflow="hidden"
      position="relative"
      style={{ willChange: 'transform' }}
      boxShadow={`
        0 2px 8px rgba(0, 0, 0, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.08),
        inset 0 1px 2px rgba(255, 220, 225, 0.1)
      `}
      {...hoverAnimation}
      {...clickAnimation}
      onClick={onClick}
      transition="border-color 0.2s ease"
      _hover={hover ? {
        borderColor: accentColor ? accentColors[accentColor] : 'rgba(255, 200, 210, 0.2)',
      } : {}}
      {...props}
    >
      {/* Cute top highlight */}
      <Box
        position="absolute"
        top={0}
        left="15%"
        right="15%"
        height="2px"
        bg="linear-gradient(90deg, transparent, rgba(255, 220, 225, 0.15), transparent)"
        borderRadius="full"
        pointerEvents="none"
      />
      {children}
    </MotionBox>
  );
};

// Card with header section
export const ClayCardHeader = ({ children, ...props }) => (
  <Box
    px={6}
    py={4}
    borderBottom="2px solid"
    borderColor="rgba(255, 200, 210, 0.1)"
    {...props}
  >
    {children}
  </Box>
);

// Card body
export const ClayCardBody = ({ children, ...props }) => (
  <Box px={6} py={5} {...props}>
    {children}
  </Box>
);

// Card footer
export const ClayCardFooter = ({ children, ...props }) => (
  <Box
    px={6}
    py={4}
    borderTop="2px solid"
    borderColor="rgba(255, 200, 210, 0.1)"
    {...props}
  >
    {children}
  </Box>
);

export default ClayCard;
