import { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
  ModalCloseButton,
  useDisclosure,
  Flex,
  Divider,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaMusic, FaArrowRight, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PlatformSelector from './PlatformSelector';

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const MigrationWizard = ({ userId: userIdProp, onComplete }) => {
  const [step, setStep] = useState(1);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(userIdProp);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Get userId from props or localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUserId(parsed._id || parsed.id);
    } else if (!userIdProp) {
      // No user logged in, redirect to login
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Silently fail if not logged in or endpoint not available
        if (response.status === 401 || response.status === 404) {
          setLoading(false);
          return;
        }
        throw new Error('Failed to check migration status');
      }

      const data = await response.json();
      setMigrationStatus(data.status);

      // If already migrated, skip wizard
      if (data.status.hasCompletedMigration) {
        if (onComplete) {
          onComplete();
        } else {
          // No callback provided, navigate to profile
          navigate('/profile');
        }
        return;
      }

      // Auto-open modal if migration needed
      if (data.status.needsMigration) {
        onOpen();
      }
      
    } catch (error) {
      console.error('Error checking migration status:', error);
      // Don't show error to user - this is optional functionality
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformConnected = async (platform) => {
    try {
      // Trigger sync to aggregate data
      const response = await fetch(`${API_URL}/auth/platforms/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          platform // Only sync the platform that was just connected
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync platform data');
      }

      // Refresh migration status to get updated aggregated data
      await checkMigrationStatus();
      
      // Move to next step when platform is connected and synced
      setStep(3);
      
    } catch (error) {
      console.error('Error syncing after platform connection:', error);
      // Still move to step 3 even if sync fails
      setStep(3);
      await checkMigrationStatus();
    }
  };

  const handleCompleteMigration = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/platforms/complete-migration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete migration');
      }

      setStep(4);
      
      // Close modal and redirect after a delay
      setTimeout(() => {
        onClose();
        onComplete?.();
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('Error completing migration:', error);
    }
  };

  const renderStep1 = () => (
    <VStack spacing={6} textAlign="center">
      <Icon as={FaExclamationTriangle} boxSize={16} color="#F6C177" />
      
      <Heading size="lg" color="#EB6F92">
        Important Update
      </Heading>
      
      <Text color="#E0DEF4" fontSize="lg">
        Spotify recently changed their API policy and now requires 250,000 monthly active users for access.
      </Text>
      
      <Alert status="info" bg="#393552" borderRadius="lg">
        <AlertIcon color="#9CCFD8" />
        <VStack align="start" spacing={2}>
          <Text color="#E0DEF4" fontWeight="bold">
            We're making MelodyMatch even better!
          </Text>
          <Text color="#908CAA" fontSize="sm">
            We've added support for Apple Music, with YouTube Music coming soon! Connect platforms for more accurate matching.
          </Text>
        </VStack>
      </Alert>
      
      <VStack spacing={3} align="start" w="full" pl={4}>
        <HStack>
          <Icon as={FaCheckCircle} color="#31748F" />
          <Text color="#E0DEF4">More music platforms to choose from</Text>
        </HStack>
        <HStack>
          <Icon as={FaCheckCircle} color="#31748F" />
          <Text color="#E0DEF4">Connect multiple platforms for better matching</Text>
        </HStack>
        <HStack>
          <Icon as={FaCheckCircle} color="#31748F" />
          <Text color="#E0DEF4">Your preferences stay with you</Text>
        </HStack>
      </VStack>
      
      <Divider borderColor="#6E6A86" />
      
      <Button
        size="lg"
        bg="#EB6F92"
        color="white"
        _hover={{ bg: "#D45879" }}
        rightIcon={<Icon as={FaArrowRight} />}
        onClick={() => setStep(2)}
        w="full"
      >
        Get Started
      </Button>
      
      <Text color="#908CAA" fontSize="sm">
        This will only take 2 minutes
      </Text>
    </VStack>
  );

  const renderStep2 = () => (
    <VStack spacing={6}>
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color="#EB6F92">
          Connect Your Music
        </Heading>
        <Text color="#908CAA">
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
      <Icon as={FaCheckCircle} boxSize={16} color="#31748F" />
      
      <Heading size="lg" color="#EB6F92">
        Platform Connected!
      </Heading>
      
      <Text color="#E0DEF4">
        Your music data has been imported successfully
      </Text>
      
      {migrationStatus && (
        <Box
          bg="#393552"
          p={6}
          borderRadius="lg"
          w="full"
        >
          <VStack spacing={3}>
            <HStack spacing={8} justify="center">
              <VStack>
                <Text color="#908CAA" fontSize="sm">Artists</Text>
                <Text color="#E0DEF4" fontSize="2xl" fontWeight="bold">
                  {migrationStatus.aggregatedData?.artistCount || 0}
                </Text>
              </VStack>
              <VStack>
                <Text color="#908CAA" fontSize="sm">Genres</Text>
                <Text color="#E0DEF4" fontSize="2xl" fontWeight="bold">
                  {migrationStatus.aggregatedData?.genreCount || 0}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      )}
      
      <Alert status="success" bg="#31748F20" borderRadius="lg">
        <AlertIcon color="#31748F" />
        <Text color="#E0DEF4" fontSize="sm">
          You can connect additional platforms anytime from your profile settings
        </Text>
      </Alert>
      
      <Button
        size="lg"
        bg="#EB6F92"
        color="white"
        _hover={{ bg: "#D45879" }}
        onClick={handleCompleteMigration}
        w="full"
      >
        Continue to MelodyMatch
      </Button>
    </VStack>
  );

  const renderStep4 = () => (
    <VStack spacing={6} textAlign="center">
      <Icon as={FaCheckCircle} boxSize={20} color="#31748F" />
      
      <Heading size="xl" color="#EB6F92">
        Welcome Back!
      </Heading>
      
      <Text color="#E0DEF4" fontSize="lg">
        Your migration is complete. Redirecting...
      </Text>
      
      <Progress 
        size="sm" 
        isIndeterminate 
        colorScheme="pink" 
        w="full" 
        borderRadius="full"
      />
    </VStack>
  );

  const getStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const getStepProgress = () => {
    return (step / 4) * 100;
  };

  if (loading) {
    return (
      <Center minH="100vh" bg="#191724">
        <VStack spacing={4}>
          <Spinner size="xl" color="#EB6F92" thickness="4px" />
          <Text color="#908CAA">Checking migration status...</Text>
        </VStack>
      </Center>
    );
  }

  // If no userId, redirect to login
  if (!userId) {
    navigate('/belogin');
    return null;
  }

  // If no migration needed, redirect to profile immediately
  if (migrationStatus && !migrationStatus.needsMigration) {
    navigate('/profile');
    return null;
  }

  return (
    <>
      {/* Full-screen blocking modal for migration */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => {}} // Prevent closing until migration complete
        closeOnOverlayClick={false}
        closeOnEsc={false}
        size="2xl"
        isCentered
      >
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
        <ModalContent bg="#2A273F" color="#E0DEF4" maxW="900px">
          {step < 4 && (
            <ModalHeader>
              <Progress 
                value={getStepProgress()} 
                size="sm" 
                colorScheme="pink"
                borderRadius="full"
                mb={2}
              />
              <HStack justify="space-between">
                <HStack spacing={2}>
                  <Icon as={FaMusic} color="#EB6F92" />
                  <Text>MelodyMatch Migration</Text>
                </HStack>
                <Text fontSize="sm" color="#908CAA">
                  Step {step} of 3
                </Text>
              </HStack>
            </ModalHeader>
          )}
          
          <ModalBody pb={8}>
            {getStepContent()}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Inline version for settings page */}
      {!isOpen && migrationStatus?.needsMigration && (
        <Alert status="warning" mb={4} borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1} flex={1}>
            <Text fontWeight="bold">Migration Required</Text>
            <Text fontSize="sm">
              Please connect a music platform to continue using MelodyMatch
            </Text>
          </VStack>
          <Button
            size="sm"
            bg="#EB6F92"
            color="white"
            _hover={{ bg: "#D45879" }}
            onClick={onOpen}
          >
            Start Migration
          </Button>
        </Alert>
      )}
    </>
  );
};

export default MigrationWizard;
