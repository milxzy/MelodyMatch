import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import Header from "./Header";
import { 
  Center, 
  Flex, 
  Text, 
  Button, 
  Heading,
  Box,
  VStack,
  HStack,
  Checkbox,
  CheckboxGroup,
  Stack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  IconButton,
  Collapse,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { FiFilter, FiX } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const Matches = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    matches: [],
    currentMatchIndex: 0,
    loading: true,
    allMatchesViewed: false,
  });
  
  const [filters, setFilters] = useState({
    genders: [],
    ageMin: 18,
    ageMax: 99,
  });
  
  const { isOpen: isFilterOpen, onToggle: onFilterToggle } = useDisclosure();

  const { matches, currentMatchIndex, loading, allMatchesViewed } = state;

  const [currentIndex, setCurrentIndex] = useState(0); // initialize currentindex state

  // function to handle click on previous button
  const handlePrevClick = () => {
    setCurrentIndex(currentIndex - 5 < 0 ? 0 : currentIndex - 5);
  };

  

  // function to handle click on next button
  const handleNextClick = () => {
    setCurrentIndex(
      currentIndex + 5 > activeMatch.genres.length - 1
        ? activeMatch.genres.length - 1
        : currentIndex + 5
    );
  };

  // get the current active match safely
  const activeMatch = useMemo(
    () => matches[currentMatchIndex] || null,
    [matches, currentMatchIndex]
  );

  const moveToNextMatch = () => {
    setState((prevState) => {
      const nextIndex = prevState.currentMatchIndex + 1;
      const allViewed = nextIndex >= matches.length;

      return {
        ...prevState,
        currentMatchIndex: nextIndex,
        allMatchesViewed: allViewed,
      };
    });
    setCurrentIndex(0);
  };

  const handleLike = async () => {
    if (!activeMatch) return;
    console.log('match')

    try {
      console.log('work')
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));

      // send the like to the database
      await fetch(`${API_URL}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likedUserId: activeMatch._id,
          liker: activeUser._id,
        }),
      });

      console.log(`User ${activeUser._id} liked ${activeMatch._id}`);
    } catch (error) {
      console.error("Error liking user:", error);
    }

    moveToNextMatch();
    console.log('moving to next match')
  };

  const handleDislike = async () => {
    if (!activeMatch || !activeMatch._id) return;

    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!activeUser || !activeUser._id) {
        console.error("Active user not found");
        return;
      }

      // optionally, log or handle a "dislike" action if needed
      console.log(`User ${activeUser._id} disliked ${activeMatch._id}`);
    } catch (error) {
      console.error("Error disliking user:", error);
    }

    moveToNextMatch();
  };

  const handleViewMatchesAgain = () => {
    setState((prevState) => ({
      ...prevState,
      currentMatchIndex: 0,
      allMatchesViewed: false,
    }));
  };
  
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

  const fetchUserProfiles = async () => {
    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!activeUser || !activeUser._id) {
        console.error("User not found in localStorage");
        return;
      }
      const userId = activeUser._id;

      const response = await fetch(`${API_URL}/GetUsers?userId=${userId}`);
      const data = await response.json();
      console.log(data);

      // Preload all user images
      if (data.users && data.users.length > 0) {
        preloadImages(data.users);
      }

      setState((prevState) => ({
        ...prevState,
        matches: data.users,
        loading: false,
        currentMatchIndex: 0, // Reset to first match when fetching new data
        allMatchesViewed: false,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };
  
  const applyFilters = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    
    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!activeUser || !activeUser._id) {
        console.error("User not found in localStorage");
        return;
      }
      
      // Temporarily update user preferences on the backend to apply filters
      await fetch(`${API_URL}/updateUserProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: activeUser._id,
          preferences: {
            interestedIn: filters.genders,
            ageMin: filters.ageMin,
            ageMax: filters.ageMax,
          }
        }),
      });
      
      // Fetch users with new filters
      await fetchUserProfiles();
    } catch (error) {
      console.error("Error applying filters:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };
  
  const clearFilters = async () => {
    setFilters({
      genders: [],
      ageMin: 18,
      ageMax: 99,
    });
    
    setState((prevState) => ({ ...prevState, loading: true }));
    
    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!activeUser || !activeUser._id) {
        console.error("User not found in localStorage");
        return;
      }
      
      // Clear user preferences on the backend
      await fetch(`${API_URL}/updateUserProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: activeUser._id,
          preferences: {
            interestedIn: [],
            ageMin: 18,
            ageMax: 99,
          }
        }),
      });
      
      // Fetch all users
      await fetchUserProfiles();
    } catch (error) {
      console.error("Error clearing filters:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    fetchUserProfiles();
  }, [navigate]);
  


  return (
    <>
      <Header />
      <Center bg="#232136" minHeight="100vh" py={8}>
        <Flex direction="column" justifyContent="center" alignItems="center" w="full" maxW="600px" px={4}>
          {/* Filter Button */}
          <HStack justify="space-between" w="full" mb={4}>
            <Heading as="h3" textAlign="center" color="#eb6f92" size="lg">
              Find Matches
            </Heading>
            <IconButton
              icon={<FiFilter />}
              onClick={onFilterToggle}
              bg={isFilterOpen ? "#eb6f92" : "#393552"}
              color="#e0def4"
              _hover={{ bg: isFilterOpen ? "#d45879" : "#524f67" }}
              aria-label="Toggle filters"
              size="md"
            />
          </HStack>

          {/* Filter Panel */}
          <Collapse in={isFilterOpen} animateOpacity style={{ width: '100%' }}>
            <Box
              bg="#2a273f"
              p={6}
              borderRadius="lg"
              mb={4}
              border="1px solid"
              borderColor="#393552"
              w="full"
            >
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="sm" color="#eb6f92">
                    Filter Matches
                  </Heading>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="#908caa"
                    onClick={clearFilters}
                    leftIcon={<FiX />}
                    _hover={{ color: "#eb6f92" }}
                  >
                    Clear All
                  </Button>
                </HStack>

                <Divider borderColor="#393552" />

                {/* Gender Filter */}
                <Box>
                  <Text color="#e0def4" fontWeight="semibold" mb={2} fontSize="sm">
                    Show me:
                  </Text>
                  <CheckboxGroup
                    value={filters.genders}
                    onChange={(values) => setFilters({ ...filters, genders: values })}
                  >
                    <Stack spacing={2} direction="column">
                      <Checkbox
                        value="male"
                        colorScheme="pink"
                        iconColor="white"
                        sx={{
                          '.chakra-checkbox__control': {
                            bg: '#393552',
                            borderColor: '#6E6A86',
                            _checked: { bg: '#EB6F92', borderColor: '#EB6F92' }
                          },
                          '.chakra-checkbox__label': { color: '#e0def4', fontSize: 'sm' }
                        }}
                      >
                        Men
                      </Checkbox>
                      <Checkbox
                        value="female"
                        colorScheme="pink"
                        iconColor="white"
                        sx={{
                          '.chakra-checkbox__control': {
                            bg: '#393552',
                            borderColor: '#6E6A86',
                            _checked: { bg: '#EB6F92', borderColor: '#EB6F92' }
                          },
                          '.chakra-checkbox__label': { color: '#e0def4', fontSize: 'sm' }
                        }}
                      >
                        Women
                      </Checkbox>
                      <Checkbox
                        value="non-binary"
                        colorScheme="pink"
                        iconColor="white"
                        sx={{
                          '.chakra-checkbox__control': {
                            bg: '#393552',
                            borderColor: '#6E6A86',
                            _checked: { bg: '#EB6F92', borderColor: '#EB6F92' }
                          },
                          '.chakra-checkbox__label': { color: '#e0def4', fontSize: 'sm' }
                        }}
                      >
                        Non-binary
                      </Checkbox>
                    </Stack>
                  </CheckboxGroup>
                </Box>

                {/* Age Range Filter */}
                <Box>
                  <Text color="#e0def4" fontWeight="semibold" mb={2} fontSize="sm">
                    Age: {filters.ageMin} - {filters.ageMax}
                  </Text>
                  <RangeSlider
                    min={18}
                    max={99}
                    step={1}
                    value={[filters.ageMin, filters.ageMax]}
                    onChange={(values) => setFilters({ ...filters, ageMin: values[0], ageMax: values[1] })}
                    colorScheme="pink"
                  >
                    <RangeSliderTrack bg="#393552">
                      <RangeSliderFilledTrack bg="#EB6F92" />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} bg="#EB6F92" />
                    <RangeSliderThumb index={1} bg="#EB6F92" />
                  </RangeSlider>
                </Box>

                <Button
                  bg="#eb6f92"
                  color="white"
                  w="full"
                  onClick={applyFilters}
                  _hover={{ bg: "#d45879" }}
                  isLoading={loading}
                >
                  Apply Filters
                </Button>
              </VStack>
            </Box>
          </Collapse>

          {/* Matches Display */}
          {loading ? (
            <Text color="#e0def4">Loading...</Text>
          ) : matches.length > 0 ? (
            !allMatchesViewed ? (
              <ProfileCard
                profilePic={activeMatch?.profile_pic || activeMatch?.pic}
                pictures={activeMatch?.pictures}
                bio={activeMatch?.bio}
                name={activeMatch?.preferred_name || activeMatch?.name || activeMatch?.spotify_display_name || 'Unknown User'}
                age={activeMatch?.age}
                country={activeMatch?.country}
                genres={activeMatch?.genres || activeMatch?.aggregatedGenres || []}
                handleNextMatch={handleLike}
                handlePreviousMatch={handleDislike}
                handleNextClick={handleNextClick}
                handlePrevClick={handlePrevClick}
                currentIndex={currentIndex}
              />
            ) : (
              <Flex direction="column" alignItems="center" mt={4} gap={4}>
                <Text fontSize="xl" color="#e0def4" textAlign="center">
                  No more users available.
                </Text>
                <Button
                  onClick={handleViewMatchesAgain}
                  bg="#393552"
                  color="#e0def4"
                  _hover={{ bg: "#524f67" }}
                >
                  View Matches Again
                </Button>
              </Flex>
            )
          ) : (
            <Flex direction="column" alignItems="center" mt={8} gap={4}>
              <Text fontSize="lg" color="#908caa" textAlign="center">
                No matches found with current filters.
              </Text>
              <Button
                onClick={clearFilters}
                bg="#eb6f92"
                color="white"
                _hover={{ bg: "#d45879" }}
              >
                Clear Filters
              </Button>
            </Flex>
          )}
        </Flex>
      </Center>
    </>
  );
};

export default Matches;
