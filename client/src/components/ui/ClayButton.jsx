// CuteButton - Super squishy, kawaii-style button with satisfying bounce
import { Button as ChakraButton, forwardRef } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionButton = motion(ChakraButton);

const ClayButton = forwardRef(({ 
  children, 
  variant = 'clay',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  return (
    <MotionButton
      ref={ref}
      variant={variant}
      size={size}
      isLoading={isLoading}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      style={{ willChange: 'transform' }}
      // Suppress Chakra's CSS hover transform — Framer Motion owns transform exclusively
      sx={{ '&:hover': { transform: 'none !important' } }}
      whileTap={{ 
        scale: 0.92,
        y: 3,
        transition: { 
          type: 'spring', 
          stiffness: 600, 
          damping: 15,
        }
      }}
      whileHover={{
        y: -4,
        scale: 1.03,
        transition: { 
          type: 'spring',
          stiffness: 400,
          damping: 20,
        }
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
});

ClayButton.displayName = 'ClayButton';

// Preset variants
export const PinkButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="clay" {...props} />
));

export const CyanButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="clayCyan" {...props} />
));

export const MintButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="clayCyan" {...props} />
));

export const LilacButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="clayLilac" {...props} />
));

export const PeachButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="clayPeach" {...props} />
));

export const OutlineButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="clayOutline" {...props} />
));

export const OutlineCyanButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="clayOutlineCyan" {...props} />
));

export const OutlineMintButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="clayOutlineCyan" {...props} />
));

export const GhostButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="ghost" {...props} />
));

export const DangerButton = forwardRef((props, ref) => (
  <ClayButton ref={ref} variant="danger" {...props} />
));

// Display names
PinkButton.displayName = 'PinkButton';
CyanButton.displayName = 'CyanButton';
MintButton.displayName = 'MintButton';
LilacButton.displayName = 'LilacButton';
PeachButton.displayName = 'PeachButton';
OutlineButton.displayName = 'OutlineButton';
OutlineCyanButton.displayName = 'OutlineCyanButton';
OutlineMintButton.displayName = 'OutlineMintButton';
GhostButton.displayName = 'GhostButton';
DangerButton.displayName = 'DangerButton';

export default ClayButton;
