import { React, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Center,
  Container,
  HStack,
} from "@chakra-ui/react";

const ProfileQuestion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleSkip = () => {
    navigate("/matches");
  };

  return (
    <>
      <Header />
      <Center bg="#232136" minHeight="100vh">
        <Container maxW="600px">
          <VStack spacing={8} p={8} bg="#908caa" borderRadius="lg" boxShadow="xl">
            <Heading as="h2" size="xl" color="#232136" textAlign="center">
              Profile Setup Complete!
            </Heading>

            <Text fontSize="lg" color="#232136" textAlign="center">
              Your profile has been created successfully. Would you like to view your profile or start exploring matches?
            </Text>

            <Box bg="#232136" p={6} borderRadius="md" w="full">
              <VStack spacing={3} color="white">
                <Text fontSize="md">
                  ✓ Your music preferences have been imported
                </Text>
                <Text fontSize="md">
                  ✓ Your profile is ready to be discovered
                </Text>
                <Text fontSize="md">
                  ✓ You can now start matching with others
                </Text>
              </VStack>
            </Box>

            <HStack spacing={4} width="full">
              <Button
                flex={1}
                size="lg"
                bg="#eb6f92"
                color="white"
                _hover={{ bg: "#d45879" }}
                onClick={handleViewProfile}
              >
                View My Profile
              </Button>
              <Button
                flex={1}
                size="lg"
                variant="outline"
                borderColor="#232136"
                color="#232136"
                _hover={{ bg: "#232136", color: "white" }}
                onClick={handleSkip}
              >
                Start Matching
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Center>
    </>
  );
};

export default ProfileQuestion;
