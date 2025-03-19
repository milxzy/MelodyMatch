// MigrationWizard - Platform migration wizard with Kawaii Cute design
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Progress,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Divider,
  Spinner,
  Center,
  Circle,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiMusic, FiArrowRight, FiCheckCircle, FiAlertTriangle, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PlatformSelector from './PlatformSelector';
import { ClayCard, ClayCardBody, ClayButton, CyanButton, FloatingShapes } from './ui';

const MotionBox = motion(Box);

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const MigrationWizard = ({ userId: userIdProp, onComplete }) => {
  const [step, setStep] = useState(1);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(userIdProp);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUserId(parsed._id || parsed.id);
    } else if (!userIdProp) {
      const timer = setTimeout(() => navigate('/belogin'), 0);
      return () => clearTimeout(timer);
    }
  }, [userIdProp, navigate]);

  useEffect(() => {
    if (userId) {
      checkMigrationStatus();
    }
  }, [userId]);

  const checkMigrationStatus = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/platforms/status?userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          setLoading(false);
          return;
        }
        throw new Error('Failed to check migration status');
      }

      const data = await response.json();
      setMigrationStatus(data.status);

      if (data.status.hasCompletedMigration) {
        if (onComplete) {
          onComplete();
        } else {
          navigate('/profile');
        }
        return;
      }

      if (data.status.needsMigration) {
        setIsOpen(true);
      }
      
    } catch (error) {
      console.error('Error checking migration status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformConnected = async (platform) => {
    try {
      const response = await fetch(`${API_URL}/auth/platforms/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, platform }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync platform data');
      }

      await checkMigrationStatus();
      setStep(3);
      
    } catch (error) {
      console.error('Error syncing after platform connection:', error);
      setStep(3);
      await checkMigrationStatus();
    }
  };

  const handleCompleteMigration = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/platforms/complete-migration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete migration');
      }

      setStep(4);
      
      setTimeout(() => {
        setIsOpen(false);
        onComplete?.();
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing migration:', error);
    }
  };

  const renderStep1 = () => (
    <VStack spacing={6} textAlign="center">
      <Circle size="80px" bg="kawaii.peach">
        <Icon as={FiHeart} boxSize={10} color="white.pure" />
      </Circle>
      
      <Heading
        fontFamily="heading"
        fontSize="xl"
        fontWeight="bold"
        bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
        bgClip="text"
      >
        Important Update
      </Heading>
      
      <Text fontFamily="body" color="text.secondary" fontSize="md">
        Spotify recently changed their API policy and now requires 250,000 monthly active users for access.
      </Text>
      
      <Alert 
        status="info" 
        borderRadius="2xl"
        bg="rgba(181, 234, 221, 0.15)"
        border="2px solid"
        borderColor="kawaii.mint"
      >
        <AlertIcon color="kawaii.mint" />
        <VStack align="start" spacing={1}>
          <Text fontFamily="body" fontWeight="bold" color="text.primary" fontSize="sm">
            We're making MelodyMatch even better!
          </Text>
          <Text fontFamily="body" fontSize="xs" color="text.muted">
            We've added support for Apple Music, with YouTube Music coming soon!
          </Text>
        </VStack>
      </Alert>
      
      <VStack spacing={3} align="start" w="full" pl={4}>
        {[
          'More music platforms to choose from',
          'Connect multiple platforms for better matching',
          'Your preferences stay with you'
        ].map((text, i) => (
          <HStack key={i}>
            <Icon as={FiCheckCircle} color="success" />
            <Text fontFamily="body" color="text.secondary" fontSize="sm">{text}</Text>
          </HStack>
        ))}
      </VStack>
      
      <Divider borderColor="rgba(255, 200, 210, 0.12)" />
      
      <ClayButton
        size="lg"
        w="full"
        rightIcon={<Icon as={FiArrowRight} />}
        onClick={() => setStep(2)}
      >
        Get Started
      </ClayButton>
      
      <Text fontFamily="body" fontSize="xs" color="text.muted">
        This will only take 2 minutes
      </Text>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={6}>
      <VStack spacing={2} textAlign="center">
        <Heading
          fontFamily="heading"
          fontSize="xl"
          fontWeight="bold"
          bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
          bgClip="text"
        >
          Connect Your Music
        </Heading>
        <Text fontFamily="body" color="text.muted" fontSize="sm">
          Connect Apple Music to get started
        </Text>
      </VStack>

      <Box w="full">
        <PlatformSelector 
          userId={userId} 
          onPlatformConnected={handlePlatformConnected}
        />
      </Box>
    </VStack>
  );

  const renderStep3 = () => (
    <VStack spacing={6} textAlign="center">
      <Circle size="80px" bg="kawaii.mint">
        <Icon as={FiCheckCircle} boxSize={10} color="white.pure" />
      </Circle>
      
      <Heading
        fontFamily="heading"
        fontSize="xl"
        fontWeight="bold"
        bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
        bgClip="text"
      >
        Platform Connected!
      </Heading>
      
      <Text fontFamily="body" color="text.secondary">
        Your music data has been imported successfully
      </Text>
      
      {migrationStatus && (
        <ClayCard w="full">
          <ClayCardBody py={6}>
            <HStack spacing={8} justify="center">
              <VStack>
                <Text fontFamily="body" fontSize="xs" color="text.muted" textTransform="uppercase" letterSpacing="wide">
                  Artists
                </Text>
                <Text 
                  fontFamily="heading" 
                  fontSize="3xl" 
                  fontWeight="bold"
                  color="kawaii.pink"
                >
                  {migrationStatus.aggregatedData?.artistCount || 0}
                </Text>
              </VStack>
              <VStack>
                <Text fontFamily="body" fontSize="xs" color="text.muted">
                  Genres
                </Text>
                <Text 
                  fontFamily="heading" 
                  fontSize="3xl" 
                  fontWeight="bold"
                  color="kawaii.lilac"
                >
                  {migrationStatus.aggregatedData?.genreCount || 0}
                </Text>
              </VStack>
            </HStack>
          </ClayCardBody>
        </ClayCard>
      )}
      
      <Alert 
        status="success" 
        borderRadius="2xl"
        bg="rgba(181, 234, 221, 0.15)"
        border="2px solid"
        borderColor="kawaii.mint"
      >
        <AlertIcon color="kawaii.mint" />
        <Text fontFamily="body" fontSize="sm" color="text.secondary">
          You can connect additional platforms anytime from your profile settings
        </Text>
      </Alert>
      
      <CyanButton size="lg" w="full" onClick={handleCompleteMigration}>
        Continue to MelodyMatch
      </CyanButton>
    </VStack>
  );

  const renderStep4 = () => (
    <VStack spacing={6} textAlign="center">
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
        bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
        bgClip="text"
      >
        Welcome Back!
      </Heading>
      
      <Text fontFamily="body" fontSize="lg" color="text.secondary">
        Your migration is complete. Redirecting...
      </Text>
      
      <Progress 
        size="sm" 
        isIndeterminate 
        w="full" 
        borderRadius="full"
        bg="surface.muted"
        sx={{
          '& > div': {
            bgGradient: 'linear(90deg, kawaii.pink, kawaii.lilac)',
          }
        }}
      />
    </VStack>
  );

  const getStepContent = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  if (loading) {
    return (
      <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden">
        <FloatingShapes variant="subtle" />
        <Center minH="100vh" position="relative" zIndex={1}>
          <VStack spacing={4}>
            <Circle size="60px" bg="kawaii.pink">
              <Spinner size="lg" color="white.pure" thickness="3px" />
            </Circle>
            <Text fontFamily="body" color="text.muted">Checking migration status...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  if (!userId) {
    navigate('/belogin');
    return null;
  }

  if (migrationStatus && !migrationStatus.needsMigration) {
    navigate('/profile');
    return null;
  }

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={() => {}}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        size="2xl"
        isCentered
      >
        <ModalOverlay bg="rgba(15, 15, 26, 0.95)" backdropFilter="blur(10px)" />
        <ModalContent 
          bg="surface.card" 
          borderRadius="3xl"
          border="2px solid"
          borderColor="rgba(255, 200, 210, 0.1)"
          boxShadow="0 25px 50px rgba(0, 0, 0, 0.3)"
          maxW="600px"
          mx={4}
        >
          {step < 4 && (
            <ModalHeader borderBottom="1px solid" borderColor="rgba(255, 200, 210, 0.06)" pb={4}>
              <Progress 
                value={(step / 4) * 100} 
                size="sm" 
                borderRadius="full"
                mb={4}
                bg="surface.muted"
                sx={{
                  '& > div': {
                    bgGradient: 'linear(90deg, kawaii.pink, kawaii.lilac)',
                  }
                }}
              />
              <HStack justify="space-between">
                <HStack spacing={2}>
                  <Circle size="32px" bg="kawaii.pink">
                    <Icon as={FiMusic} color="white.pure" boxSize={4} />
                  </Circle>
                  <Text fontFamily="heading" fontWeight="bold" fontSize="sm" color="text.primary">
                    MelodyMatch Migration
                  </Text>
                </HStack>
                <Text fontFamily="body" fontSize="xs" color="text.muted">
                  Step {step} of 3
                </Text>
              </HStack>
            </ModalHeader>
          )}
          
          <ModalBody py={8} px={6}>
            {getStepContent()}
          </ModalBody>
        </ModalContent>
      </Modal>

      {!isOpen && migrationStatus?.needsMigration && (
        <Alert 
          status="warning" 
          mb={4} 
          borderRadius="2xl"
          bg="rgba(255, 207, 181, 0.15)"
          border="2px solid"
          borderColor="kawaii.peach"
        >
          <AlertIcon color="kawaii.peach" />
          <VStack align="start" spacing={0} flex={1}>
            <Text fontFamily="body" fontWeight="bold" fontSize="sm" color="text.primary">
              Migration Required
            </Text>
            <Text fontFamily="body" fontSize="xs" color="text.muted">
              Please connect a music platform to continue using MelodyMatch
            </Text>
          </VStack>
          <ClayButton size="sm" onClick={() => setIsOpen(true)}>
            Start Migration
          </ClayButton>
        </Alert>
      )}
    </>
  );
};

export default MigrationWizard;
