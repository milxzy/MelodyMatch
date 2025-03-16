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
  Button
} from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

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
      <Center bg="#232136" minHeight="100vh" p={4}>
        <VStack spacing={6} maxW="500px">
          <Icon as={FaExclamationTriangle} boxSize={20} color="#EB6F92" />
          
          <Heading size="xl" color="#EB6F92" textAlign="center">
            Connection Failed
          </Heading>
          
          <Alert status="error" bg="#393552" borderRadius="lg">
            <AlertIcon />
            <Text color="#E0DEF4">
              {error === 'sync_failed' 
                ? 'Platform connected, but data sync failed. You can retry from your profile.'
                : 'Failed to connect your music platform. Please try again.'}
            </Text>
          </Alert>
          
          <Button
            bg="#EB6F92"
            color="white"
            _hover={{ bg: "#D45879" }}
            onClick={() => navigate('/profile')}
            size="lg"
          >
            Go to Profile
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Center bg="#232136" minHeight="100vh" p={4}>
      <VStack spacing={6} maxW="500px">
        <Icon as={FaCheckCircle} boxSize={20} color="#31748F" />
        
        <Heading size="xl" color="#EB6F92" textAlign="center">
          Successfully Connected!
        </Heading>
        
        <Text color="#E0DEF4" fontSize="lg" textAlign="center">
          {getPlatformName()} has been connected to your account
        </Text>

        {warning === 'sync_failed' && (
          <Alert status="warning" bg="#393552" borderRadius="lg">
            <AlertIcon />
            <Text color="#E0DEF4" fontSize="sm">
              Platform connected, but initial data sync encountered issues. 
              You can manually sync from your profile settings.
            </Text>
          </Alert>
        )}
        
        <Box textAlign="center">
          <Spinner size="sm" color="#EB6F92" mr={2} />
          <Text color="#908CAA" display="inline">
            Redirecting in {countdown} seconds...
          </Text>
        </Box>
        
        <Button
          variant="ghost"
          color="#EB6F92"
          _hover={{ bg: "#393552" }}
          onClick={() => navigate('/profile')}
        >
          Go to Profile Now
        </Button>
      </VStack>
    </Center>
  );
};

export default ConnectSuccess;
