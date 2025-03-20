// Matches - Swipe interface with Kawaii Cute design
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import Header from "./Header";
import { 
  Center, 
  Flex, 
  Text, 
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
  Spinner,
  Icon,
  Circle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiFilter, FiX, FiRefreshCw, FiSliders, FiHeart, FiUsers } from "react-icons/fi";
import { 
  ClayCard, 
  ClayCardBody, 
  ClayButton, 
  CyanButton,
  GhostButton,
  FloatingShapes 
} from "./ui";

const MotionBox = motion(Box);

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex - 5 < 0 ? 0 : currentIndex - 5);
  };

  const handleNextClick = () => {
    setCurrentIndex(
      currentIndex + 5 > activeMatch.genres.length - 1
        ? activeMatch.genres.length - 1
        : currentIndex + 5
    );
  };

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
    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));
      await fetch(`${API_URL}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          likedUserId: activeMatch._id,
          liker: activeUser._id,
        }),
      });
    } catch (error) {
      console.error("Error liking user:", error);
    }
    moveToNextMatch();
  };

  const handleDislike = async () => {
    if (!activeMatch || !activeMatch._id) return;
    moveToNextMatch();
  };

  const handleViewMatchesAgain = () => {
    setState((prevState) => ({
      ...prevState,
      currentMatchIndex: 0,
      allMatchesViewed: false,
    }));
  };
  
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

  const fetchUserProfiles = useCallback(async () => {
    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!activeUser || !activeUser._id) {
        console.error("User not found in localStorage");
        return;
      }
      const userId = activeUser._id;

      const response = await fetch(`${API_URL}/GetUsers?userId=${userId}`);
      const data = await response.json();

      if (data.users && data.users.length > 0) {
        preloadImages(data.users);
      }

      setState((prevState) => ({
        ...prevState,
        matches: data.users,
        loading: false,
        currentMatchIndex: 0,
        allMatchesViewed: false,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, []);
  
  const applyFilters = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    
    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!activeUser || !activeUser._id) return;
      
      await fetch(`${API_URL}/updateUserProfile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUser._id,
          preferences: {
            interestedIn: filters.genders,
            ageMin: filters.ageMin,
            ageMax: filters.ageMax,
          }
        }),
      });
      
      await fetchUserProfiles();
    } catch (error) {
      console.error("Error applying filters:", error);
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };
  
  const clearFilters = async () => {
    setFilters({ genders: [], ageMin: 18, ageMax: 99 });
    setState((prevState) => ({ ...prevState, loading: true }));
    
    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));
      if (!activeUser || !activeUser._id) return;
      
      await fetch(`${API_URL}/updateUserProfile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUser._id,
          preferences: { interestedIn: [], ageMin: 18, ageMax: 99 }
        }),
      });
      
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
  }, [navigate, fetchUserProfiles]);

  return (
    <>
      <Header />
      <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden">
        <FloatingShapes variant="subtle" />
        
        <Center py={8} position="relative" zIndex={1}>
          <Flex direction="column" alignItems="center" w="full" maxW="500px" px={4}>
            {/* Header */}
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              w="full"
              mb={4}
            >
              <HStack justify="space-between" w="full">
                <HStack spacing={3}>
                  <Circle size="40px" bg="kawaii.pink">
                    <Icon as={FiHeart} boxSize={5} color="white.pure" />
                  </Circle>
                  <Heading
                    fontFamily="heading"
                    fontSize="2xl"
                    fontWeight="bold"
                    bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
                    bgClip="text"
                  >
                    Discover
                  </Heading>
                </HStack>
                <IconButton
                  icon={<Icon as={FiSliders} />}
                  onClick={onFilterToggle}
                  bg={isFilterOpen ? "kawaii.pink" : "surface.card"}
                  color={isFilterOpen ? "white.pure" : "text.primary"}
                  _hover={{ opacity: 0.85 }}
                  aria-label="Toggle filters"
                  borderRadius="full"
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
                  transition="background-color 0.2s ease, opacity 0.15s ease"
                  style={{ willChange: 'transform, opacity' }}
                  sx={{ '&:hover': { transform: 'none !important' } }}
                />
              </HStack>
            </MotionBox>

            {/* Filter Panel */}
            <Collapse in={isFilterOpen} animateOpacity style={{ width: '100%', overflow: 'visible' }}>
              <ClayCard mb={4} overflow="visible">
                <ClayCardBody>
                  <VStack spacing={5} align="stretch">
                    <HStack justify="space-between">
                      <HStack spacing={2}>
                        <Circle size="28px" bg="kawaii.lilac">
                          <Icon as={FiFilter} boxSize={3} color="white.pure" />
                        </Circle>
                        <Heading
                          fontFamily="heading"
                          fontSize="sm"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          Filter Matches
                        </Heading>
                      </HStack>
                      <GhostButton
                        size="sm"
                        leftIcon={<Icon as={FiX} />}
                        onClick={clearFilters}
                      >
                        Clear
                      </GhostButton>
                    </HStack>

                    {/* Gender Filter */}
                    <Box>
                      <Text 
                        fontFamily="body" 
                        fontSize="sm" 
                        fontWeight="semibold" 
                        color="text.secondary"
                        mb={3}
                      >
                        Show me:
                      </Text>
                      <CheckboxGroup
                        value={filters.genders}
                        onChange={(values) => setFilters({ ...filters, genders: values })}
                      >
                        <Stack spacing={3}>
                          {['male', 'female', 'non-binary'].map((value) => (
                            <Checkbox
                              key={value}
                              value={value}
                              sx={{
                                '.chakra-checkbox__control': {
                                  bg: 'surface.muted',
                                  borderColor: 'rgba(255, 200, 210, 0.2)',
                                  borderRadius: 'lg',
                                  _checked: { 
                                    bg: 'kawaii.pink', 
                                    borderColor: 'kawaii.pink',
                                  }
                                },
                                '.chakra-checkbox__label': { 
                                  color: 'text.secondary', 
                                  fontFamily: 'body',
                                  fontSize: 'sm' 
                                }
                              }}
                            >
                              {value === 'male' ? 'Men' : value === 'female' ? 'Women' : 'Non-binary'}
                            </Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    </Box>

                    {/* Age Range Filter */}
                    <Box>
                      <Text 
                        fontFamily="body" 
                        fontSize="sm" 
                        fontWeight="semibold" 
                        color="text.secondary"
                        mb={3}
                      >
                        Age: {filters.ageMin} - {filters.ageMax}
                      </Text>
                      <RangeSlider
                        min={18}
                        max={99}
                        step={1}
                        value={[filters.ageMin, filters.ageMax]}
                        onChange={(values) => setFilters({ ...filters, ageMin: values[0], ageMax: values[1] })}
                      >
                        <RangeSliderTrack bg="surface.muted" h="8px" borderRadius="full">
                          <RangeSliderFilledTrack bgGradient="linear(90deg, kawaii.pink, kawaii.lilac)" />
                        </RangeSliderTrack>
                        <RangeSliderThumb 
                          index={0} 
                          bg="kawaii.pink" 
                          boxSize={5}
                          boxShadow="0 3px 8px rgba(0, 0, 0, 0.15)"
                        />
                        <RangeSliderThumb 
                          index={1} 
                          bg="kawaii.lilac" 
                          boxSize={5}
                          boxShadow="0 3px 8px rgba(0, 0, 0, 0.15)"
                        />
                      </RangeSlider>
                    </Box>

                    <ClayButton
                      w="full"
                      onClick={applyFilters}
                      isLoading={loading}
                    >
                      Apply Filters
                    </ClayButton>
                  </VStack>
                </ClayCardBody>
              </ClayCard>
            </Collapse>

            {/* Matches Display */}
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              w="full"
            >
              {loading ? (
                <ClayCard>
                  <ClayCardBody py={16}>
                    <VStack spacing={4}>
                      <Circle size="60px" bg="kawaii.pink">
                        <Spinner size="lg" color="white.pure" thickness="3px" />
                      </Circle>
                      <Text fontFamily="body" color="text.muted">
                        Finding your matches...
                      </Text>
                    </VStack>
                  </ClayCardBody>
                </ClayCard>
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
                  <ClayCard>
                    <ClayCardBody py={12} textAlign="center">
                      <VStack spacing={5}>
                        <Circle size="70px" bg="kawaii.lilac">
                          <Icon as={FiRefreshCw} boxSize={8} color="white.pure" />
                        </Circle>
                        <VStack spacing={2}>
                          <Heading
                            fontFamily="heading"
                            fontSize="xl"
                            fontWeight="bold"
                            color="text.primary"
                          >
                            All Caught Up!
                          </Heading>
                          <Text fontFamily="body" color="text.muted">
                            You&apos;ve seen all available matches
                          </Text>
                        </VStack>
                        <CyanButton
                          onClick={handleViewMatchesAgain}
                          leftIcon={<Icon as={FiRefreshCw} />}
                        >
                          Start Over
                        </CyanButton>
                      </VStack>
                    </ClayCardBody>
                  </ClayCard>
                )
              ) : (
                <ClayCard>
                  <ClayCardBody py={12} textAlign="center">
                    <VStack spacing={5}>
                      <Circle size="70px" bg="kawaii.mint">
                        <Icon as={FiUsers} boxSize={8} color="white.pure" />
                      </Circle>
                      <VStack spacing={2}>
                        <Heading
                          fontFamily="heading"
                          fontSize="xl"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          No Matches Found
                        </Heading>
                        <Text fontFamily="body" color="text.muted">
                          Try adjusting your filters
                        </Text>
                      </VStack>
                      <ClayButton
                        onClick={clearFilters}
                        leftIcon={<Icon as={FiX} />}
                      >
                        Clear Filters
                      </ClayButton>
                    </VStack>
                  </ClayCardBody>
                </ClayCard>
              )}
            </MotionBox>
          </Flex>
        </Center>
      </Box>
    </>
  );
};

export default Matches;
