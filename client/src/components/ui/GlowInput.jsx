// SoftInput - Input with soft kawaii focus effect (no glow)
import { 
  Input as ChakraInput, 
  Textarea as ChakraTextarea,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  forwardRef 
} from '@chakra-ui/react';

export const GlowInput = forwardRef(({ 
  variant = 'soft',
  size = 'md',
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  if (leftIcon || rightIcon) {
    return (
      <InputGroup size={size}>
        {leftIcon && (
          <InputLeftElement color="text.muted" pointerEvents="none">
            {leftIcon}
          </InputLeftElement>
        )}
        <ChakraInput ref={ref} variant={variant} {...props} />
        {rightIcon && (
          <InputRightElement color="text.muted">
            {rightIcon}
          </InputRightElement>
        )}
      </InputGroup>
    );
  }

  return <ChakraInput ref={ref} variant={variant} size={size} {...props} />;
});

GlowInput.displayName = 'GlowInput';

export const GlowTextarea = forwardRef(({ 
  variant = 'soft',
  ...props 
}, ref) => {
  return <ChakraTextarea ref={ref} variant={variant} {...props} />;
});

GlowTextarea.displayName = 'GlowTextarea';

export default GlowInput;
