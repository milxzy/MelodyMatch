import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  useToast,
  Divider,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Progress,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaApple, FaYoutube, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoadingState from './LoadingState';
import { ClayCard, ClayButton, NeonBadge } from './ui';

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

// Pulse animation for connecting state
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// Spin animation for loading icon
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const PlatformSelector = ({ userId, onPlatformConnected }) => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState({
    step: 1,
    total: 4,
    message: 'Initializing...',
    details: []
  });
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnectedPlatforms();
  }, [userId]);

  const fetchConnectedPlatforms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/platforms/connected?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch connected platforms');
      }

      const data = await response.json();
      setPlatforms(data.platforms || []);
    } catch (error) {
      console.error('Error fetching platforms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load connected platforms',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAppleMusic = async () => {
    try {
      setIsConnecting(true);
      setConnectionProgress({
        step: 1,
        total: 4,
        message: 'Authorizing with Apple Music...',
        details: ['Requesting permission to access your library']
      });
      
      // Load MusicKit JS
      await loadMusicKit();
      
      setConnectionProgress({
        step: 2,
        total: 4,
        message: 'Connecting to Apple Music...',
        details: ['Requesting permission to access your library', 'Authorization successful']
      });
      
      // Configure and authorize
      const music = window.MusicKit.getInstance();
      const musicUserToken = await music.authorize();
      
      setConnectionProgress({
        step: 3,
        total: 4,
        message: 'Importing your music library...',
        details: [
          'Requesting permission to access your library', 
          'Authorization successful',
          'Fetching your songs and albums...'
        ]
      });
      
      // Send token to backend (this triggers the artist/genre fetching)
      const response = await fetch(`${API_URL}/auth/apple-music/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          musicUserToken,
          userId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to connect Apple Music');
      }

      const data = await response.json();
      
      setConnectionProgress({
        step: 4,
        total: 4,
        message: 'Finalizing...',
        details: [
          'Requesting permission to access your library', 
          'Authorization successful',
          'Fetching your songs and albums...',
          `Imported ${data.data.artistCount} artists and ${data.data.genreCount} genres`
        ]
      });
      
      // Brief delay to show completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success!',
        description: `Connected Apple Music with ${data.data.artistCount} artists`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      await fetchConnectedPlatforms();
      onPlatformConnected?.('apple_music');
      
    } catch (error) {
      console.error('Apple Music connection error:', error);
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect Apple Music',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const loadMusicKit = () => {
    return new Promise((resolve, reject) => {
      // Check if MusicKit is already loaded
      if (window.MusicKit) {
        resolve();
        return;
      }

      // Load MusicKit script
      const script = document.createElement('script');
      script.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js';
      script.async = true;
      
      script.onload = async () => {
        try {
          // Fetch developer token from backend
          const response = await fetch(`${API_URL}/auth/apple-music/token`);
          const { developerToken } = await response.json();
          
          // Configure MusicKit
          await window.MusicKit.configure({
            developerToken,
            app: {
              name: 'MelodyMatch',
              build: '1.0.0'
            }
          });
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Apple MusicKit'));
      };
      
      document.head.appendChild(script);
    });
  };

  const handleConnectYouTubeMusic = () => {
    // Redirect to YouTube Music OAuth flow
    window.location.href = `${API_URL}/auth/youtube-music/login?userId=${userId}`;
  };

  const handleDisconnect = async (platform) => {
    if (!confirm(`Are you sure you want to disconnect ${formatPlatformName(platform)}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/platforms/${platform}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect platform');
      }

      toast({
        title: 'Disconnected',
        description: `${formatPlatformName(platform)} has been disconnected`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      await fetchConnectedPlatforms();
      
    } catch (error) {
      console.error('Disconnect error:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect platform',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSync = async (platform) => {
    try {
      setSyncing(platform);
      
      const response = await fetch(`${API_URL}/auth/platforms/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, platform }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sync platform');
      }

      const data = await response.json();
      
      toast({
        title: 'Synced!',
        description: `Updated ${data.results[0]?.artistCount || 0} artists`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      await fetchConnectedPlatforms();
      
      // Notify parent component that data has been updated
      onPlatformConnected?.(platform);
      
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync platform data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSyncing(null);
    }
  };

  const handleSetPrimary = async (platform) => {
    try {
      console.log('Setting primary platform:', platform);
      console.log('Current userId:', userId);
      console.log('Current platforms:', platforms);
      
      const response = await fetch(`${API_URL}/auth/platforms/set-primary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, platform }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Set primary error response:', error);
        throw new Error(error.message || error.error || 'Failed to set primary platform');
      }

      toast({
        title: 'Updated',
        description: `${formatPlatformName(platform)} is now your primary platform`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      await fetchConnectedPlatforms();
      
    } catch (error) {
      console.error('Set primary error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to set primary platform',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatPlatformName = (platform) => {
    const names = {
      apple_music: 'Apple Music',
      youtube_music: 'YouTube Music',
      spotify: 'Spotify'
    };
    return names[platform] || platform;
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      apple_music: FaApple,
      youtube_music: FaYoutube
    };
    return icons[platform] || FaCheckCircle;
  };

  const isConnected = (platformName) => {
    return platforms.some(p => p.platform === platformName);
  };

  const getPlatformData = (platformName) => {
    return platforms.find(p => p.platform === platformName);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="300px">
        <LoadingState 
          variant="spinner" 
          message="Loading platforms..." 
          size="large"
        />
      </Flex>
    );
  }

  return (
    <Box w="full" maxW="800px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading 
            fontFamily="heading" 
            fontSize={{ base: "2xl", md: "3xl" }}
            bgGradient="linear(to-r, accent.pink, accent.cyan)"
            bgClip="text"
            mb={2}
          >
            Connect Your Music
          </Heading>
          <Text color="text.muted" fontFamily="body">
            Connect multiple platforms for better music matching
          </Text>
        </Box>

        {/* No platforms alert */}
        {platforms.length === 0 && (
          <ClayCard variant="elevated" p={4}>
            <HStack spacing={3}>
              <Box
                w={10}
                h={10}
                borderRadius="full"
                bg="rgba(0, 255, 255, 0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaExclamationCircle} color="accent.cyan" boxSize={5} />
              </Box>
              <Text color="text.primary">
                Connect at least one music platform to continue using MelodyMatch
              </Text>
            </HStack>
          </ClayCard>
        )}

        {/* Apple Music Card */}
        <ClayCard
          variant="elevated"
          p={6}
          position="relative"
          overflow="hidden"
          borderColor={isConnected('apple_music') ? 'accent.cyan' : 'transparent'}
          borderWidth={isConnected('apple_music') ? '1px' : '0'}
          _before={isConnected('apple_music') ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            bgGradient: 'linear(to-r, accent.pink, accent.cyan)',
          } : {}}
        >
          {/* Platform Header */}
          <HStack justify="space-between" align="start" mb={4}>
            <HStack spacing={4}>
              <Box
                w={14}
                h={14}
                borderRadius="xl"
                bg="linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)"
                boxShadow="inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaApple} boxSize={8} color="#FC3C44" />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading fontFamily="heading" fontSize="xl" color="text.primary">
                  Apple Music
                </Heading>
                {isConnected('apple_music') && (
                  <HStack spacing={2}>
                    <NeonBadge variant="cyan">Connected</NeonBadge>
                    {getPlatformData('apple_music')?.isPrimary && (
                      <NeonBadge variant="pink">Primary</NeonBadge>
                    )}
                  </HStack>
                )}
              </VStack>
            </HStack>
          </HStack>

          {isConnected('apple_music') ? (
            <>
              {/* Connected State */}
              <VStack align="start" spacing={2} mb={5}>
                <Text color="text.muted" fontSize="sm" fontFamily="body">
                  Last synced: {formatDate(getPlatformData('apple_music')?.lastSyncedAt)}
                </Text>
                <HStack spacing={6}>
                  <HStack spacing={2}>
                    <Text color="accent.pink" fontWeight="bold" fontSize="lg">
                      {getPlatformData('apple_music')?.artistCount || 0}
                    </Text>
                    <Text color="text.muted" fontSize="sm">artists</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Text color="accent.cyan" fontWeight="bold" fontSize="lg">
                      {getPlatformData('apple_music')?.genreCount || 0}
                    </Text>
                    <Text color="text.muted" fontSize="sm">genres</Text>
                  </HStack>
                </HStack>
                {getPlatformData('apple_music')?.needsReauth && (
                  <HStack 
                    spacing={2} 
                    p={2} 
                    borderRadius="md" 
                    bg="rgba(255, 105, 180, 0.1)"
                  >
                    <Icon as={FaExclamationCircle} color="accent.pink" />
                    <Text color="accent.pink" fontSize="sm">
                      Token expired - please reconnect
                    </Text>
                  </HStack>
                )}
              </VStack>

              {/* Action Buttons */}
              <HStack spacing={3} flexWrap="wrap">
                <ClayButton
                  size="sm"
                  variant="secondary"
                  onClick={() => handleSync('apple_music')}
                  isLoading={syncing === 'apple_music'}
                >
                  Sync Now
                </ClayButton>
                {!getPlatformData('apple_music')?.isPrimary && (
                  <ClayButton
                    size="sm"
                    variant="primary"
                    onClick={() => handleSetPrimary('apple_music')}
                  >
                    Set as Primary
                  </ClayButton>
                )}
                <ClayButton
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDisconnect('apple_music')}
                  color="accent.pink"
                >
                  Disconnect
                </ClayButton>
              </HStack>
            </>
          ) : (
            <>
              {/* Not Connected State */}
              <Text color="text.muted" mb={4} fontSize="sm" fontFamily="body">
                Official Apple Music API with full library access
              </Text>
              <ClayButton
                variant="primary"
                onClick={handleConnectAppleMusic}
                leftIcon={<Icon as={FaApple} />}
              >
                Connect Apple Music
              </ClayButton>
            </>
          )}
        </ClayCard>

        {/* YouTube Music Card */}
        <ClayCard
          variant="elevated"
          p={6}
          position="relative"
          overflow="hidden"
          borderColor={isConnected('youtube_music') ? 'accent.cyan' : 'transparent'}
          borderWidth={isConnected('youtube_music') ? '1px' : '0'}
          _before={isConnected('youtube_music') ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            bgGradient: 'linear(to-r, accent.pink, accent.cyan)',
          } : {}}
        >
          {/* Platform Header */}
          <HStack justify="space-between" align="start" mb={4}>
            <HStack spacing={4}>
              <Box
                w={14}
                h={14}
                borderRadius="xl"
                bg="linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)"
                boxShadow="inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaYoutube} boxSize={8} color="#FF0000" />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading fontFamily="heading" fontSize="xl" color="text.primary">
                  YouTube Music
                </Heading>
                {isConnected('youtube_music') && (
                  <HStack spacing={2}>
                    <NeonBadge variant="cyan">Connected</NeonBadge>
                    {getPlatformData('youtube_music')?.isPrimary && (
                      <NeonBadge variant="pink">Primary</NeonBadge>
                    )}
                  </HStack>
                )}
              </VStack>
            </HStack>
          </HStack>

          {isConnected('youtube_music') ? (
            <>
              {/* Connected State */}
              <VStack align="start" spacing={2} mb={5}>
                <Text color="text.muted" fontSize="sm" fontFamily="body">
                  Last synced: {formatDate(getPlatformData('youtube_music')?.lastSyncedAt)}
                </Text>
                <HStack spacing={6}>
                  <HStack spacing={2}>
                    <Text color="accent.pink" fontWeight="bold" fontSize="lg">
                      {getPlatformData('youtube_music')?.artistCount || 0}
                    </Text>
                    <Text color="text.muted" fontSize="sm">artists</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Text color="accent.cyan" fontWeight="bold" fontSize="lg">
                      {getPlatformData('youtube_music')?.genreCount || 0}
                    </Text>
                    <Text color="text.muted" fontSize="sm">genres</Text>
                  </HStack>
                </HStack>
              </VStack>

              {/* Action Buttons */}
              <HStack spacing={3} flexWrap="wrap">
                <ClayButton
                  size="sm"
                  variant="secondary"
                  onClick={() => handleSync('youtube_music')}
                  isLoading={syncing === 'youtube_music'}
                >
                  Sync Now
                </ClayButton>
                {!getPlatformData('youtube_music')?.isPrimary && (
                  <ClayButton
                    size="sm"
                    variant="primary"
                    onClick={() => handleSetPrimary('youtube_music')}
                  >
                    Set as Primary
                  </ClayButton>
                )}
                <ClayButton
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDisconnect('youtube_music')}
                  color="accent.pink"
                >
                  Disconnect
                </ClayButton>
              </HStack>
            </>
          ) : (
            <>
              {/* Coming Soon State */}
              <Text color="text.muted" mb={4} fontSize="sm" fontFamily="body">
                YouTube Music integration coming soon! We're working on bringing full support for your YouTube Music library.
              </Text>
              <ClayButton
                variant="secondary"
                isDisabled={true}
                leftIcon={<Icon as={FaYoutube} />}
                opacity={0.5}
              >
                Coming Soon
              </ClayButton>
            </>
          )}
        </ClayCard>

        {/* Multi-platform info */}
        {platforms.length > 0 && (
          <>
            <Divider borderColor="clay.border" opacity={0.3} />
            <ClayCard variant="flat" p={4}>
              <HStack spacing={3}>
                <Box
                  w={10}
                  h={10}
                  borderRadius="full"
                  bg="rgba(0, 255, 255, 0.2)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaCheckCircle} color="accent.cyan" boxSize={5} />
                </Box>
                <Text color="text.primary">
                  You can connect both platforms for more accurate matching!
                </Text>
              </HStack>
            </ClayCard>
          </>
        )}
      </VStack>

      {/* Connection Progress Modal */}
      <Modal 
        isOpen={isConnecting} 
        onClose={() => {}} 
        closeOnOverlayClick={false}
        closeOnEsc={false}
        isCentered
      >
        <ModalOverlay 
          bg="rgba(15, 15, 26, 0.9)"
          backdropFilter="blur(10px)"
        />
        <ModalContent
          bg="clay.dark"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor="clay.border"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.3)"
          mx={4}
        >
          <ModalHeader 
            fontFamily="heading"
            bgGradient="linear(to-r, accent.pink, accent.cyan)"
            bgClip="text"
            pb={2}
          >
            Connecting to Apple Music
          </ModalHeader>
          <ModalBody pb={6}>
            <VStack spacing={5} align="stretch">
              {/* Progress Section */}
              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text 
                    color="text.primary" 
                    fontSize="sm" 
                    fontWeight="medium"
                    fontFamily="body"
                    animation={`${pulse} 2s ease-in-out infinite`}
                  >
                    {connectionProgress.message}
                  </Text>
                  <Text color="text.muted" fontSize="xs" fontFamily="body">
                    Step {connectionProgress.step} of {connectionProgress.total}
                  </Text>
                </HStack>
                <Box
                  h={2}
                  bg="clay.medium"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    h="100%"
                    w={`${(connectionProgress.step / connectionProgress.total) * 100}%`}
                    bgGradient="linear(to-r, accent.pink, accent.cyan)"
                    borderRadius="full"
                    transition="width 0.5s ease-out"
                    boxShadow="none"
                  />
                </Box>
              </Box>

              {/* Steps List */}
              <List spacing={3}>
                {connectionProgress.details.map((detail, index) => {
                  const isComplete = index < connectionProgress.details.length - 1 || connectionProgress.step === connectionProgress.total;
                  const isCurrent = index === connectionProgress.details.length - 1 && connectionProgress.step !== connectionProgress.total;
                  
                  return (
                    <ListItem key={index}>
                      <HStack spacing={3}>
                        <Box
                          w={6}
                          h={6}
                          borderRadius="full"
                          bg={isComplete ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 105, 180, 0.2)'}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          <Icon 
                            as={isComplete ? FaCheckCircle : FaSpinner}
                            boxSize={4}
                            color={isComplete ? 'accent.cyan' : 'accent.pink'}
                            animation={isCurrent ? `${spin} 1s linear infinite` : 'none'}
                          />
                        </Box>
                        <Text 
                          color={isComplete ? 'text.primary' : 'text.muted'} 
                          fontSize="sm"
                          fontFamily="body"
                        >
                          {detail}
                        </Text>
                      </HStack>
                    </ListItem>
                  );
                })}
              </List>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PlatformSelector;
