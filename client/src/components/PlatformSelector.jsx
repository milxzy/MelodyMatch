import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Alert,
  AlertIcon,
  useToast,
  Divider,
  Flex
} from '@chakra-ui/react';
import { FaApple, FaYoutube, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoadingState from './LoadingState';

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const PlatformSelector = ({ userId, onPlatformConnected }) => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(null);
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
      // Load MusicKit JS
      await loadMusicKit();
      
      // Configure and authorize
      const music = window.MusicKit.getInstance();
      const musicUserToken = await music.authorize();
      
      // Send token to backend
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

  const getPlatformColor = (platform) => {
    const colors = {
      apple_music: '#FC3C44',
      youtube_music: '#FF0000'
    };
    return colors[platform] || '#EB6F92';
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
        <Box textAlign="center">
          <Heading size="lg" color="#EB6F92" mb={2}>
            Connect Your Music Platforms
          </Heading>
          <Text color="#908CAA">
            Connect multiple platforms for better music matching
          </Text>
        </Box>

        {platforms.length === 0 && (
          <Alert status="info" bg="#393552" borderRadius="lg">
            <AlertIcon color="#9CCFD8" />
            <Text color="#E0DEF4">
              Connect at least one music platform to continue using MelodyMatch
            </Text>
          </Alert>
        )}

        {/* Apple Music */}
        <Box
          bg="#2A273F"
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={isConnected('apple_music') ? '#31748F' : '#6E6A86'}
        >
          <HStack justify="space-between" align="start" mb={4}>
            <HStack spacing={3}>
              <Icon
                as={FaApple}
                boxSize={8}
                color={getPlatformColor('apple_music')}
              />
              <VStack align="start" spacing={0}>
                <Heading size="md" color="#E0DEF4">
                  Apple Music
                </Heading>
                {isConnected('apple_music') && (
                  <HStack spacing={2}>
                    <Badge colorScheme="green" fontSize="xs">
                      Connected
                    </Badge>
                    {getPlatformData('apple_music')?.isPrimary && (
                      <Badge colorScheme="purple" fontSize="xs">
                        Primary
                      </Badge>
                    )}
                  </HStack>
                )}
              </VStack>
            </HStack>
          </HStack>

          {isConnected('apple_music') ? (
            <>
              <VStack align="start" spacing={2} mb={4}>
                <Text color="#908CAA" fontSize="sm">
                  Last synced: {formatDate(getPlatformData('apple_music')?.lastSyncedAt)}
                </Text>
                <HStack spacing={4}>
                  <Text color="#908CAA" fontSize="sm">
                    {getPlatformData('apple_music')?.artistCount || 0} artists
                  </Text>
                  <Text color="#908CAA" fontSize="sm">
                    {getPlatformData('apple_music')?.genreCount || 0} genres
                  </Text>
                </HStack>
                {getPlatformData('apple_music')?.needsReauth && (
                  <HStack spacing={2}>
                    <Icon as={FaExclamationCircle} color="#F6C177" />
                    <Text color="#F6C177" fontSize="sm">
                      Token expired - please reconnect
                    </Text>
                  </HStack>
                )}
              </VStack>

              <HStack spacing={3}>
                <Button
                  size="sm"
                  bg="#393552"
                  color="#E0DEF4"
                  _hover={{ bg: "#6E6A86" }}
                  onClick={() => handleSync('apple_music')}
                  isLoading={syncing === 'apple_music'}
                  loadingText="Syncing..."
                >
                  Sync Now
                </Button>
                {!getPlatformData('apple_music')?.isPrimary && (
                  <Button
                    size="sm"
                    bg="#31748F"
                    color="white"
                    _hover={{ bg: "#286983" }}
                    onClick={() => handleSetPrimary('apple_music')}
                  >
                    Set as Primary
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  color="#EB6F92"
                  _hover={{ bg: "#393552" }}
                  onClick={() => handleDisconnect('apple_music')}
                >
                  Disconnect
                </Button>
              </HStack>
            </>
          ) : (
            <>
              <Text color="#908CAA" mb={4} fontSize="sm">
                Official Apple Music API with full library access
              </Text>
              <Button
                bg={getPlatformColor('apple_music')}
                color="white"
                _hover={{ opacity: 0.9 }}
                onClick={handleConnectAppleMusic}
                leftIcon={<Icon as={FaApple} />}
              >
                Connect Apple Music
              </Button>
            </>
          )}
        </Box>

        {/* YouTube Music */}
        <Box
          bg="#2A273F"
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={isConnected('youtube_music') ? '#31748F' : '#6E6A86'}
        >
          <HStack justify="space-between" align="start" mb={4}>
            <HStack spacing={3}>
              <Icon
                as={FaYoutube}
                boxSize={8}
                color={getPlatformColor('youtube_music')}
              />
              <VStack align="start" spacing={0}>
                <Heading size="md" color="#E0DEF4">
                  YouTube Music
                </Heading>
                {isConnected('youtube_music') && (
                  <HStack spacing={2}>
                    <Badge colorScheme="green" fontSize="xs">
                      Connected
                    </Badge>
                    {getPlatformData('youtube_music')?.isPrimary && (
                      <Badge colorScheme="purple" fontSize="xs">
                        Primary
                      </Badge>
                    )}
                  </HStack>
                )}
              </VStack>
            </HStack>
          </HStack>

          {isConnected('youtube_music') ? (
            <>
              <VStack align="start" spacing={2} mb={4}>
                <Text color="#908CAA" fontSize="sm">
                  Last synced: {formatDate(getPlatformData('youtube_music')?.lastSyncedAt)}
                </Text>
                <HStack spacing={4}>
                  <Text color="#908CAA" fontSize="sm">
                    {getPlatformData('youtube_music')?.artistCount || 0} artists
                  </Text>
                  <Text color="#908CAA" fontSize="sm">
                    {getPlatformData('youtube_music')?.genreCount || 0} genres
                  </Text>
                </HStack>
              </VStack>

              <HStack spacing={3}>
                <Button
                  size="sm"
                  bg="#393552"
                  color="#E0DEF4"
                  _hover={{ bg: "#6E6A86" }}
                  onClick={() => handleSync('youtube_music')}
                  isLoading={syncing === 'youtube_music'}
                  loadingText="Syncing..."
                >
                  Sync Now
                </Button>
                {!getPlatformData('youtube_music')?.isPrimary && (
                  <Button
                    size="sm"
                    bg="#31748F"
                    color="white"
                    _hover={{ bg: "#286983" }}
                    onClick={() => handleSetPrimary('youtube_music')}
                  >
                    Set as Primary
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  color="#EB6F92"
                  _hover={{ bg: "#393552" }}
                  onClick={() => handleDisconnect('youtube_music')}
                >
                  Disconnect
                </Button>
              </HStack>
            </>
          ) : (
            <>
              <Text color="#908CAA" mb={4} fontSize="sm">
                Access your YouTube Music library and listening history
              </Text>
              <Button
                bg={getPlatformColor('youtube_music')}
                color="white"
                _hover={{ opacity: 0.9 }}
                onClick={handleConnectYouTubeMusic}
                leftIcon={<Icon as={FaYoutube} />}
              >
                Connect YouTube Music
              </Button>
            </>
          )}
        </Box>

        {platforms.length > 0 && (
          <>
            <Divider borderColor="#6E6A86" />
            <Alert status="success" bg="#393552" borderRadius="lg">
              <AlertIcon color="#31748F" />
              <Text color="#E0DEF4">
                You can connect both platforms for more accurate matching!
              </Text>
            </Alert>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default PlatformSelector;
