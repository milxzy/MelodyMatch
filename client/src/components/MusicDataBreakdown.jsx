import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Divider,
  Icon,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  SimpleGrid,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FaApple, FaYoutube, FaMusic, FaSyncAlt } from 'react-icons/fa';
import LoadingState from './LoadingState';

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const platformIcons = {
  apple_music: FaApple,
  youtube_music: FaYoutube,
};

const platformNames = {
  apple_music: 'Apple Music',
  youtube_music: 'YouTube Music',
};

const MusicDataBreakdown = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async (isRefresh = false) => {
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
  };

  const handleRefresh = () => {
    fetchUserData(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!userData || !userData.platformData) {
    return (
      <Box p={6} textAlign="center">
        <Text color="#908CAA">No music data available. Connect a platform to get started.</Text>
      </Box>
    );
  }

  const platforms = Object.keys(userData.platformData);
  
  if (platforms.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Text color="#908CAA">No music data available. Connect a platform to get started.</Text>
      </Box>
    );
  }

  return (
    <Box w="full">
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" color="#EB6F92" mb={2}>
              Your Music Data
            </Heading>
            <Text color="#908CAA" fontSize="sm">
              View your imported artists and genres from each connected platform
            </Text>
          </Box>
          <Tooltip label="Refresh data" placement="left">
            <IconButton
              icon={<FaSyncAlt />}
              onClick={handleRefresh}
              isLoading={refreshing}
              variant="ghost"
              color="#EB6F92"
              _hover={{ bg: "#393552" }}
              aria-label="Refresh music data"
            />
          </Tooltip>
        </Flex>

        <Accordion allowMultiple defaultIndex={[0]}>
          {platforms.map((platform) => {
            const platformData = userData.platformData[platform];
            const artists = platformData.artists || [];
            const genres = platformData.genres || [];
            const isPrimary = userData.primaryPlatform === platform;

            return (
              <AccordionItem
                key={platform}
                border="1px solid"
                borderColor="#6E6A86"
                borderRadius="lg"
                mb={4}
                bg="#232136"
              >
                <AccordionButton
                  _hover={{ bg: "#393552" }}
                  borderRadius="lg"
                  p={4}
                >
                  <Flex flex="1" align="center" justify="space-between">
                    <HStack spacing={3}>
                      <Icon
                        as={platformIcons[platform] || FaMusic}
                        boxSize={6}
                        color="#EB6F92"
                      />
                      <VStack align="start" spacing={0}>
                        <HStack>
                          <Text color="#E0DEF4" fontWeight="bold">
                            {platformNames[platform] || platform}
                          </Text>
                          {isPrimary && (
                            <Badge colorScheme="pink" fontSize="xs">
                              Primary
                            </Badge>
                          )}
                        </HStack>
                        <HStack spacing={4} fontSize="sm" color="#908CAA">
                          <Text>{artists.length} artists</Text>
                          <Text>•</Text>
                          <Text>{genres.length} genres</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <AccordionIcon color="#908CAA" />
                  </Flex>
                </AccordionButton>

                <AccordionPanel pb={4} pt={2}>
                  <VStack spacing={4} align="stretch">
                    {/* Artists Section */}
                    <Box>
                      <Flex
                        align="center"
                        justify="space-between"
                        mb={3}
                        pb={2}
                        borderBottom="1px solid"
                        borderColor="#6E6A86"
                      >
                        <Heading size="sm" color="#9CCFD8">
                          Artists ({artists.length})
                        </Heading>
                      </Flex>
                      
                      {artists.length === 0 ? (
                        <Text color="#908CAA" fontSize="sm" fontStyle="italic">
                          No artists found
                        </Text>
                      ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
                          {artists.map((artist, idx) => (
                            <Box
                              key={idx}
                              p={2}
                              bg="#393552"
                              borderRadius="md"
                              _hover={{ bg: "#6E6A86" }}
                              transition="all 0.2s"
                            >
                              <Text color="#E0DEF4" fontSize="sm" noOfLines={1}>
                                {artist}
                              </Text>
                            </Box>
                          ))}
                        </SimpleGrid>
                      )}
                    </Box>

                    <Divider borderColor="#6E6A86" />

                    {/* Genres Section */}
                    <Box>
                      <Flex
                        align="center"
                        justify="space-between"
                        mb={3}
                        pb={2}
                        borderBottom="1px solid"
                        borderColor="#6E6A86"
                      >
                        <Heading size="sm" color="#9CCFD8">
                          Genres ({genres.length})
                        </Heading>
                      </Flex>
                      
                      {genres.length === 0 ? (
                        <Text color="#908CAA" fontSize="sm" fontStyle="italic">
                          No genres found
                        </Text>
                      ) : (
                        <Flex flexWrap="wrap" gap={2}>
                          {genres.map((genre, idx) => (
                            <Badge
                              key={idx}
                              colorScheme="purple"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="sm"
                            >
                              {genre}
                            </Badge>
                          ))}
                        </Flex>
                      )}
                    </Box>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Summary Section */}
        <Box
          p={4}
          bg="#393552"
          borderRadius="lg"
          border="1px solid"
          borderColor="#6E6A86"
        >
          <VStack spacing={3}>
            <Heading size="sm" color="#EB6F92">
              Combined Total
            </Heading>
            <HStack spacing={8}>
              <VStack>
                <Text color="#908CAA" fontSize="sm">
                  Artists
                </Text>
                <Text color="#E0DEF4" fontSize="2xl" fontWeight="bold">
                  {userData.aggregatedArtists?.length || 0}
                </Text>
              </VStack>
              <Divider orientation="vertical" h="50px" borderColor="#6E6A86" />
              <VStack>
                <Text color="#908CAA" fontSize="sm">
                  Genres
                </Text>
                <Text color="#E0DEF4" fontSize="2xl" fontWeight="bold">
                  {userData.aggregatedGenres?.length || 0}
                </Text>
              </VStack>
            </HStack>
            <Text color="#908CAA" fontSize="xs" textAlign="center">
              Deduplicated and combined from all connected platforms
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default MusicDataBreakdown;
