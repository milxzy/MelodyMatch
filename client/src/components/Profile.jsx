// Profile - Main profile page with Kawaii Cute design
import { useEffect, useState, useMemo } from "react";
import { 
  Center, 
  Heading, 
  Spinner, 
  Text, 
  Alert, 
  AlertIcon,
  Box,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Circle,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { FiUser, FiMusic, FiDatabase, FiHeart, FiSettings, FiCheckCircle } from 'react-icons/fi';
import Header from "./Header";
import UserProfileCard from "./UserProfileCard";
import PlatformSelector from "./PlatformSelector";
import MigrationWizard from "./MigrationWizard";
import MusicDataBreakdown from "./MusicDataBreakdown";
import { 
  ClayCard, 
  ClayCardBody, 
  ClayButton, 
  OutlineButton,
  FloatingShapes 
} from "./ui";

const MotionBox = motion(Box);

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const Profile = () => {
  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo"));
    } catch {
      return null;
    }
  }, []);
  const [user, setUser] = useState({
    age: "",
    artists: [],
    contactInfo: "",
    country: "",
    email: "",
    gender: "",
    genres: "",
    preferredName: "",
    profilePic: "",
    connectedPlatforms: [],
    primaryPlatform: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  // Track which tabs have been visited so we only mount their content on first click
  const [visitedTabs, setVisitedTabs] = useState(new Set([0]));

  const navigate = useNavigate();

  const handleTabChange = (index) => {
    setTabIndex(index);
    setVisitedTabs(prev => new Set([...prev, index]));
  };

  async function getMainUser() {
    try {
      setLoading(true);
      setError(null);
      
      if (!userData || !userData.email) {
        throw new Error("User not found in session");
      }

      const api = await fetch(
        `${API_URL}/getsingleuser?keyword=${userData.email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!api.ok) {
        throw new Error(`Failed to fetch user data: ${api.statusText}`);
      }

      const data = await api.json();

      if (!data.searchedUser) {
        throw new Error("User data not found");
      }

      const searchedUser = data.searchedUser;

      setUser({
        age: searchedUser.age || "",
        artists: searchedUser.aggregatedArtists || searchedUser.artists || [],
        genres: searchedUser.aggregatedGenres || searchedUser.genres || [],
        contactInfo: searchedUser.contact_info || "",
        country: searchedUser.country || "",
        email: searchedUser.email || "",
        gender: searchedUser.gender || "",
        preferredName: searchedUser.preferred_name || "",
        profilePic: searchedUser.profile_pic || "",
        connectedPlatforms: searchedUser.connectedPlatforms || [],
        primaryPlatform: searchedUser.primaryPlatform || null,
        userId: searchedUser._id || searchedUser.id,
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!userData || !userData.email) {
      console.error("User not found in localStorage");
      navigate("/login");
      return;
    }
    getMainUser();
    // intentionally run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlatformUpdate = () => {
    getMainUser();
    setDataRefreshKey(prev => prev + 1);
  };

  const getPlatformDisplayName = (platform) => {
    const names = {
      apple_music: 'Apple Music',
      youtube_music: 'YouTube Music',
      spotify: 'Spotify'
    };
    return names[platform] || platform;
  };

  const tabs = [
    { label: 'Profile', icon: FiUser, color: 'kawaii.pink' },
    { label: 'Platforms', icon: FiMusic, color: 'kawaii.lilac' },
    { label: 'Music Data', icon: FiDatabase, color: 'kawaii.mint' },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <Center minH="100vh" bg="surface.base">
          <VStack spacing={4}>
            <Circle size="60px" bg="kawaii.pink">
              <Spinner size="lg" color="white.pure" thickness="3px" />
            </Circle>
            <Text fontFamily="body" color="text.muted">Loading profile...</Text>
          </VStack>
        </Center>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Center minH="100vh" bg="surface.base">
          <VStack spacing={4}>
            <Alert 
              status="error" 
              borderRadius="2xl" 
              maxW="500px"
              bg="rgba(255, 71, 87, 0.15)"
              border="2px solid"
              borderColor="error"
            >
              <AlertIcon color="error" />
              <Text fontFamily="body" color="error">{error}</Text>
            </Alert>
            <ClayButton onClick={getMainUser}>Try Again</ClayButton>
          </VStack>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <MigrationWizard 
        userId={user.userId} 
        onComplete={handlePlatformUpdate}
      />
      <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden" py={8}>
        <FloatingShapes variant="subtle" />
        
        <Center position="relative" zIndex={1}>
          <Box maxW="1200px" w="full" px={4}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VStack spacing={6}>
                {/* Header */}
                <HStack spacing={3}>
                  <Circle size="40px" bg="kawaii.pink">
                    <Icon as={FiUser} boxSize={5} color="white.pure" />
                  </Circle>
                  <Heading
                    fontFamily="heading"
                    fontSize="2xl"
                    fontWeight="bold"
                    bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
                    bgClip="text"
                  >
                    My Profile
                  </Heading>
                </HStack>

                {/* Tabs */}
                <Tabs 
                  index={tabIndex}
                  onChange={handleTabChange}
                  w="full"
                  variant="unstyled"
                >
                  <TabList 
                    mb={6} 
                    bg="surface.muted" 
                    p={1.5} 
                    borderRadius="full"
                    justifyContent="center"
                    flexWrap="wrap"
                    gap={1}
                  >
                    {tabs.map((tab, index) => (
                      <Tab 
                        key={tab.label}
                        fontFamily="body"
                        fontWeight="semibold"
                        fontSize="sm"
                        color={tabIndex === index ? tab.color : "text.muted"}
                        bg={tabIndex === index ? "surface.card" : "transparent"}
                        boxShadow={tabIndex === index ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none"}
                        borderRadius="full"
                        px={6}
                        py={3}
                        transition="background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease"
                        _hover={{ color: tabIndex === index ? tab.color : "text.primary" }}
                        _focus={{ outline: "none" }}
                      >
                        <HStack spacing={2}>
                          <Icon as={tab.icon} />
                          <Text display={{ base: 'none', sm: 'block' }}>{tab.label}</Text>
                        </HStack>
                      </Tab>
                    ))}
                  </TabList>

                  <TabPanels>
                    {/* Profile Tab */}
                    <TabPanel p={0}>
                      <VStack spacing={6}>
                        <UserProfileCard
                          name={user.preferredName}
                          genres={user.genres}
                          age={user.age}
                          country={user.country}
                          profilePic={user.profilePic}
                        />

                        {/* Connected Platforms Display */}
                        {user.connectedPlatforms.length > 0 && (
                          <ClayCard w="full" maxW="500px">
                            <ClayCardBody>
                              <VStack align="stretch" spacing={4}>
                                <HStack>
                                  <Circle size="36px" bg="kawaii.lilac">
                                    <Icon as={FiMusic} color="white.pure" boxSize={4} />
                                  </Circle>
                                  <Heading
                                    fontFamily="heading"
                                    fontSize="md"
                                    fontWeight="bold"
                                    color="text.primary"
                                  >
                                    Connected Platforms
                                  </Heading>
                                </HStack>

                                <VStack align="start" spacing={2}>
                                  {user.connectedPlatforms.map((platform) => (
                                    <HStack key={platform} spacing={2}>
                                      <Circle size="24px" bg="kawaii.mint">
                                        <Icon as={FiCheckCircle} color="white.pure" boxSize={3} />
                                      </Circle>
                                      <Text fontFamily="body" color="text.secondary">
                                        {getPlatformDisplayName(platform)}
                                      </Text>
                                      {user.primaryPlatform === platform && (
                                        <Box
                                          px={2}
                                          py={0.5}
                                          bg="kawaii.peach"
                                          borderRadius="full"
                                        >
                                          <Text fontFamily="body" fontSize="xs" fontWeight="bold" color="white.pure">
                                            Primary
                                          </Text>
                                        </Box>
                                      )}
                                    </HStack>
                                  ))}
                                </VStack>

                                <Box 
                                  pt={3} 
                                  borderTop="2px solid" 
                                  borderColor="rgba(255, 200, 210, 0.06)"
                                >
                                  <HStack spacing={4}>
                                    <HStack spacing={1}>
                                      <Circle size="20px" bg="kawaii.pink">
                                        <Text fontFamily="body" fontSize="xs" color="white.pure">{user.artists.length}</Text>
                                      </Circle>
                                      <Text fontFamily="body" fontSize="sm" color="text.muted">artists</Text>
                                    </HStack>
                                    <HStack spacing={1}>
                                      <Circle size="20px" bg="kawaii.lilac">
                                        <Text fontFamily="body" fontSize="xs" color="white.pure">{user.genres.length}</Text>
                                      </Circle>
                                      <Text fontFamily="body" fontSize="sm" color="text.muted">genres</Text>
                                    </HStack>
                                  </HStack>
                                </Box>
                              </VStack>
                            </ClayCardBody>
                          </ClayCard>
                        )}

                        <HStack spacing={4} w="full" maxW="500px">
                          <ClayButton
                            flex="1"
                            size="lg"
                            leftIcon={<Icon as={FiHeart} />}
                            onClick={() => navigate('/discover')}
                          >
                            Find Matches
                          </ClayButton>
                          <OutlineButton
                            flex="1"
                            size="lg"
                            leftIcon={<Icon as={FiSettings} />}
                            onClick={() => navigate('/settings')}
                          >
                            Edit Profile
                          </OutlineButton>
                        </HStack>
                      </VStack>
                    </TabPanel>

                    {/* Music Platforms Tab — only mounts after first click */}
                    <TabPanel p={0}>
                      {visitedTabs.has(1) && (
                        <VStack spacing={6}>
                          <ClayCard maxW="600px" mx="auto" w="full">
                            <ClayCardBody>
                              <Text fontFamily="body" color="text.muted" textAlign="center">
                                Manage your connected music platforms. Connect multiple platforms
                                for more accurate matching!
                              </Text>
                            </ClayCardBody>
                          </ClayCard>
                          
                          {user.userId && (
                            <PlatformSelector 
                              userId={user.userId}
                              onPlatformConnected={handlePlatformUpdate}
                            />
                          )}
                        </VStack>
                      )}
                    </TabPanel>

                    {/* My Music Data Tab — only mounts after first click */}
                    <TabPanel p={0}>
                      {visitedTabs.has(2) && user.userId && (
                        <MusicDataBreakdown 
                          key={dataRefreshKey}
                          userId={user.userId} 
                        />
                      )}
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </MotionBox>
          </Box>
        </Center>
      </Box>
    </>
  );
};

export default Profile;
