import React, { useEffect, useState } from "react";
import { loginUrl } from "../spotify";
import {
  Button,
  Center,
  Spinner,
  VStack,
  Heading,
  Text,
  Box,
  Icon,
  Container,
} from "@chakra-ui/react";
import { FaSpotify, FaMusic } from "react-icons/fa";

const Login = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check if there's already a valid token
    const token = localStorage.getItem("token");

    // simulate an async check for loginurl (if necessary)
    if (loginUrl) {
      setLoading(false);
    }
  }, []); // empty dependency array ensures this runs only once

  if (loading) {
    // show a loading spinner while loginurl is being prepared
    return (
      <Center bg="#232136" h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="#eb6f92" thickness="4px" />
          <Text color="white">Preparing login...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Center bg="#232136" minHeight="100vh" p={4}>
      <Container maxW="500px">
        <VStack spacing={8} p={8} bg="#2a273f" borderRadius="xl" boxShadow="2xl">
          <Icon as={FaMusic} boxSize={20} color="#eb6f92" />

          <VStack spacing={3}>
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, #eb6f92, #f6c177)"
              bgClip="text"
              fontWeight="extrabold"
              textAlign="center"
            >
              MelodyMatch
            </Heading>
            <Text color="#e0def4" fontSize="lg" textAlign="center">
              Find your perfect match through music
            </Text>
          </VStack>

          <Box bg="#393552" p={6} borderRadius="md" w="full">
            <VStack spacing={3} color="#e0def4">
              <Text fontSize="md" textAlign="center">
                🎵 Connect through your music taste
              </Text>
              <Text fontSize="md" textAlign="center">
                💕 Match with people who share your vibe
              </Text>
              <Text fontSize="md" textAlign="center">
                💬 Chat and discover new music together
              </Text>
            </VStack>
          </Box>

          <Button
            as="a"
            href={loginUrl}
            size="lg"
            bg="#1DB954"
            color="white"
            _hover={{ bg: "#1ed760", transform: "scale(1.05)" }}
            _active={{ bg: "#1aa34a" }}
            leftIcon={<Icon as={FaSpotify} boxSize={6} />}
            w="full"
            py={7}
            fontSize="lg"
            fontWeight="bold"
            borderRadius="full"
            transition="all 0.2s"
            boxShadow="lg"
          >
            LOGIN WITH SPOTIFY
          </Button>

          <Text color="#6e6a86" fontSize="sm" textAlign="center">
            By logging in, you agree to connect your Spotify account
          </Text>
        </VStack>
      </Container>
    </Center>
  );
};

export default Login;
