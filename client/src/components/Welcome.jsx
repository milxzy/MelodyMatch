import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Flex,
  Center,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import LoadingState from "./LoadingState";

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

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/belogin");
      return;
    }

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo._id || userInfo.id;

      // Fetch user data from backend (includes aggregated music data)
      const response = await fetch(`${API_URL}/getUserById/${userId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error("No user data returned");
      }

      // Check if user has connected platforms
      if (!data.connectedPlatforms || data.connectedPlatforms.length === 0) {
        // Redirect to migration wizard
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
  };

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
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
        // Music data is already stored in the database from platform connection
        artists: userData.aggregatedArtists || [],
        genres: userData.aggregatedGenres || [],
      };

      const response = await fetch(`${API_URL}/addUserInfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile information");
      }

      const data = await response.json();
      console.log("Profile saved:", data);

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
      <Flex
        align="center"
        justify="center"
        bg="#232136"
        minHeight="100vh"
        color="white"
        px={4}
      >
        <LoadingState 
          variant="spinner" 
          message="Loading your profile..." 
          size="large"
        />
      </Flex>
    );
  }

  return (
    <>
      <Flex
        align="center"
        justify="center"
        bg="#232136"
        minHeight="100vh"
        color="white"
        px={4}
      >
        <Center>
          <Box
            bg="#2a273f"
            borderRadius="lg"
            p={8}
            width="100%"
            maxW="500px"
            boxShadow="lg"
          >
            <Heading
              as="h1"
              size="lg"
              mb={6}
              textAlign="center"
              color="#eb6f92"
            >
              Complete Your Profile
            </Heading>

            {error && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {userData && (
              <Alert status="success" mb={4} borderRadius="md" bg="#31748F20">
                <AlertIcon color="#31748F" />
                <VStack align="start" spacing={0} flex={1}>
                  <Text color="#E0DEF4" fontWeight="bold" fontSize="sm">
                    Music data imported successfully!
                  </Text>
                  <Text color="#908CAA" fontSize="xs">
                    {userData.aggregatedArtists?.length || 0} artists, {userData.aggregatedGenres?.length || 0} genres
                  </Text>
                </VStack>
              </Alert>
            )}

            <form onSubmit={onSubmit}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="contactInfo" color="#eb6f92">
                    Contact Info
                  </FormLabel>
                  <Input
                    id="contactInfo"
                    type="text"
                    placeholder="Snapchat / Phone Number / Etc..."
                    value={form.contactInfo}
                    onChange={(e) =>
                      updateForm({ contactInfo: e.target.value })
                    }
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="preferredName" color="#eb6f92">
                    Preferred Name
                  </FormLabel>
                  <Input
                    id="preferredName"
                    type="text"
                    placeholder="Preferred Name"
                    value={form.preferredName}
                    onChange={(e) =>
                      updateForm({ preferredName: e.target.value })
                    }
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="age" color="#eb6f92">
                    Age
                  </FormLabel>
                  <Input
                    id="age"
                    type="text"
                    placeholder="18+"
                    value={form.age}
                    onChange={(e) => updateForm({ age: e.target.value })}
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="gender" color="#eb6f92">
                    Gender (Optional)
                  </FormLabel>
                  <Input
                    id="gender"
                    type="text"
                    placeholder="Gender"
                    value={form.gender}
                    onChange={(e) => updateForm({ gender: e.target.value })}
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel htmlFor="email" color="#eb6f92">
                    Email
                  </FormLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={form.beEmail}
                    onChange={(e) => updateForm({ beEmail: e.target.value })}
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="#eb6f92"
                  color="white"
                  _hover={{ bg: "#d45879" }}
                  mt={4}
                  w="full"
                  size="lg"
                  isLoading={submitting}
                  loadingText="Saving..."
                >
                  Complete Registration
                </Button>
              </Stack>
            </form>
          </Box>
        </Center>
      </Flex>
    </>
  );
};

export default Welcome;
