// BubbleBadge - Soft, pillowy badge for tags and labels
import { Badge, Box } from '@chakra-ui/react';

const NeonBadge = ({ 
  children, 
  variant = 'neonCyan',
  size = 'md',
  ...props 
}) => {
  const sizeStyles = {
    sm: { px: 2.5, py: 0.5, fontSize: '2xs' },
    md: { px: 3.5, py: 1, fontSize: 'xs' },
    lg: { px: 5, py: 1.5, fontSize: 'sm' },
  };

  return (
    <Badge 
      variant={variant} 
      {...sizeStyles[size]}
      {...props}
    >
      {children}
    </Badge>
  );
};

// Preset variants with new bubble colors
export const PinkBadge = (props) => <NeonBadge variant="neonPink" {...props} />;
export const CyanBadge = (props) => <NeonBadge variant="neonCyan" {...props} />;
export const MintBadge = (props) => <NeonBadge variant="neonCyan" {...props} />; // Alias
export const PurpleBadge = (props) => <NeonBadge variant="neonPurple" {...props} />;
export const LavenderBadge = (props) => <NeonBadge variant="neonPurple" {...props} />; // Alias
export const SuccessBadge = (props) => <NeonBadge variant="success" {...props} />;
export const WarningBadge = (props) => <NeonBadge variant="warning" {...props} />;
export const ErrorBadge = (props) => <NeonBadge variant="error" {...props} />;

// Compatibility score badges with bubble styling
export const CompatibilityBadge = ({ score, ...props }) => {
  let variant = 'muted';
  let label = 'Unknown';
  
  if (score >= 80) {
    variant = 'perfect';
    label = `${score}% Perfect`;
  } else if (score >= 60) {
    variant = 'great';
    label = `${score}% Great`;
  } else if (score >= 40) {
    variant = 'good';
    label = `${score}% Good`;
  } else if (score >= 20) {
    variant = 'fair';
    label = `${score}% Fair`;
  } else if (score >= 0) {
    variant = 'muted';
    label = `${score}%`;
  }

  return (
    <NeonBadge variant={variant} size="lg" {...props}>
      {label}
    </NeonBadge>
  );
};

export default NeonBadge;
