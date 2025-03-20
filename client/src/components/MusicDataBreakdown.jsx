import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Divider,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  SimpleGrid,
  IconButton,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaApple, FaYoutube, FaMusic, FaSyncAlt } from 'react-icons/fa';
import LoadingState from './LoadingState';
import { ClayCard, NeonBadge } from './ui';

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const ARTISTS_PAGE_SIZE = 30; // Artists shown per page before "Show more"

// Spin animation for refresh button
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const platformIcons = {
  apple_music: FaApple,
  youtube_music: FaYoutube,
};

const platformNames = {
  apple_music: 'Apple Music',
  youtube_music: 'YouTube Music',
};

const platformColors = {
  apple_music: '#FC3C44',
  youtube_music: '#FF0000',
};

const MusicDataBreakdown = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Per-platform artist page count: { apple_music: 1, youtube_music: 1, ... }
  const [artistPages, setArtistPages] = useState({});

  const showMoreArtists = useCallback((platform) => {
    setArtistPages(prev => ({ ...prev, [platform]: (prev[platform] || 1) + 1 }));
  }, []);

  const fetchUserData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch(`${API_URL}/getUserById/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [userId, fetchUserData]);

  const handleRefresh = () => {
    fetchUserData(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!userData || !userData.platformData) {
    return (
      <ClayCard variant="flat" p={8} textAlign="center">
        <Icon as={FaMusic} boxSize={12} color="text.muted" mb={4} />
        <Text color="text.muted" fontFamily="body">
          No music data available. Connect a platform to get started.
        </Text>
      </ClayCard>
    );
  }

  const platforms = Object.keys(userData.platformData);
  
  if (platforms.length === 0) {
    return (
      <ClayCard variant="flat" p={8} textAlign="center">
        <Icon as={FaMusic} boxSize={12} color="text.muted" mb={4} />
        <Text color="text.muted" fontFamily="body">
          No music data available. Connect a platform to get started.
        </Text>
      </ClayCard>
    );
  }

  return (
    <Box w="full">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading 
              fontFamily="heading"
              fontSize={{ base: "2xl", md: "3xl" }}
              bgGradient="linear(to-r, accent.pink, accent.cyan)"
              bgClip="text"
              mb={2}
            >
              Your Music Data
            </Heading>
            <Text color="text.muted" fontSize="sm" fontFamily="body">
              View your imported artists and genres from each connected platform
            </Text>
          </Box>
          <Tooltip 
            label="Refresh data" 
            placement="left"
            bg="clay.medium"
            color="text.primary"
            fontFamily="body"
          >
            <IconButton
              icon={<FaSyncAlt />}
              onClick={handleRefresh}
              isLoading={refreshing}
              variant="ghost"
              color="accent.pink"
              bg="clay.medium"
              borderRadius="xl"
              _hover={{ 
                bg: 'clay.light',
                transform: 'scale(1.05)',
              }}
              _active={{
                transform: 'scale(0.95)',
              }}
              transition="background-color 0.2s ease, transform 0.15s ease"
              aria-label="Refresh music data"
              sx={{
                '&[data-loading]': {
                  animation: `${spin} 1s linear infinite`,
                }
              }}
            />
          </Tooltip>
        </Flex>

        {/* Platform Accordions */}
        <Accordion allowMultiple defaultIndex={[0]}>
          {platforms.map((platform) => {
            const platformData = userData.platformData[platform];
            const artists = platformData.artists || [];
            const genres = platformData.genres || [];
            const isPrimary = userData.primaryPlatform === platform;

            return (
              <AccordionItem
                key={platform}
                border="none"
                mb={4}
              >
                <ClayCard variant="elevated" overflow="hidden">
                  <AccordionButton
                    _hover={{ bg: 'clay.light' }}
                    borderRadius="xl"
                    p={5}
                    transition="background-color 0.2s ease"
                  >
                    <Flex flex="1" align="center" justify="space-between">
                      <HStack spacing={4}>
                        {/* Platform Icon */}
                        <Box
                          w={12}
                          h={12}
                          borderRadius="xl"
                          bg="linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)"
                          boxShadow="inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(255,255,255,0.05)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon
                            as={platformIcons[platform] || FaMusic}
                            boxSize={6}
                            color={platformColors[platform] || 'accent.pink'}
                          />
                        </Box>
                        
                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            <Text color="text.primary" fontWeight="bold" fontFamily="heading">
                              {platformNames[platform] || platform}
                            </Text>
                            {isPrimary && (
                              <NeonBadge variant="pink" size="sm">Primary</NeonBadge>
                            )}
                          </HStack>
                          <HStack spacing={4} fontSize="sm" color="text.muted" fontFamily="body">
                            <HStack spacing={1}>
                              <Text color="accent.pink" fontWeight="bold">{artists.length}</Text>
                              <Text>artists</Text>
                            </HStack>
                            <Text color="clay.border">|</Text>
                            <HStack spacing={1}>
                              <Text color="accent.cyan" fontWeight="bold">{genres.length}</Text>
                              <Text>genres</Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </HStack>
                      <AccordionIcon color="text.muted" />
                    </Flex>
                  </AccordionButton>

                  <AccordionPanel pb={5} pt={2} px={5}>
                    <VStack spacing={5} align="stretch">
                      {/* Artists Section */}
                      <Box>
                        <Flex
                          align="center"
                          justify="space-between"
                          mb={4}
                          pb={2}
                          borderBottom="1px solid"
                          borderColor="clay.border"
                        >
                          <Heading 
                            size="sm" 
                            fontFamily="heading"
                            color="accent.cyan"
                          >
                            Artists ({artists.length})
                          </Heading>
                        </Flex>
                        
                        {artists.length === 0 ? (
                          <Text color="text.muted" fontSize="sm" fontStyle="italic" fontFamily="body">
                            No artists found
                          </Text>
                        ) : (() => {
                          const pages = artistPages[platform] || 1;
                          const visibleArtists = artists.slice(0, pages * ARTISTS_PAGE_SIZE);
                          const remaining = artists.length - visibleArtists.length;
                          return (
                            <VStack align="stretch" spacing={3}>
                              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
                                {visibleArtists.map((artist, idx) => (
                                  <Box
                                    key={idx}
                                    p={3}
                                    bg="clay.medium"
                                    borderRadius="lg"
                                    borderWidth="1px"
                                    borderColor="transparent"
                                    _hover={{ 
                                      bg: 'clay.light',
                                      borderColor: 'kawaii.pink',
                                      transform: 'translateY(-2px)',
                                    }}
                                    transition="background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease"
                                    cursor="default"
                                  >
                                    <Text 
                                      color="text.primary" 
                                      fontSize="sm" 
                                      noOfLines={1}
                                      fontFamily="body"
                                    >
                                      {artist}
                                    </Text>
                                  </Box>
                                ))}
                              </SimpleGrid>
                              {remaining > 0 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  color="text.muted"
                                  fontFamily="body"
                                  onClick={() => showMoreArtists(platform)}
                                  alignSelf="center"
                                  _hover={{ color: 'kawaii.pink' }}
                                >
                                  Show {remaining > ARTISTS_PAGE_SIZE ? ARTISTS_PAGE_SIZE : remaining} more
                                  {remaining > ARTISTS_PAGE_SIZE ? ` (${remaining} remaining)` : ''}
                                </Button>
                              )}
                            </VStack>
                          );
                        })()}
                      </Box>

                      <Divider borderColor="clay.border" opacity={0.3} />

                      {/* Genres Section */}
                      <Box>
                        <Flex
                          align="center"
                          justify="space-between"
                          mb={4}
                          pb={2}
                          borderBottom="1px solid"
                          borderColor="clay.border"
                        >
                          <Heading 
                            size="sm" 
                            fontFamily="heading"
                            color="accent.cyan"
                          >
                            Genres ({genres.length})
                          </Heading>
                        </Flex>
                        
                        {genres.length === 0 ? (
                          <Text color="text.muted" fontSize="sm" fontStyle="italic" fontFamily="body">
                            No genres found
                          </Text>
                        ) : (
                          <Flex flexWrap="wrap" gap={2}>
                            {genres.map((genre, idx) => (
                              <NeonBadge key={idx} variant="purple">
                                {genre}
                              </NeonBadge>
                            ))}
                          </Flex>
                        )}
                      </Box>
                    </VStack>
                  </AccordionPanel>
                </ClayCard>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Summary Section */}
        <ClayCard variant="elevated" p={6} position="relative" overflow="hidden">
          {/* Decorative gradient line */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bgGradient="linear(to-r, accent.pink, accent.cyan)"
          />
          
          <VStack spacing={4}>
            <Heading 
              size="md" 
              fontFamily="heading"
              bgGradient="linear(to-r, accent.pink, accent.cyan)"
              bgClip="text"
            >
              Combined Total
            </Heading>
            
            <HStack spacing={12}>
              {/* Artists Count */}
              <VStack spacing={1}>
                <Text 
                  fontFamily="heading"
                  fontSize="4xl" 
                  fontWeight="bold"
                  bgGradient="linear(to-r, accent.pink, #ff8ec4)"
                  bgClip="text"
                  lineHeight={1}
                >
                  {userData.aggregatedArtists?.length || 0}
                </Text>
                <Text color="text.muted" fontSize="sm" fontFamily="body">
                  Artists
                </Text>
              </VStack>
              
              {/* Divider */}
              <Box
                w="1px"
                h="60px"
                bgGradient="linear(to-b, transparent, clay.border, transparent)"
              />
              
              {/* Genres Count */}
              <VStack spacing={1}>
                <Text 
                  fontFamily="heading"
                  fontSize="4xl" 
                  fontWeight="bold"
                  bgGradient="linear(to-r, accent.cyan, #7fffff)"
                  bgClip="text"
                  lineHeight={1}
                >
                  {userData.aggregatedGenres?.length || 0}
                </Text>
                <Text color="text.muted" fontSize="sm" fontFamily="body">
                  Genres
                </Text>
              </VStack>
            </HStack>
            
            <Text 
              color="text.muted" 
              fontSize="xs" 
              textAlign="center"
              fontFamily="body"
              maxW="300px"
            >
              Deduplicated and combined from all connected platforms
            </Text>
          </VStack>
        </ClayCard>
      </VStack>
    </Box>
  );
};

export default MusicDataBreakdown;
