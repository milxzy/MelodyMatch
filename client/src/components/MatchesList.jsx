import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Image,
  Badge,
  Text,
  Flex,
  Center,
  Stack,
  IconButton,
  Button,
  Icon,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaMusic,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [_loading, setLoading] = useState(false);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [noMatches, setNoMatches] = useState(false); // new state for no matches message
  const navigate = useNavigate();


  

  const _goBack = () => {
    navigate("/profile");
  };



  const handlePrevClick = (index) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((val, i) => (i === index ? val - 5 : val))
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
  
    // Preload images to eliminate lag
    const preloadImages = (users) => {
      users.forEach((user) => {
        // Preload profile_pic
        if (user.profile_pic) {
          const img = new Image();
          img.src = user.profile_pic;
        }
        
        // Preload pictures array
        if (user.pictures && Array.isArray(user.pictures)) {
          user.pictures.forEach((picUrl) => {
            const img = new Image();
            img.src = picUrl;
          });
        }
        
        // Preload fallback pic if exists
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
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
  
        console.log(data.matches); // debugging matches data
        
        // Preload all match images
        if (data.matches && data.matches.length > 0) {
          preloadImages(data.matches);
        }
        
        setMatches(data.matches);
  
        if (data.matches.length === 0) {
          setNoMatches(true); // set nomatches to true if there are no matches
        } else {
          setNoMatches(false); // otherwise, reset nomatches
        }
  
        // initialize pagination indices for each match
        setCurrentIndices(new Array(data.matches.length).fill(0)); // fill with 0
      } catch (error) {
        console.log("error fetching matches");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <>
      <Header />
      <Box bg="#232136" minHeight="100vh" py={8}>
        <Heading as="h3" textAlign="center" color="#eb6f92" mb={8}>
          Your Matches
        </Heading>

        {/* display a message if there are no matches */}
        {noMatches ? (
          <Center minH="60vh">
            <VStack spacing={6} maxW="500px" px={4}>
              <Box position="relative">
                <Icon
                  as={FaMusic}
                  boxSize={20}
                  color="#393552"
                  position="absolute"
                  top="-10px"
                  left="-10px"
                  opacity={0.3}
                />
                <Icon
                  as={FaHeart}
                  boxSize={24}
                  color="#eb6f92"
                />
                <Icon
                  as={FaMusic}
                  boxSize={16}
                  color="#393552"
                  position="absolute"
                  bottom="-8px"
                  right="-8px"
                  opacity={0.3}
                />
              </Box>
              
              <VStack spacing={3}>
                <Heading size="lg" color="#e0def4" textAlign="center">
                  No Matches Yet
                </Heading>
                <Text color="#908caa" fontSize="lg" textAlign="center">
                  You haven&apos;t matched with anyone yet. Start swiping to find people who share your music taste!
                </Text>
              </VStack>

              <VStack spacing={3} w="full">
                <Button
                  bg="#eb6f92"
                  color="white"
                  size="lg"
                  w="full"
                  _hover={{ bg: "#d45879", transform: "translateY(-2px)" }}
                  _active={{ transform: "translateY(0)" }}
                  onClick={() => navigate("/matches")}
                  leftIcon={<Icon as={FaHeart} />}
                  transition="all 0.2s"
                >
                  Find Matches
                </Button>
                
                <Button
                  bg="#393552"
                  color="#e0def4"
                  size="md"
                  variant="ghost"
                  _hover={{ bg: "#524f67" }}
                  onClick={() => navigate("/profile")}
                >
                  View Profile
                </Button>
              </VStack>

              <Box
                bg="#2a273f"
                p={6}
                borderRadius="lg"
                border="1px solid"
                borderColor="#393552"
                w="full"
              >
                <VStack spacing={3} align="start">
                  <Heading size="sm" color="#eb6f92">
                    💡 Tips to get matches:
                  </Heading>
                  <VStack align="start" spacing={2} pl={2}>
                    <Text color="#e0def4" fontSize="sm">
                      • Like profiles that interest you
                    </Text>
                    <Text color="#e0def4" fontSize="sm">
                      • Connect your music platform for better matches
                    </Text>
                    <Text color="#e0def4" fontSize="sm">
                      • Complete your profile with a bio
                    </Text>
                    <Text color="#e0def4" fontSize="sm">
                      • Be active - check back often!
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </Center>
        ) : (
          <VStack spacing={6} p="4" maxW="600px" mx="auto" w="full">
            {matches &&
              Array.isArray(matches) &&
              matches.map((match, index) => (
                <Box
                  key={index}
                  borderWidth="2px"
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="lg"
                  position="relative"
                  w="full"
                  bg="#2a273f"
                  borderColor="#393552"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-4px)", boxShadow: "0 20px 40px rgba(235, 111, 146, 0.2)" }}
                  p={6}
                >
                  <VStack spacing={4} align="stretch">
                    {/* Profile Header */}
                    <Flex alignItems="center" gap={4}>
                      <Image
                        src={match.profile_pic || match.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                        alt={`${match.preferred_name || match.name || 'User'}'s picture`}
                        boxSize="80px"
                        borderRadius="full"
                        border="3px solid"
                        borderColor="#eb6f92"
                        objectFit="cover"
                      />
                      <Box flex={1}>
                        <Heading size="md" color="#e0def4" mb={1}>
                          {match.preferred_name || match.name || 'Unknown User'}, {match.age || '?'}
                        </Heading>
                        {match.country && (
                          <Text color="#908caa" fontSize="sm">
                            📍 {match.country}
                          </Text>
                        )}
                      </Box>
                    </Flex>

                    {/* Bio */}
                    {match.bio && (
                      <Box>
                        <Text color="#e0def4" fontSize="sm" fontStyle="italic">
                          &ldquo;{match.bio}&rdquo;
                        </Text>
                      </Box>
                    )}

                    {/* Genres */}
                    <Box>
                      <Text color="#908caa" fontSize="sm" fontWeight="bold" mb={2}>
                        Music Taste:
                      </Text>
                      <Flex wrap="wrap" gap={2}>
                        {(() => {
                          const userGenres = match.aggregatedGenres || match.genres || [];
                          return Array.isArray(userGenres) && userGenres.length > 0
                            ? userGenres
                                .slice(currentIndices[index], currentIndices[index] + 5)
                                .map((genre, genreIndex) => (
                                  <Badge
                                    key={genreIndex}
                                    borderRadius="full"
                                    px="3"
                                    py="1"
                                    bg="#393552"
                                    color="#9ccfd8"
                                    fontSize="xs"
                                    textTransform="capitalize"
                                  >
                                    {genre}
                                  </Badge>
                                ))
                            : <Text color="#6e6a86" fontSize="sm">No genres listed</Text>;
                        })()}
                      </Flex>

                      {/* Genre Navigation */}
                      {(() => {
                        const userGenres = match.aggregatedGenres || match.genres || [];
                        return userGenres.length > 5 && (
                          <Flex mt="3" justifyContent="center" gap={2}>
                            <IconButton
                              aria-label="Previous genres"
                              icon={<FaChevronLeft />}
                              onClick={() => handlePrevClick(index)}
                              isDisabled={currentIndices[index] === 0}
                              size="sm"
                              bg="#393552"
                              color="#e0def4"
                              _hover={{ bg: "#524f67" }}
                              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                            />
                            <Text color="#908caa" fontSize="xs" alignSelf="center">
                              {Math.floor(currentIndices[index] / 5) + 1} / {Math.ceil(userGenres.length / 5)}
                            </Text>
                            <IconButton
                              aria-label="Next genres"
                              icon={<FaChevronRight />}
                              onClick={() => handleNextClick(index)}
                              isDisabled={currentIndices[index] + 5 >= userGenres.length}
                              size="sm"
                              bg="#393552"
                              color="#e0def4"
                              _hover={{ bg: "#524f67" }}
                              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                            />
                          </Flex>
                        );
                      })()}
                    </Box>

                    {/* Contact Info */}
                    {match.contact_info && (
                      <Box
                        bg="#393552"
                        p={3}
                        borderRadius="md"
                        textAlign="center"
                      >
                        <Text color="#908caa" fontSize="xs" mb={1}>
                          Contact Info
                        </Text>
                        <Text color="#e0def4" fontSize="sm" fontWeight="semibold">
                          {match.contact_info}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
              ))}
          </VStack>
        )}
      </Box>
    </>
  );
};

export default MatchesList;
