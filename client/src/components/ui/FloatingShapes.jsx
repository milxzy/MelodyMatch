// FloatingCuties - Kawaii floating hearts, stars, and sparkles
import { memo } from 'react';
import { Box } from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';

const MotionBox = motion(Box);

// Cute heart shape using CSS
const FloatingHeart = ({ 
  size, 
  color, 
  initialX, 
  initialY, 
  duration,
  delay = 0,
  opacity = 0.6,
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <MotionBox
      position="absolute"
      left={initialX}
      top={initialY}
      width={`${size}px`}
      height={`${size}px`}
      opacity={opacity}
      pointerEvents="none"
      willChange="transform"
      transform="translateZ(0)"
      animate={shouldReduceMotion ? {} : {
        y: [0, -15, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <svg viewBox="0 0 24 24" fill={color}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </MotionBox>
  );
};

// Cute star shape
const FloatingStar = ({ 
  size, 
  color, 
  initialX, 
  initialY, 
  duration,
  delay = 0,
  opacity = 0.7,
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <MotionBox
      position="absolute"
      left={initialX}
      top={initialY}
      width={`${size}px`}
      height={`${size}px`}
      opacity={opacity}
      pointerEvents="none"
      willChange="transform"
      transform="translateZ(0)"
      animate={shouldReduceMotion ? {} : {
        rotate: [0, 360],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <svg viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </MotionBox>
  );
};

// Sparkle/twinkle effect
const Sparkle = ({ 
  size, 
  color, 
  initialX, 
  initialY, 
  duration,
  delay = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <MotionBox
      position="absolute"
      left={initialX}
      top={initialY}
      width={`${size}px`}
      height={`${size}px`}
      pointerEvents="none"
      willChange="transform"
      transform="translateZ(0)"
      animate={shouldReduceMotion ? {} : {
        opacity: [0.3, 1, 0.3],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      <svg viewBox="0 0 24 24" fill={color}>
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"/>
      </svg>
    </MotionBox>
  );
};

// Soft blob for background
const SoftBlob = ({ 
  size, 
  color, 
  initialX, 
  initialY, 
  duration,
  delay = 0,
  blur = 80,
  opacity = 0.15,
}) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <MotionBox
      position="absolute"
      left={initialX}
      top={initialY}
      width={`${size}px`}
      height={`${size}px`}
      bg={color}
      filter={`blur(${blur}px)`}
      opacity={opacity}
      pointerEvents="none"
      borderRadius="full"
      willChange="transform"
      transform="translateZ(0)"
      animate={shouldReduceMotion ? {} : {
        y: [0, -15, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
        delay: delay,
      }}
    />
  );
};

// Main FloatingShapes container
const FloatingShapes = memo(({ 
  variant = 'default', // 'default' | 'hero' | 'subtle'
  ...props 
}) => {
  const variants = {
    default: {
      blobs: [
        { size: 350, color: 'rgba(255, 181, 186, 0.4)', initialX: '5%', initialY: '10%', duration: 25, blur: 100 },
        { size: 280, color: 'rgba(212, 191, 255, 0.35)', initialX: '70%', initialY: '50%', duration: 22, delay: 2, blur: 90 },
        { size: 220, color: 'rgba(181, 234, 221, 0.3)', initialX: '60%', initialY: '5%', duration: 28, delay: 4, blur: 80 },
        { size: 180, color: 'rgba(255, 207, 181, 0.3)', initialX: '15%', initialY: '70%', duration: 20, delay: 1, blur: 70 },
      ],
      hearts: [
        { size: 20, color: 'rgba(255, 181, 186, 0.6)', initialX: '15%', initialY: '20%', duration: 8, delay: 0 },
        { size: 16, color: 'rgba(255, 181, 186, 0.5)', initialX: '80%', initialY: '30%', duration: 10, delay: 2 },
        { size: 14, color: 'rgba(255, 181, 186, 0.55)', initialX: '25%', initialY: '75%', duration: 9, delay: 1 },
        { size: 18, color: 'rgba(255, 181, 186, 0.45)', initialX: '90%', initialY: '70%', duration: 11, delay: 3 },
      ],
      stars: [
        { size: 16, color: 'rgba(255, 242, 181, 0.7)', initialX: '30%', initialY: '15%', duration: 7, delay: 0.5 },
        { size: 12, color: 'rgba(255, 242, 181, 0.6)', initialX: '85%', initialY: '55%', duration: 9, delay: 2.5 },
        { size: 14, color: 'rgba(255, 242, 181, 0.65)', initialX: '55%', initialY: '85%', duration: 8, delay: 1.5 },
      ],
      sparkles: [
        { size: 10, color: 'rgba(255, 248, 249, 0.7)', initialX: '20%', initialY: '40%', duration: 3, delay: 0 },
        { size: 8, color: 'rgba(255, 240, 242, 0.6)', initialX: '75%', initialY: '25%', duration: 4, delay: 1 },
        { size: 12, color: 'rgba(255, 248, 249, 0.65)', initialX: '60%', initialY: '65%', duration: 3.5, delay: 2 },
        { size: 9, color: 'rgba(255, 240, 242, 0.55)', initialX: '40%', initialY: '80%', duration: 4.5, delay: 0.5 },
        { size: 11, color: 'rgba(255, 248, 249, 0.7)', initialX: '10%', initialY: '55%', duration: 3, delay: 1.5 },
      ],
    },
    hero: {
      blobs: [
        { size: 400, color: 'rgba(255, 181, 186, 0.4)', initialX: '0%', initialY: '5%', duration: 30, blur: 80 },
        { size: 350, color: 'rgba(212, 191, 255, 0.35)', initialX: '60%', initialY: '40%', duration: 28, delay: 3, blur: 70 },
        { size: 300, color: 'rgba(181, 234, 221, 0.3)', initialX: '15%', initialY: '65%', duration: 32, delay: 5, blur: 75 },
      ],
      hearts: [
        { size: 24, color: 'rgba(255, 181, 186, 0.65)', initialX: '15%', initialY: '20%', duration: 9, delay: 0 },
        { size: 20, color: 'rgba(255, 181, 186, 0.55)', initialX: '75%', initialY: '30%', duration: 11, delay: 2 },
        { size: 18, color: 'rgba(255, 181, 186, 0.6)', initialX: '25%', initialY: '75%', duration: 10, delay: 1 },
      ],
      stars: [
        { size: 18, color: 'rgba(255, 242, 181, 0.75)', initialX: '30%', initialY: '15%', duration: 8, delay: 0.5 },
        { size: 16, color: 'rgba(255, 242, 181, 0.7)', initialX: '80%', initialY: '50%', duration: 10, delay: 2.5 },
      ],
      sparkles: [
        { size: 12, color: 'rgba(255, 248, 249, 0.75)', initialX: '20%', initialY: '40%', duration: 4, delay: 0 },
        { size: 10, color: 'rgba(255, 240, 242, 0.65)', initialX: '70%', initialY: '65%', duration: 4.5, delay: 1.5 },
      ],
    },
    subtle: {
      blobs: [
        { size: 280, color: 'rgba(255, 181, 186, 0.25)', initialX: '10%', initialY: '15%', duration: 35, blur: 120, opacity: 0.1 },
        { size: 220, color: 'rgba(212, 191, 255, 0.2)', initialX: '70%', initialY: '60%', duration: 30, delay: 3, blur: 100, opacity: 0.08 },
        { size: 180, color: 'rgba(181, 234, 221, 0.18)', initialX: '75%', initialY: '10%', duration: 32, delay: 5, blur: 90, opacity: 0.08 },
      ],
      hearts: [
        { size: 12, color: 'rgba(255, 181, 186, 0.35)', initialX: '20%', initialY: '25%', duration: 12, delay: 0, opacity: 0.4 },
        { size: 10, color: 'rgba(255, 181, 186, 0.3)', initialX: '85%', initialY: '40%', duration: 14, delay: 2, opacity: 0.35 },
      ],
      stars: [
        { size: 10, color: 'rgba(255, 242, 181, 0.4)', initialX: '35%', initialY: '18%', duration: 10, delay: 1, opacity: 0.4 },
        { size: 8, color: 'rgba(255, 242, 181, 0.35)', initialX: '60%', initialY: '75%', duration: 12, delay: 3, opacity: 0.35 },
      ],
      sparkles: [
        { size: 8, color: 'rgba(255, 248, 249, 0.5)', initialX: '25%', initialY: '50%', duration: 5, delay: 0 },
        { size: 6, color: 'rgba(255, 240, 242, 0.4)', initialX: '78%', initialY: '30%', duration: 6, delay: 2 },
        { size: 7, color: 'rgba(255, 248, 249, 0.45)', initialX: '50%', initialY: '70%', duration: 5.5, delay: 1 },
      ],
    },
  };

  const config = variants[variant] || variants.default;

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      pointerEvents="none"
      zIndex={0}
      {...props}
    >
      {/* Soft background blobs */}
      {config.blobs.map((blob, index) => (
        <SoftBlob key={`blob-${index}`} {...blob} />
      ))}
      
      {/* Cute hearts */}
      {config.hearts?.map((heart, index) => (
        <FloatingHeart key={`heart-${index}`} {...heart} />
      ))}
      
      {/* Twinkly stars */}
      {config.stars?.map((star, index) => (
        <FloatingStar key={`star-${index}`} {...star} />
      ))}
      
      {/* Sparkles */}
      {config.sparkles?.map((sparkle, index) => (
        <Sparkle key={`sparkle-${index}`} {...sparkle} />
      ))}
    </Box>
  );
});

FloatingShapes.displayName = 'FloatingShapes';

export default FloatingShapes;
