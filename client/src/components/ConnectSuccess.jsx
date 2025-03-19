// ConnectSuccess - Platform connection success page with Kawaii Cute design
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Center,
  VStack,
  Heading,
  Text,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
  Circle,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiMusic } from 'react-icons/fi';
import { ClayCard, ClayCardBody, ClayButton, OutlineButton, FloatingShapes } from './ui';

const MotionBox = motion(Box);

const ConnectSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  
  const platform = searchParams.get('platform');
  const warning = searchParams.get('warning');
  const error = searchParams.get('error');

  useEffect(() => {
    if (!error) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/profile');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [navigate, error]);

  const getPlatformName = () => {
    const names = {
      apple_music: 'Apple Music',
      youtube_music: 'YouTube Music'
    };
    return names[platform] || 'music platform';
  };

  if (error) {
    return (
      <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden">
        <FloatingShapes variant="subtle" />
        <Center minH="100vh" p={4} position="relative" zIndex={1}>
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ClayCard maxW="500px">
              <ClayCardBody py={12} textAlign="center">
                <VStack spacing={6}>
                  <Circle size="80px" bg="error">
                    <Icon as={FiAlertTriangle} boxSize={10} color="white.pure" />
                  </Circle>
                  
                  <Heading
                    fontFamily="heading"
                    fontSize="2xl"
                    fontWeight="bold"
                    color="error"
                  >
                    Connection Failed
                  </Heading>
                  
                  <Alert 
                    status="error" 
                    borderRadius="2xl"
                    bg="rgba(255, 71, 87, 0.1)"
                    border="2px solid"
                    borderColor="error"
                  >
                    <AlertIcon color="error" />
                    <Text fontFamily="body" fontSize="sm" color="text.secondary">
                      {error === 'sync_failed' 
                        ? 'Platform connected, but data sync failed. You can retry from your profile.'
                        : 'Failed to connect your music platform. Please try again.'}
                    </Text>
                  </Alert>
                  
                  <ClayButton onClick={() => navigate('/profile')} size="lg">
                    Go to Profile
                  </ClayButton>
                </VStack>
              </ClayCardBody>
            </ClayCard>
          </MotionBox>
        </Center>
      </Box>
    );
  }

  return (
    <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden">
      <FloatingShapes variant="subtle" />
      <Center minH="100vh" p={4} position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ClayCard maxW="500px">
            <ClayCardBody py={12} textAlign="center">
              <VStack spacing={6}>
                <MotionBox
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Circle size="90px" bg="kawaii.mint">
                    <Icon as={FiCheckCircle} boxSize={12} color="white.pure" />
                  </Circle>
                </MotionBox>
                
                <Heading
                  fontFamily="heading"
                  fontSize="2xl"
                  fontWeight="bold"
                  bgGradient="linear(135deg, kawaii.mint, kawaii.lilac)"
                  bgClip="text"
                >
                  Successfully Connected!
                </Heading>
                
                <Text fontFamily="body" fontSize="lg" color="text.secondary">
                  {getPlatformName()} has been connected to your account
                </Text>

                {warning === 'sync_failed' && (
                  <Alert 
                    status="warning" 
                    borderRadius="2xl"
                    bg="rgba(255, 207, 181, 0.15)"
                    border="2px solid"
                    borderColor="kawaii.peach"
                  >
                    <AlertIcon color="kawaii.peach" />
                    <Text fontFamily="body" fontSize="sm" color="text.secondary">
                      Platform connected, but initial data sync encountered issues. 
                      You can manually sync from your profile settings.
                    </Text>
                  </Alert>
                )}
                
                <HStack spacing={2} justify="center">
                  <Circle size="24px" bg="kawaii.pink">
                    <Spinner size="xs" color="white.pure" />
                  </Circle>
                  <Text fontFamily="body" fontSize="sm" color="text.muted">
                    Redirecting in {countdown} seconds...
                  </Text>
                </HStack>
                
                <OutlineButton onClick={() => navigate('/profile')}>
                  Go to Profile Now
                </OutlineButton>
              </VStack>
            </ClayCardBody>
          </ClayCard>
        </MotionBox>
      </Center>
    </Box>
  );
};

export default ConnectSuccess;
