// MatchesList - Your matches with Kawaii Cute design
import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Center,
  IconButton,
  Icon,
  Wrap,
  WrapItem,
  HStack,
  Avatar,
  Spinner,
  Circle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiMusic,
  FiUser,
  FiMapPin,
  FiMessageCircle,
  FiStar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { 
  ClayCard, 
  ClayCardBody, 
  ClayButton, 
  CyanButton,
  OutlineButton,
  CyanBadge,
  PinkBadge,
  FloatingShapes 
} from "./ui";

const MotionBox = motion(Box);

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [noMatches, setNoMatches] = useState(false);
  const navigate = useNavigate();

  const handlePrevClick = (index) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((val, i) => (i === index ? Math.max(0, val - 5) : val))
    );
  };
  
  const handleNextClick = (index) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((val, i) => (i === index ? val + 5 : val))
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const storedData = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(storedData);
    const userId = userInfo._id;
  
    const preloadImages = (users) => {
      users.forEach((user) => {
        if (user.profile_pic) {
          const img = new Image();
          img.src = user.profile_pic;
        }
        if (user.pictures && Array.isArray(user.pictures)) {
          user.pictures.forEach((picUrl) => {
            const img = new Image();
            img.src = picUrl;
          });
        }
        if (user.pic) {
          const img = new Image();
          img.src = user.pic;
        }
      });
    };

    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/getmatches/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        
        const matchesData = data.matches || [];
        
        if (matchesData.length > 0) {
          preloadImages(matchesData);
        }
        
        setMatches(matchesData);
        setNoMatches(matchesData.length === 0);
        setCurrentIndices(new Array(matchesData.length).fill(0));
      } catch (error) {
        console.error("Error fetching matches:", error);
        setMatches([]);
        setNoMatches(true);
        setCurrentIndices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <>
        <Header />
        <Flex minH="100vh" bg="surface.base" align="center" justify="center">
          <VStack spacing={4}>
            <Circle size="60px" bg="kawaii.pink">
              <Spinner size="lg" color="white.pure" thickness="3px" />
            </Circle>
            <Text fontFamily="body" color="text.muted">Loading your matches...</Text>
          </VStack>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden" py={8}>
        <FloatingShapes variant="subtle" />
        
        <Box position="relative" zIndex={1} maxW="700px" mx="auto" px={4}>
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            mb={8}
          >
            <HStack justify="center" spacing={3}>
              <Circle size="40px" bg="kawaii.lilac">
                <Icon as={FiHeart} boxSize={5} color="white.pure" />
              </Circle>
              <Heading
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="bold"
                textAlign="center"
                bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
                bgClip="text"
              >
                Your Matches
              </Heading>
            </HStack>
          </MotionBox>

          {noMatches ? (
            // No Matches State
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Center minH="60vh">
                <ClayCard>
                  <ClayCardBody py={12} px={8}>
                    <VStack spacing={6} maxW="400px">
                      {/* Icon */}
                      <Circle size="80px" bg="kawaii.pink">
                        <Icon as={FiHeart} boxSize={10} color="white.pure" />
                      </Circle>
                      
                      <VStack spacing={2}>
                        <Heading
                          fontFamily="heading"
                          fontSize="xl"
                          fontWeight="bold"
                          color="text.primary"
                          textAlign="center"
                        >
                          No Matches Yet
                        </Heading>
                        <Text fontFamily="body" color="text.muted" textAlign="center">
                          Start swiping to find people who share your music taste!
                        </Text>
                      </VStack>

                      <VStack spacing={3} w="full">
                        <ClayButton
                          w="full"
                          size="lg"
                          leftIcon={<Icon as={FiHeart} />}
                          onClick={() => navigate("/matches")}
                        >
                          Find Matches
                        </ClayButton>
                        
                        <OutlineButton
                          w="full"
                          onClick={() => navigate("/profile")}
                          leftIcon={<Icon as={FiUser} />}
                        >
                          View Profile
                        </OutlineButton>
                      </VStack>

                      {/* Tips */}
                      <Box
                        w="full"
                        p={5}
                        bg="surface.muted"
                        borderRadius="2xl"
                        border="2px solid"
                        borderColor="rgba(255, 200, 210, 0.08)"
                      >
                        <VStack align="start" spacing={3}>
                          <HStack>
                            <Circle size="24px" bg="kawaii.mint">
                              <Icon as={FiStar} boxSize={3} color="white.pure" />
                            </Circle>
                            <Text fontFamily="body" fontWeight="semibold" color="text.secondary">Tips</Text>
                          </HStack>
                          <VStack align="start" spacing={2}>
                            {[
                              "Like profiles that interest you",
                              "Connect your music platform",
                              "Complete your profile with a bio",
                              "Be active - check back often!"
                            ].map((tip, i) => (
                              <Text key={i} fontFamily="body" fontSize="sm" color="text.muted">
                                {tip}
                              </Text>
                            ))}
                          </VStack>
                        </VStack>
                      </Box>
                    </VStack>
                  </ClayCardBody>
                </ClayCard>
              </Center>
            </MotionBox>
          ) : (
            // Matches List
            <MotionBox
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <VStack spacing={4}>
                {matches.map((match, index) => (
                  <MotionBox
                    key={match._id || index}
                    variants={itemVariants}
                    w="full"
                    whileHover={{ scale: 1.01, y: -2 }}
                  >
                    <ClayCard>
                      <ClayCardBody>
                        <VStack spacing={5} align="stretch">
                          {/* Profile Header */}
                          <Flex alignItems="center" gap={4}>
                            <Avatar
                              src={match.profile_pic || match.pic}
                              name={match.preferred_name || match.name}
                              size="lg"
                              border="4px solid"
                              borderColor="kawaii.pink"
                              boxShadow="0 6px 16px rgba(0, 0, 0, 0.15)"
                            />
                            <Box flex={1}>
                              <HStack justify="space-between" align="flex-start">
                                <VStack align="flex-start" spacing={0}>
                                  <Heading
                                    fontFamily="heading"
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="text.primary"
                                  >
                                    {match.preferred_name || match.name || 'Unknown User'}, {match.age || '?'}
                                  </Heading>
                                  {match.country && (
                                    <HStack spacing={1} color="text.muted">
                                      <Icon as={FiMapPin} boxSize={3} />
                                      <Text fontFamily="body" fontSize="sm">
                                        {match.country}
                                      </Text>
                                    </HStack>
                                  )}
                                </VStack>
                                <Circle size="28px" bg="kawaii.lilac">
                                  <Icon as={FiHeart} boxSize={3} color="white.pure" />
                                </Circle>
                              </HStack>
                            </Box>
                          </Flex>

                          {/* Bio */}
                          {match.bio && (
                            <Box 
                              p={4} 
                              bg="surface.muted" 
                              borderRadius="2xl"
                              border="2px solid"
                              borderColor="rgba(255, 200, 210, 0.08)"
                            >
                              <Text fontFamily="body" fontSize="sm" color="text.secondary" fontStyle="italic">
                                &ldquo;{match.bio}&rdquo;
                              </Text>
                            </Box>
                          )}

                          {/* Genres */}
                          <Box>
                            <HStack mb={3}>
                              <Circle size="28px" bg="kawaii.mint">
                                <Icon as={FiMusic} color="white.pure" boxSize={3} />
                              </Circle>
                              <Text 
                                fontFamily="body"
                                fontSize="sm"
                                fontWeight="semibold"
                                color="text.secondary"
                              >
                                Music Taste
                              </Text>
                            </HStack>
                            <Wrap spacing={2}>
                              {(() => {
                                const userGenres = match.aggregatedGenres || match.genres || [];
                                const currentIndex = currentIndices[index] || 0;
                                
                                return Array.isArray(userGenres) && userGenres.length > 0
                                  ? userGenres
                                      .slice(currentIndex, currentIndex + 5)
                                      .map((genre, genreIndex) => (
                                        <WrapItem key={genreIndex}>
                                          <Box
                                            px={4}
                                            py={1.5}
                                            bg="rgba(181, 234, 221, 0.15)"
                                            border="2px solid"
                                            borderColor="rgba(181, 234, 221, 0.4)"
                                            borderRadius="full"
                                          >
                                            <Text 
                                              fontFamily="body"
                                              fontSize="xs"
                                              fontWeight="semibold"
                                              color="kawaii.mint"
                                              textTransform="capitalize"
                                            >
                                              {genre}
                                            </Text>
                                          </Box>
                                        </WrapItem>
                                      ))
                                  : <Text fontFamily="body" color="text.muted" fontSize="sm">No genres listed</Text>;
                              })()}
                            </Wrap>

                            {/* Genre Navigation */}
                            {(() => {
                              const userGenres = match.aggregatedGenres || match.genres || [];
                              const currentIndex = currentIndices[index] || 0;
                              
                              return userGenres.length > 5 && (
                                <Flex mt="3" justifyContent="center" gap={2}>
                                  <IconButton
                                    aria-label="Previous genres"
                                    icon={<FiChevronLeft />}
                                    onClick={() => handlePrevClick(index)}
                                    isDisabled={currentIndex === 0}
                                    size="sm"
                                    bg="surface.elevated"
                                    color="text.primary"
                                    borderRadius="full"
                                    _hover={{ bg: "surface.card", transform: "scale(1.05)" }}
                                    _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                                    transition="all 0.2s"
                                  />
                                  <Text fontFamily="body" fontSize="xs" color="text.muted" alignSelf="center">
                                    {Math.floor(currentIndex / 5) + 1} / {Math.ceil(userGenres.length / 5)}
                                  </Text>
                                  <IconButton
                                    aria-label="Next genres"
                                    icon={<FiChevronRight />}
                                    onClick={() => handleNextClick(index)}
                                    isDisabled={currentIndex + 5 >= userGenres.length}
                                    size="sm"
                                    bg="surface.elevated"
                                    color="text.primary"
                                    borderRadius="full"
                                    _hover={{ bg: "surface.card", transform: "scale(1.05)" }}
                                    _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                                    transition="all 0.2s"
                                  />
                                </Flex>
                              );
                            })()}
                          </Box>

                          {/* Message Button */}
                          <CyanButton
                            w="full"
                            leftIcon={<Icon as={FiMessageCircle} />}
                            onClick={() => navigate("/messaging")}
                          >
                            Send Message
                          </CyanButton>
                        </VStack>
                      </ClayCardBody>
                    </ClayCard>
                  </MotionBox>
                ))}
              </VStack>
            </MotionBox>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MatchesList;
