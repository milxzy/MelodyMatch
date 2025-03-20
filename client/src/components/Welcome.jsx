// Welcome - Profile completion with Kawaii Cute design
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Text,
  Flex,
  Center,
  Alert,
  AlertIcon,
  VStack,
  Icon,
  Select,
  Circle,
  HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiCheck, FiMusic, FiUser, FiStar } from "react-icons/fi";
import LoadingState from "./LoadingState";
import { 
  ClayCard, 
  ClayCardBody, 
  ClayButton,
  FloatingShapes 
} from "./ui";
import { GlowInput } from "./ui/GlowInput";

const MotionBox = motion(Box);

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const Welcome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  const [form, setForm] = useState({
    contactInfo: "",
    preferredName: "",
    age: "",
    gender: "",
    beEmail: "",
  });

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo._id || userInfo.id;

      const response = await fetch(`${API_URL}/getUserById/${userId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error("No user data returned");
      }

      if (!data.connectedPlatforms || data.connectedPlatforms.length === 0) {
        navigate("/migrate");
        return;
      }

      setUserData(data);
      
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load your music data. Please try again or connect a music platform.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [navigate, fetchUserData]);

  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo._id || userInfo.id;

      const profileData = {
        userId,
        contactInfo: form.contactInfo,
        preferredName: form.preferredName,
        age: form.age,
        gender: form.gender,
        beEmail: form.beEmail,
        artists: userData.aggregatedArtists || [],
        genres: userData.aggregatedGenres || [],
      };

      const response = await fetch(`${API_URL}/addUserInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile information");
      }

      setForm({ contactInfo: "", preferredName: "", age: "", gender: "", beEmail: "" });
      navigate("/profile");
    } catch (error) {
      console.error("Error submitting profile:", error);
      setError(error.message || "Failed to save profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden">
        <FloatingShapes variant="subtle" />
        <Flex align="center" justify="center" minH="100vh" position="relative" zIndex={1}>
          <LoadingState 
            variant="spinner" 
            message="Loading your profile..." 
            size="large"
          />
        </Flex>
      </Box>
    );
  }

  return (
    <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden">
      <FloatingShapes variant="subtle" />
      
      <Flex align="center" justify="center" minH="100vh" px={4} position="relative" zIndex={1}>
        <Center>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            w="full"
            maxW="500px"
          >
            <ClayCard>
              <ClayCardBody p={8}>
                <VStack spacing={6} align="stretch">
                  {/* Header */}
                  <VStack spacing={3} textAlign="center">
                    <Circle size="70px" bg="kawaii.pink">
                      <Icon as={FiUser} boxSize={8} color="white.pure" />
                    </Circle>
                    <Heading
                      fontFamily="heading"
                      fontSize="xl"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      Complete Your Profile
                    </Heading>
                    <HStack spacing={2}>
                      {['kawaii.pink', 'kawaii.lilac', 'kawaii.mint'].map((color, i) => (
                        <Circle key={i} size="8px" bg={color} />
                      ))}
                    </HStack>
                  </VStack>

                  {/* Error Alert */}
                  {error && (
                    <Alert 
                      status="error" 
                      borderRadius="2xl"
                      bg="rgba(255, 71, 87, 0.15)"
                      border="2px solid"
                      borderColor="error"
                    >
                      <AlertIcon color="error" />
                      <Text fontFamily="body" fontSize="sm" color="error">{error}</Text>
                    </Alert>
                  )}

                  {/* Success Alert */}
                  {userData && (
                    <Alert 
                      status="success" 
                      borderRadius="2xl"
                      bg="rgba(181, 234, 221, 0.15)"
                      border="2px solid"
                      borderColor="kawaii.mint"
                    >
                      <Circle size="32px" bg="kawaii.mint" mr={3}>
                        <Icon as={FiMusic} color="white.pure" boxSize={4} />
                      </Circle>
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontFamily="body" fontWeight="bold" fontSize="sm" color="text.primary">
                          Music data imported!
                        </Text>
                        <Text fontFamily="body" fontSize="xs" color="text.muted">
                          {userData.aggregatedArtists?.length || 0} artists, {userData.aggregatedGenres?.length || 0} genres
                        </Text>
                      </VStack>
                      <Circle size="24px" bg="kawaii.mint">
                        <Icon as={FiCheck} color="white.pure" boxSize={3} />
                      </Circle>
                    </Alert>
                  )}

                  {/* Form */}
                  <form onSubmit={onSubmit}>
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel fontFamily="body" fontWeight="semibold">Contact Info</FormLabel>
                        <GlowInput
                          placeholder="Snapchat / Phone Number / Etc..."
                          value={form.contactInfo}
                          onChange={(e) => updateForm({ contactInfo: e.target.value })}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontFamily="body" fontWeight="semibold">Preferred Name</FormLabel>
                        <GlowInput
                          placeholder="What should people call you?"
                          value={form.preferredName}
                          onChange={(e) => updateForm({ preferredName: e.target.value })}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontFamily="body" fontWeight="semibold">Age</FormLabel>
                        <GlowInput
                          type="number"
                          placeholder="18+"
                          value={form.age}
                          onChange={(e) => updateForm({ age: e.target.value })}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontFamily="body" fontWeight="semibold">Gender (Optional)</FormLabel>
                        <Select
                          value={form.gender}
                          onChange={(e) => updateForm({ gender: e.target.value })}
                          bg="surface.muted"
                          border="2px solid"
                          borderColor="rgba(255, 200, 210, 0.12)"
                          borderRadius="2xl"
                          color="text.primary"
                          h="48px"
                          _hover={{ borderColor: "rgba(255, 200, 210, 0.2)" }}
                          _focus={{ borderColor: "kawaii.lilac", boxShadow: "0 0 0 1px rgba(212, 191, 255, 0.5)" }}
                        >
                          <option value="" style={{ background: '#1A1A2E' }}>Select gender</option>
                          <option value="male" style={{ background: '#1A1A2E' }}>Male</option>
                          <option value="female" style={{ background: '#1A1A2E' }}>Female</option>
                          <option value="non-binary" style={{ background: '#1A1A2E' }}>Non-binary</option>
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel fontFamily="body" fontWeight="semibold">Email</FormLabel>
                        <GlowInput
                          type="email"
                          placeholder="you@example.com"
                          value={form.beEmail}
                          onChange={(e) => updateForm({ beEmail: e.target.value })}
                        />
                      </FormControl>

                      <ClayButton
                        type="submit"
                        w="full"
                        size="lg"
                        isLoading={submitting}
                        loadingText="Saving..."
                        mt={2}
                        rightIcon={<Icon as={FiStar} />}
                      >
                        Complete Registration
                      </ClayButton>
                    </Stack>
                  </form>
                </VStack>
              </ClayCardBody>
            </ClayCard>
          </MotionBox>
        </Center>
      </Flex>
    </Box>
  );
};

export default Welcome;
