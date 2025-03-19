// Dashboard - Kawaii Cute design
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Avatar,
  Spinner,
  Icon,
  Flex,
  Progress,
  Circle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiHeart, FiUsers, FiMessageCircle, FiMusic, FiEye, FiTrendingUp, FiStar } from "react-icons/fi";
import Header from "./Header";
import { 
  ClayCard, 
  ClayCardBody, 
  ClayButton, 
  CyanButton,
  OutlineButton,
  NeonBadge,
  PinkBadge,
  CyanBadge,
  FloatingShapes 
} from "./ui";

const MotionBox = motion(Box);

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const StatCard = ({ icon, label, value, helpText, color = "kawaii.pink" }) => (
  <ClayCard>
    <ClayCardBody>
      <HStack justify="space-between" align="flex-start">
        <VStack align="flex-start" spacing={1}>
          <Text
            fontFamily="body"
            fontSize="xs"
            fontWeight="semibold"
            color="text.muted"
          >
            {label}
          </Text>
          <Heading
            fontFamily="heading"
            fontSize="3xl"
            fontWeight="bold"
            color="text.primary"
          >
            {value}
          </Heading>
          <Text fontFamily="body" fontSize="xs" color="text.muted">
            {helpText}
          </Text>
        </VStack>
        <Circle size="48px" bg={color}>
          <Icon as={icon} boxSize={5} color="white.pure" />
        </Circle>
      </HStack>
    </ClayCardBody>
  </ClayCard>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalMatches: 0,
    totalMessages: 0,
    profileViews: 0,
    topGenres: [],
    recentMatches: [],
    matchRate: 0,
  });
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const storedData = localStorage.getItem("userInfo");
    if (!storedData) {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedData);
    setUserInfo(user);
    fetchDashboardData(user._id);
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      
      const userResponse = await fetch(`${API_URL}/getUserById/${userId}`);
      const userData = await userResponse.json();

      if (userData.user) {
        setUserInfo(userData.user);
      }

      const matchesResponse = await fetch(`${API_URL}/getMatches/${userId}`);
      const matchesData = await matchesResponse.json();
      const matches = matchesData.matches || [];

      const totalLikes = userData.user?.likedUsers?.length || 0;
      const totalMatches = matches.length;
      const matchRate = totalLikes > 0 ? Math.round((totalMatches / totalLikes) * 100) : 0;
      const topGenres = userData.user?.genres?.slice(0, 5) || [];

      const viewsResponse = await fetch(
        `${API_URL}/api/profile-views/count/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const viewsData = await viewsResponse.json();
      const profileViews = viewsData.viewCount || 0;

      const messagesResponse = await fetch(
        `${API_URL}/api/messages/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const messagesData = await messagesResponse.json();
      const totalMessages = messagesData.messages?.length || 0;

      setStats({
        totalLikes,
        totalMatches,
        totalMessages,
        profileViews,
        topGenres,
        recentMatches: matches.slice(0, 3),
        matchRate,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

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
            <Text fontFamily="body" color="text.muted">Loading your dashboard...</Text>
          </VStack>
        </Flex>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden">
        <FloatingShapes variant="subtle" />
        
        <Container maxW="container.xl" py={8} position="relative" zIndex={1}>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Welcome Section */}
            <MotionBox variants={itemVariants} mb={8}>
              <ClayCard>
                <ClayCardBody py={8}>
                  <HStack spacing={6} flexWrap="wrap">
                    <Box position="relative">
                      <Avatar
                        size="xl"
                        src={userInfo?.profile_pic || userInfo?.pic}
                        name={userInfo?.preferred_name || userInfo?.name}
                        border="4px solid"
                        borderColor="kawaii.pink"
                        boxShadow="0 6px 16px rgba(0, 0, 0, 0.15)"
                      />
                      <Circle
                        position="absolute"
                        bottom={0}
                        right={0}
                        size="20px"
                        bg="success"
                        border="3px solid"
                        borderColor="surface.card"
                      />
                    </Box>
                    <VStack align="flex-start" spacing={2}>
                      <Heading
                        fontFamily="heading"
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="bold"
                        color="text.primary"
                      >
                        Welcome back, {userInfo?.preferred_name || userInfo?.name || userInfo?.loginName || "friend"}!
                      </Heading>
                      <Text fontFamily="body" fontSize="md" color="text.muted">
                        Here&apos;s what&apos;s happening with your music connections
                      </Text>
                      <HStack spacing={2} pt={1}>
                        {['kawaii.pink', 'kawaii.lilac', 'kawaii.mint'].map((color, i) => (
                          <Circle key={i} size="8px" bg={color} />
                        ))}
                      </HStack>
                    </VStack>
                  </HStack>
                </ClayCardBody>
              </ClayCard>
            </MotionBox>

            {/* Stats Grid */}
            <MotionBox variants={itemVariants} mb={8}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <StatCard
                  icon={FiHeart}
                  label="Total Likes"
                  value={stats.totalLikes}
                  helpText="People you liked"
                  color="kawaii.pink"
                />
                <StatCard
                  icon={FiUsers}
                  label="Matches"
                  value={stats.totalMatches}
                  helpText="Mutual connections"
                  color="kawaii.lilac"
                />
                <StatCard
                  icon={FiTrendingUp}
                  label="Match Rate"
                  value={`${stats.matchRate}%`}
                  helpText="Success rate"
                  color="kawaii.mint"
                />
                <StatCard
                  icon={FiEye}
                  label="Profile Views"
                  value={stats.profileViews}
                  helpText="This week"
                  color="kawaii.peach"
                />
              </SimpleGrid>
            </MotionBox>

            {/* Two Column Section */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
              {/* Top Genres */}
              <MotionBox variants={itemVariants}>
                <ClayCard h="full">
                  <ClayCardBody>
                    <HStack mb={5}>
                      <Circle size="40px" bg="kawaii.pink">
                        <Icon as={FiMusic} color="white.pure" boxSize={5} />
                      </Circle>
                      <Heading
                        fontFamily="heading"
                        fontSize="lg"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        Your Top Genres
                      </Heading>
                    </HStack>
                    <VStack align="stretch" spacing={3}>
                      {stats.topGenres.length > 0 ? (
                        stats.topGenres.map((genre, index) => (
                          <HStack key={index} justify="space-between">
                            <HStack spacing={3}>
                              <Circle size="24px" bg={['kawaii.pink', 'kawaii.lilac', 'kawaii.mint', 'kawaii.peach', 'kawaii.pink'][index]}>
                                <Text fontFamily="body" fontSize="xs" fontWeight="bold" color="white.pure">
                                  {index + 1}
                                </Text>
                              </Circle>
                              <Text 
                                fontFamily="body" 
                                color="text.secondary" 
                                textTransform="capitalize"
                              >
                                {genre}
                              </Text>
                            </HStack>
                            <Progress 
                              value={100 - (index * 15)} 
                              size="sm" 
                              w="80px"
                              borderRadius="full"
                              bg="surface.muted"
                              sx={{
                                '& > div': {
                                  bgGradient: 'linear(135deg, kawaii.pink, kawaii.lilac)',
                                }
                              }}
                            />
                          </HStack>
                        ))
                      ) : (
                        <VStack py={6} spacing={3}>
                          <Circle size="50px" bg="surface.muted">
                            <Icon as={FiMusic} color="text.muted" boxSize={6} />
                          </Circle>
                          <Text fontFamily="body" color="text.muted" textAlign="center">
                            No genres found yet
                          </Text>
                          <OutlineButton size="sm" onClick={() => navigate("/migrate")}>
                            Connect Music Platform
                          </OutlineButton>
                        </VStack>
                      )}
                    </VStack>
                  </ClayCardBody>
                </ClayCard>
              </MotionBox>

              {/* Recent Matches */}
              <MotionBox variants={itemVariants}>
                <ClayCard h="full">
                  <ClayCardBody>
                    <HStack mb={5} justify="space-between">
                      <HStack>
                        <Circle size="40px" bg="kawaii.lilac">
                          <Icon as={FiUsers} color="white.pure" boxSize={5} />
                        </Circle>
                        <Heading
                          fontFamily="heading"
                          fontSize="lg"
                          fontWeight="bold"
                          color="text.primary"
                        >
                          Recent Matches
                        </Heading>
                      </HStack>
                      <ClayButton size="sm" onClick={() => navigate("/messaging")}>
                        View All
                      </ClayButton>
                    </HStack>
                    <VStack align="stretch" spacing={3}>
                      {stats.recentMatches.length > 0 ? (
                        stats.recentMatches.map((match) => (
                          <MotionBox
                            key={match._id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <HStack
                              p={3}
                              bg="surface.elevated"
                              borderRadius="2xl"
                              border="2px solid"
                              borderColor="rgba(255, 200, 210, 0.06)"
                              cursor="pointer"
                              onClick={() => navigate("/messaging")}
                              _hover={{ borderColor: "kawaii.lilac" }}
                              transition="all 0.2s"
                            >
                              <Avatar
                                src={match.profile_pic}
                                name={match.preferred_name}
                                size="md"
                                border="3px solid"
                                borderColor="kawaii.lilac"
                              />
                              <Box flex={1}>
                                <Text fontFamily="body" color="text.primary" fontWeight="bold">
                                  {match.preferred_name}
                                </Text>
                                <Text fontFamily="body" fontSize="sm" color="text.muted">
                                  {match.age} years old
                                </Text>
                              </Box>
                              <Circle size="28px" bg="kawaii.mint">
                                <Icon as={FiStar} boxSize={3} color="white.pure" />
                              </Circle>
                            </HStack>
                          </MotionBox>
                        ))
                      ) : (
                        <VStack py={6} spacing={3}>
                          <Circle size="50px" bg="surface.muted">
                            <Icon as={FiHeart} color="text.muted" boxSize={6} />
                          </Circle>
                          <Text fontFamily="body" color="text.muted" textAlign="center">
                            No matches yet. Start swiping!
                          </Text>
                          <CyanButton size="sm" onClick={() => navigate("/matches")}>
                            Find Matches
                          </CyanButton>
                        </VStack>
                      )}
                    </VStack>
                  </ClayCardBody>
                </ClayCard>
              </MotionBox>
            </SimpleGrid>

            {/* Quick Actions */}
            <MotionBox variants={itemVariants}>
              <ClayCard>
                <ClayCardBody>
                  <HStack mb={5}>
                    <Circle size="40px" bg="kawaii.mint">
                      <Icon as={FiStar} color="white.pure" boxSize={5} />
                    </Circle>
                    <Heading
                      fontFamily="heading"
                      fontSize="lg"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      Quick Actions
                    </Heading>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <ClayButton
                      size="lg"
                      w="full"
                      leftIcon={<Icon as={FiUsers} />}
                      onClick={() => navigate("/matches")}
                    >
                      Find Matches
                    </ClayButton>
                    <CyanButton
                      size="lg"
                      w="full"
                      leftIcon={<Icon as={FiMessageCircle} />}
                      onClick={() => navigate("/messaging")}
                    >
                      View Messages
                    </CyanButton>
                    <OutlineButton
                      size="lg"
                      w="full"
                      leftIcon={<Icon as={FiHeart} />}
                      onClick={() => navigate("/profile")}
                    >
                      Edit Profile
                    </OutlineButton>
                  </SimpleGrid>
                </ClayCardBody>
              </ClayCard>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
