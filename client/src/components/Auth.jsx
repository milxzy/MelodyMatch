import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaMusic, FaHeart, FaUserFriends, FaSpotify, FaComments, FaFire, FaYoutube, FaApple } from "react-icons/fa";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const goToLogin = () => {
    navigate("/belogin");
  };

  const goToRegister = () => {
    navigate("/beregister");
  };

  const goToSpotifyLogin = () => {
    navigate("/spotify");
  };

  const features = [
    { icon: FaSpotify, title: "Spotify Integration", description: "Connect your Spotify to showcase your unique music taste", color: "#1DB954" },
    { icon: FaHeart, title: "Smart Matching", description: "AI-powered algorithm matches you based on music compatibility", color: "#eb6f92" },
    { icon: FaUserFriends, title: "Find Your Vibe", description: "Discover people who share your musical interests", color: "#f6c177" },
    { icon: FaComments, title: "Real-time Chat", description: "Connect instantly with your matches and talk about music", color: "#9ccfd8" },
  ];

  return (
    <Box bg="#232136" minHeight="100vh" position="relative">
      <Box position="absolute" top="10%" left="10%" opacity="0.1" animation={`${float} 6s ease-in-out infinite`} display={{ base: "none", md: "block" }}>
        <Icon as={FaMusic} boxSize={32} color="#eb6f92" />
      </Box>
      <Box position="absolute" bottom="15%" right="15%" opacity="0.1" animation={`${float} 8s ease-in-out infinite`} animationDelay="1s" display={{ base: "none", md: "block" }}>
        <Icon as={FaHeart} boxSize={24} color="#f6c177" />
      </Box>
      <Box position="absolute" top="50%" right="5%" opacity="0.08" animation={`${float} 7s ease-in-out infinite`} animationDelay="2s" display={{ base: "none", lg: "block" }}>
        <Icon as={FaMusic} boxSize={20} color="#9ccfd8" />
      </Box>

      <Container maxW="7xl" py={{ base: 8, md: 12, lg: 20 }} px={{ base: 4, md: 6 }} position="relative" zIndex={1}>
        <VStack spacing={{ base: 8, md: 12, lg: 16 }}>
          <VStack spacing={{ base: 6, md: 8 }} textAlign="center" w="full">
            <Box animation={`${pulse} 3s ease-in-out infinite`}>
              <Icon as={FaMusic} boxSize={{ base: 12, md: 16, lg: 20 }} color="#eb6f92" />
            </Box>

            <VStack spacing={{ base: 3, md: 4 }}>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", sm: "4xl", md: "6xl", lg: "7xl" }}
                fontWeight="extrabold"
                bgGradient="linear(to-r, #eb6f92, #f6c177, #9ccfd8)"
                bgClip="text"
                lineHeight="shorter"
                px={{ base: 4, md: 0 }}
              >
                MelodyMatch
              </Heading>

              <Text
                fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
                color="#e0def4"
                fontWeight="medium"
                maxW="3xl"
                px={{ base: 4, md: 6 }}
              >
                Where music becomes the language of love
              </Text>

              <Text
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                color="#908caa"
                maxW="2xl"
                px={{ base: 6, md: 8 }}
              >
                Connect with people who share your musical soul. Let your Spotify playlist
                find your perfect match.
              </Text>
            </VStack>

            <VStack spacing={{ base: 3, md: 4 }} pt={{ base: 2, md: 4 }} w={{ base: "full", md: "auto" }} px={{ base: 4, md: 0 }}>
              <Button
                size={{ base: "md", md: "lg" }}
                bg="#eb6f92"
                color="white"
                _hover={{ bg: "#d45879", transform: "translateY(-2px)", boxShadow: "xl" }}
                _active={{ bg: "#c24d6b" }}
                onClick={goToRegister}
                px={{ base: 6, md: 8 }}
                py={{ base: 6, md: 7 }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                borderRadius="full"
                transition="all 0.3s"
                boxShadow="lg"
                leftIcon={<Icon as={FaFire} />}
                w={{ base: "full", sm: "auto" }}
              >
                Get Started Free
              </Button>

              <Button
                size={{ base: "md", md: "lg" }}
                variant="outline"
                borderColor="#908caa"
                color="#e0def4"
                _hover={{
                  bg: "#393552",
                  borderColor: "#eb6f92",
                  transform: "translateY(-2px)",
                  boxShadow: "xl",
                }}
                onClick={goToLogin}
                px={{ base: 6, md: 8 }}
                py={{ base: 6, md: 7 }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                borderRadius="full"
                transition="all 0.3s"
                w={{ base: "full", sm: "auto" }}
              >
                Sign In
              </Button>

              <Button
                size={{ base: "md", md: "lg" }}
                bg="#1DB954"
                color="white"
                _hover={{ bg: "#1ed760", transform: "translateY(-2px)", boxShadow: "xl" }}
                _active={{ bg: "#1aa34a" }}
                onClick={goToSpotifyLogin}
                px={{ base: 6, md: 8 }}
                py={{ base: 6, md: 7 }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                borderRadius="full"
                transition="all 0.3s"
                boxShadow="lg"
                leftIcon={<Icon as={FaSpotify} />}
                w={{ base: "full", sm: "auto" }}
              >
                Connect Spotify
              </Button>
            </VStack>

            <Box mt={{ base: 6, md: 8 }} p={{ base: 4, md: 6 }} bg="#2a273f" borderRadius="xl" maxW="600px">
              <VStack spacing={3}>
                <Text
                  color="#e0def4"
                  fontSize={{ base: "sm", md: "md" }}
                  fontWeight="semibold"
                >
                  More Music Services Coming Soon
                </Text>
                <HStack spacing={6} flexWrap="wrap" justifyContent="center">
                  <VStack spacing={2}>
                    <Box p={3} bg="#393552" borderRadius="lg" opacity={0.6}>
                      <Icon as={FaYoutube} boxSize={{ base: 6, md: 8 }} color="#FF0000" />
                    </Box>
                    <Text color="#908caa" fontSize={{ base: "xs", md: "sm" }}>YouTube Music</Text>
                    <Text color="#eb6f92" fontSize="xs" fontWeight="bold" textTransform="uppercase">Coming Soon</Text>
                  </VStack>
                  <VStack spacing={2}>
                    <Box p={3} bg="#393552" borderRadius="lg" opacity={0.6}>
                      <Icon as={FaApple} boxSize={{ base: 6, md: 8 }} color="#FC3C44" />
                    </Box>
                    <Text color="#908caa" fontSize={{ base: "xs", md: "sm" }}>Apple Music</Text>
                    <Text color="#eb6f92" fontSize="xs" fontWeight="bold" textTransform="uppercase">Coming Soon</Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          </VStack>

          <Box w="full" pt={{ base: 4, md: 8 }} px={{ base: 4, md: 0 }}>
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: 4, md: 6, lg: 8 }} w="full">
              {features.map((feature, idx) => (
                <Box key={idx} bg="#2a273f" p={{ base: 6, md: 8 }} borderRadius="xl" boxShadow="lg" transition="all 0.3s"
                  _hover={{ transform: "translateY(-8px)", boxShadow: "2xl", bg: "#393552" }} cursor="pointer">
                  <VStack spacing={{ base: 3, md: 4 }} align="center">
                    <Box bg="#393552" p={{ base: 3, md: 4 }} borderRadius="full" transition="all 0.3s" _groupHover={{ transform: "scale(1.1)" }}>
                      <Icon as={feature.icon} boxSize={{ base: 6, md: 8 }} color={feature.color} />
                    </Box>
                    <Heading as="h3" size={{ base: "sm", md: "md" }} color="#e0def4" textAlign="center">{feature.title}</Heading>
                    <Text color="#908caa" fontSize={{ base: "xs", md: "sm" }} textAlign="center">{feature.description}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          <Flex w="full" bg="#2a273f" borderRadius="2xl" p={{ base: 8, md: 12 }} justifyContent="space-around" flexWrap="wrap" gap={{ base: 6, md: 8 }} mx={{ base: 4, md: 0 }}>
            <VStack spacing={{ base: 1, md: 2 }}>
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} bgGradient="linear(to-r, #eb6f92, #f6c177)" bgClip="text">100%</Heading>
              <Text color="#908caa" fontSize={{ base: "sm", md: "md" }}>Music-Based</Text>
            </VStack>
            <VStack spacing={{ base: 1, md: 2 }}>
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} bgGradient="linear(to-r, #eb6f92, #f6c177)" bgClip="text">Real-time</Heading>
              <Text color="#908caa" fontSize={{ base: "sm", md: "md" }}>Messaging</Text>
            </VStack>
            <VStack spacing={{ base: 1, md: 2 }}>
              <Heading fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} bgGradient="linear(to-r, #eb6f92, #f6c177)" bgClip="text">Smart</Heading>
              <Text color="#908caa" fontSize={{ base: "sm", md: "md" }}>AI Matching</Text>
            </VStack>
          </Flex>

          <Box w="full" textAlign="center" bg="linear-gradient(135deg, #2a273f 0%, #393552 100%)"
            borderRadius="2xl" p={{ base: 8, md: 12 }} boxShadow="xl" mx={{ base: 4, md: 0 }}>
            <VStack spacing={{ base: 3, md: 4 }}>
              <Heading color="#e0def4" size={{ base: "md", md: "lg" }} px={{ base: 4, md: 0 }}>
                Ready to find your musical soulmate?
              </Heading>
              <Text color="#908caa" fontSize={{ base: "md", md: "lg" }} px={{ base: 4, md: 0 }}>
                Join thousands of music lovers finding connections through melody
              </Text>
              <Button size={{ base: "md", md: "lg" }} bg="#eb6f92" color="white"
                _hover={{ bg: "#d45879", transform: "scale(1.05)" }} onClick={goToRegister}
                px={{ base: 8, md: 10 }} py={{ base: 6, md: 7 }} fontSize={{ base: "lg", md: "xl" }}
                fontWeight="bold" borderRadius="full" transition="all 0.3s" boxShadow="lg"
                mt={{ base: 2, md: 4 }} w={{ base: "90%", sm: "auto" }}>
                Start Matching Now
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Auth;
