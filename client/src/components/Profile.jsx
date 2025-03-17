import { useEffect, useState } from "react";
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
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import UserProfileCard from "./UserProfileCard";
import PlatformSelector from "./PlatformSelector";
import MigrationWizard from "./MigrationWizard";
import MusicDataBreakdown from "./MusicDataBreakdown";

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem("userInfo"));
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

  const navigate = useNavigate();

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
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!api.ok) {
        throw new Error(`Failed to fetch user data: ${api.statusText}`);
      }

      const data = await api.json();
      console.log("User data:", data);

      if (!data.searchedUser) {
        throw new Error("User data not found");
      }

      const searchedUser = data.searchedUser;

      setUser({
        age: searchedUser.age || "",
        // Use aggregated data if available, fallback to legacy
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
      navigate("/belogin");
      return;
    }

    getMainUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlatformUpdate = () => {
    // Refresh user data after platform changes
    getMainUser();
    // Force MusicDataBreakdown to refresh
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

  return (
    <>
      <Header />
      <MigrationWizard 
        userId={user.userId} 
        onComplete={handlePlatformUpdate}
      />
      <Center bg='#232136' minHeight="100vh" py={8}>
        {loading ? (
          <VStack spacing={4}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#eb6f92"
              size="xl"
            />
            <Text color="white">Loading profile...</Text>
          </VStack>
        ) : error ? (
          <VStack spacing={4}>
            <Alert status="error" borderRadius="md" maxW="500px">
              <AlertIcon />
              {error}
            </Alert>
            <Button bg="#eb6f92" color="white" _hover={{ bg: "#d45879" }} onClick={getMainUser}>
              Try Again
            </Button>
          </VStack>
        ) : (
          <Box maxW="1200px" w="full" px={4}>
            <VStack spacing={6}>
              <Heading as='h3' color="#eb6f92" textAlign="center">
                My Profile
              </Heading>

              <Tabs 
                variant="soft-rounded" 
                colorScheme="pink" 
                w="full"
                isFitted
              >
                <TabList mb={6} bg="#2a273f" p={2} borderRadius="lg">
                  <Tab 
                    color="#908caa" 
                    _selected={{ color: "white", bg: "#eb6f92" }}
                  >
                    Profile
                  </Tab>
                  <Tab 
                    color="#908caa" 
                    _selected={{ color: "white", bg: "#eb6f92" }}
                  >
                    Music Platforms
                  </Tab>
                  <Tab 
                    color="#908caa" 
                    _selected={{ color: "white", bg: "#eb6f92" }}
                  >
                    My Music Data
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* Profile Tab */}
                  <TabPanel>
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
                        <Box
                          bg="#2a273f"
                          p={6}
                          borderRadius="lg"
                          w="full"
                          maxW="500px"
                        >
                          <Heading size="sm" color="#eb6f92" mb={4}>
                            Connected Music Platforms
                          </Heading>
                          <VStack align="start" spacing={2}>
                            {user.connectedPlatforms.map((platform) => (
                              <Text key={platform} color="#e0def4">
                                • {getPlatformDisplayName(platform)}
                                {user.primaryPlatform === platform && (
                                  <Text as="span" color="#31748f" fontSize="sm" ml={2}>
                                    (Primary)
                                  </Text>
                                )}
                              </Text>
                            ))}
                          </VStack>
                          <Divider my={4} borderColor="#6e6a86" />
                          <Text color="#908caa" fontSize="sm">
                            {user.artists.length} artists • {user.genres.length} genres
                          </Text>
                        </Box>
                      )}

                      <HStack spacing={4} w="full" maxW="500px">
                        <Button
                          bg="#eb6f92"
                          color="white"
                          _hover={{ bg: "#d45879" }}
                          onClick={() => navigate('/matches')}
                          size="lg"
                          flex="1"
                        >
                          Find Matches
                        </Button>
                        <Button
                          variant="outline"
                          borderColor="#eb6f92"
                          color="#eb6f92"
                          _hover={{ bg: "#393552" }}
                          onClick={() => navigate('/settings')}
                          size="lg"
                          flex="1"
                        >
                          Edit Profile
                        </Button>
                      </HStack>
                    </VStack>
                  </TabPanel>

                  {/* Music Platforms Tab */}
                  <TabPanel>
                    <VStack spacing={6}>
                      <Text color="#908caa" textAlign="center" maxW="600px">
                        Manage your connected music platforms. Connect multiple platforms
                        for more accurate matching!
                      </Text>
                      
                      {user.userId && (
                        <PlatformSelector 
                          userId={user.userId}
                          onPlatformConnected={handlePlatformUpdate}
                        />
                      )}
                    </VStack>
                  </TabPanel>

                  {/* My Music Data Tab */}
                  <TabPanel>
                    {user.userId && (
                      <MusicDataBreakdown 
                        key={dataRefreshKey}
                        userId={user.userId} 
                      />
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </VStack>
          </Box>
        )}
      </Center>
    </>
  );
};

export default Profile;
