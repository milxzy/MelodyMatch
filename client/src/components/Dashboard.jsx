import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  Spinner,
  Progress,
  Card,
  CardBody,
  Icon,
  Flex,
  Button,
} from "@chakra-ui/react";
import { FiHeart, FiUsers, FiMessageCircle, FiMusic } from "react-icons/fi";
import Header from "./Header";

const apiUrl = import.meta.env.VITE_API_URL || 'https://melodymatch-3ro0.onrender.com';

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
      // fetch user's full data
      const userResponse = await fetch(`${apiUrl}/getUserById/${userId}`);
      const userData = await userResponse.json();

      // fetch matches
      const matchesResponse = await fetch(`${apiUrl}/getMatches/${userId}`);
      const matchesData = await matchesResponse.json();
      const matches = matchesData.matches || [];

      // calculate stats
      const totalLikes = userData.user?.likedUsers?.length || 0;
      const totalMatches = matches.length;
      const matchRate = totalLikes > 0 ? Math.round((totalMatches / totalLikes) * 100) : 0;

      // get top genres from user's profile
      const topGenres = userData.user?.genres?.slice(0, 5) || [];

      setStats({
        totalLikes,
        totalMatches,
        totalMessages: 0, // this would require querying the messages collection
        profileViews: Math.floor(Math.random() * 100) + 20, // placeholder
        topGenres,
        recentMatches: matches.slice(0, 3),
        matchRate,
      });

      setLoading(false);
    } catch (error) {
      console.error("error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Flex minHeight="100vh" bg="#232136" align="center" justify="center">
          <Spinner size="xl" color="#eb6f92" thickness="4px" />
        </Flex>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box bg="#232136" minHeight="100vh" py={8}>
        <Container maxW="container.xl">
          {/* welcome section */}
          <VStack spacing={4} align="stretch" mb={8}>
            <HStack spacing={4}>
              <Avatar
                size="xl"
                src={userInfo?.profile_pic}
                name={userInfo?.preferred_name}
                border="3px solid"
                borderColor="#eb6f92"
              />
              <Box>
                <Heading size="xl" color="#e0def4">
                  welcome back, {userInfo?.preferred_name || "user"}!
                </Heading>
                <Text color="#908caa" fontSize="lg" mt={2}>
                  here's what's happening with your music connections
                </Text>
              </Box>
            </HStack>
          </VStack>

          <Divider borderColor="#6e6a86" mb={8} />

          {/* stats grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <Card bg="#2a273f" border="1px solid" borderColor="#393552">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <Box>
                      <StatLabel color="#908caa">total likes</StatLabel>
                      <StatNumber color="#e0def4" fontSize="3xl">
                        {stats.totalLikes}
                      </StatNumber>
                      <StatHelpText color="#6e6a86">
                        people you liked
                      </StatHelpText>
                    </Box>
                    <Icon as={FiHeart} boxSize={10} color="#eb6f92" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="#2a273f" border="1px solid" borderColor="#393552">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <Box>
                      <StatLabel color="#908caa">matches</StatLabel>
                      <StatNumber color="#e0def4" fontSize="3xl">
                        {stats.totalMatches}
                      </StatNumber>
                      <StatHelpText color="#6e6a86">
                        mutual connections
                      </StatHelpText>
                    </Box>
                    <Icon as={FiUsers} boxSize={10} color="#9ccfd8" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="#2a273f" border="1px solid" borderColor="#393552">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <Box>
                      <StatLabel color="#908caa">match rate</StatLabel>
                      <StatNumber color="#e0def4" fontSize="3xl">
                        {stats.matchRate}%
                      </StatNumber>
                      <StatHelpText color="#6e6a86">
                        success rate
                      </StatHelpText>
                    </Box>
                    <Box>
                      <Progress
                        value={stats.matchRate}
                        size="sm"
                        colorScheme="pink"
                        borderRadius="full"
                        width="60px"
                      />
                    </Box>
                  </HStack>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="#2a273f" border="1px solid" borderColor="#393552">
              <CardBody>
                <Stat>
                  <HStack justify="space-between">
                    <Box>
                      <StatLabel color="#908caa">profile views</StatLabel>
                      <StatNumber color="#e0def4" fontSize="3xl">
                        {stats.profileViews}
                      </StatNumber>
                      <StatHelpText color="#6e6a86">
                        this week
                      </StatHelpText>
                    </Box>
                    <Icon as={FiMessageCircle} boxSize={10} color="#f6c177" />
                  </HStack>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* your top genres */}
            <Card bg="#2a273f" border="1px solid" borderColor="#393552">
              <CardBody>
                <HStack mb={4}>
                  <Icon as={FiMusic} color="#eb6f92" boxSize={6} />
                  <Heading size="md" color="#e0def4">
                    your top genres
                  </Heading>
                </HStack>
                <VStack align="stretch" spacing={3}>
                  {stats.topGenres.length > 0 ? (
                    stats.topGenres.map((genre, index) => (
                      <HStack key={index} justify="space-between">
                        <HStack>
                          <Badge
                            bg="#393552"
                            color="#eb6f92"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontWeight="bold"
                          >
                            #{index + 1}
                          </Badge>
                          <Text color="#e0def4" textTransform="capitalize">
                            {genre}
                          </Text>
                        </HStack>
                      </HStack>
                    ))
                  ) : (
                    <Text color="#908caa" textAlign="center" py={4}>
                      no genres found. update your spotify profile!
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* recent matches */}
            <Card bg="#2a273f" border="1px solid" borderColor="#393552">
              <CardBody>
                <HStack mb={4} justify="space-between">
                  <HStack>
                    <Icon as={FiUsers} color="#9ccfd8" boxSize={6} />
                    <Heading size="md" color="#e0def4">
                      recent matches
                    </Heading>
                  </HStack>
                  <Button
                    size="sm"
                    bg="#eb6f92"
                    color="#e0def4"
                    _hover={{ bg: "#d45879" }}
                    onClick={() => navigate("/messaging")}
                  >
                    view all
                  </Button>
                </HStack>
                <VStack align="stretch" spacing={3}>
                  {stats.recentMatches.length > 0 ? (
                    stats.recentMatches.map((match) => (
                      <HStack
                        key={match._id}
                        p={3}
                        bg="#393552"
                        borderRadius="lg"
                        _hover={{ bg: "#524f67", cursor: "pointer" }}
                        onClick={() => navigate("/messaging")}
                      >
                        <Avatar
                          src={match.profile_pic}
                          name={match.preferred_name}
                          size="md"
                        />
                        <Box flex={1}>
                          <Text color="#e0def4" fontWeight="bold">
                            {match.preferred_name}
                          </Text>
                          <Text color="#908caa" fontSize="sm">
                            {match.age} years old
                          </Text>
                        </Box>
                        <Badge bg="#eb6f92" color="#e0def4" px={2} py={1}>
                          new match!
                        </Badge>
                      </HStack>
                    ))
                  ) : (
                    <Text color="#908caa" textAlign="center" py={4}>
                      no matches yet. start swiping!
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* quick actions */}
          <Card bg="#2a273f" border="1px solid" borderColor="#393552" mt={6}>
            <CardBody>
              <Heading size="md" color="#e0def4" mb={4}>
                quick actions
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Button
                  size="lg"
                  bg="#393552"
                  color="#e0def4"
                  _hover={{ bg: "#524f67" }}
                  onClick={() => navigate("/matches")}
                  leftIcon={<Icon as={FiUsers} />}
                >
                  find matches
                </Button>
                <Button
                  size="lg"
                  bg="#393552"
                  color="#e0def4"
                  _hover={{ bg: "#524f67" }}
                  onClick={() => navigate("/messaging")}
                  leftIcon={<Icon as={FiMessageCircle} />}
                >
                  view messages
                </Button>
                <Button
                  size="lg"
                  bg="#393552"
                  color="#e0def4"
                  _hover={{ bg: "#524f67" }}
                  onClick={() => navigate("/profile")}
                  leftIcon={<Icon as={FiHeart} />}
                >
                  edit profile
                </Button>
              </SimpleGrid>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
