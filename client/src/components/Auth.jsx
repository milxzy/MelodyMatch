import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiMusic, FiHeart, FiUsers } from "react-icons/fi";

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

  return (
    <Center bg="#232136" minH="100vh" position="relative" overflow="hidden">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      {/* Decorative background elements */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        width="400px"
        height="400px"
        borderRadius="full"
        bg="#eb6f92"
        opacity="0.05"
        filter="blur(80px)"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="-5%"
        width="400px"
        height="400px"
        borderRadius="full"
        bg="#9ccfd8"
        opacity="0.05"
        filter="blur(80px)"
      />

      <Container maxW="container.md">
        <VStack spacing={8} sx={{ animation: 'fadeIn 0.8s ease-out' }}>
          {/* Animated music icon */}
          <Box sx={{ animation: 'float 3s ease-in-out infinite' }}>
            <Icon
              as={FiMusic}
              boxSize={16}
              color="#eb6f92"
              filter="drop-shadow(0 0 20px rgba(235, 111, 146, 0.3))"
            />
          </Box>

          {/* Main heading */}
          <VStack spacing={4} textAlign="center">
            <Heading
              bgGradient="linear(to-r, #eb6f92, #f6c177, #9ccfd8)"
              bgClip="text"
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              Welcome to MelodyMatch
            </Heading>
            <Text
              color="#908caa"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="medium"
              maxW="500px"
            >
              Find your perfect harmony. Connect with people who share your
              musical soul.
            </Text>
          </VStack>

          {/* Feature highlights */}
          <HStack
            spacing={8}
            mt={6}
            flexWrap="wrap"
            justify="center"
            color="#e0def4"
          >
            <VStack spacing={2}>
              <Icon as={FiMusic} boxSize={6} color="#eb6f92" />
              <Text fontSize="sm" color="#908caa">
                Music Matching
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Icon as={FiHeart} boxSize={6} color="#f6c177" />
              <Text fontSize="sm" color="#908caa">
                Find Connections
              </Text>
            </VStack>
            <VStack spacing={2}>
              <Icon as={FiUsers} boxSize={6} color="#9ccfd8" />
              <Text fontSize="sm" color="#908caa">
                Build Community
              </Text>
            </VStack>
          </HStack>

          {/* Action buttons */}
          <VStack spacing={4} mt={8} w="100%" maxW="400px">
            <Button
              w="100%"
              size="lg"
              bg="#eb6f92"
              color="#e0def4"
              _hover={{
                bg: "#d45879",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(235, 111, 146, 0.3)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              onClick={goToLogin}
              fontSize="md"
              fontWeight="bold"
              letterSpacing="wide"
            >
              Login
            </Button>
            <Button
              w="100%"
              size="lg"
              bg="#2a273f"
              color="#e0def4"
              border="2px solid"
              borderColor="#eb6f92"
              _hover={{
                bg: "#393552",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(235, 111, 146, 0.2)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              onClick={goToRegister}
              fontSize="md"
              fontWeight="bold"
              letterSpacing="wide"
            >
              Sign Up
            </Button>
          </VStack>

          {/* Footer text */}
          <Text color="#6e6a86" fontSize="sm" mt={8}>
            Discover music lovers near you
          </Text>
        </VStack>
      </Container>
    </Center>
  );
};

export default Auth;
