import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Icon,
  Link,
  Divider,
} from "@chakra-ui/react";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import Loader from "./Loader";

const BeLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/spotify");
    }
  }, [navigate]);

  const goToRegister = () => {
    navigate("/beregister");
  };

  const goBack = () => {
    navigate("/");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !pass) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/backendlogin",
        {
          email,
          pass,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/spotify");
    } catch (error) {
      console.error("An error occurred:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while logging in. Please try again."
      );
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Logging in..." />;
  }

  return (
    <Center bg="#232136" minH="100vh" position="relative">
      {/* Back button */}
      <Button
        position="absolute"
        top={6}
        left={6}
        variant="ghost"
        color="#908caa"
        _hover={{ color: "#e0def4", bg: "#2a273f" }}
        leftIcon={<Icon as={FiArrowLeft} />}
        onClick={goBack}
      >
        Back
      </Button>

      <Container maxW="md">
        <Box
          bg="#2a273f"
          p={8}
          borderRadius="2xl"
          border="1px solid"
          borderColor="#393552"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
        >
          <VStack spacing={6}>
            {/* Header */}
            <VStack spacing={2} textAlign="center">
              <Heading
                size="xl"
                bgGradient="linear(to-r, #eb6f92, #f6c177)"
                bgClip="text"
              >
                Welcome Back
              </Heading>
              <Text color="#908caa" fontSize="md">
                Sign in to continue your musical journey
              </Text>
            </VStack>

            {/* Error Alert */}
            {error && (
              <Alert
                status="error"
                bg="#eb6f92"
                color="#e0def4"
                borderRadius="lg"
              >
                <AlertIcon color="#e0def4" />
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <VStack spacing={5} w="100%">
                <FormControl isRequired>
                  <FormLabel color="#e0def4" fontSize="sm" fontWeight="medium">
                    Email Address
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMail} color="#908caa" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg="#232136"
                      border="1px solid"
                      borderColor="#393552"
                      color="#e0def4"
                      _placeholder={{ color: "#6e6a86" }}
                      _hover={{ borderColor: "#eb6f92" }}
                      _focus={{
                        borderColor: "#eb6f92",
                        boxShadow: "0 0 0 1px #eb6f92",
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="#e0def4" fontSize="sm" fontWeight="medium">
                    Password
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="#908caa" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      bg="#232136"
                      border="1px solid"
                      borderColor="#393552"
                      color="#e0def4"
                      _placeholder={{ color: "#6e6a86" }}
                      _hover={{ borderColor: "#eb6f92" }}
                      _focus={{
                        borderColor: "#eb6f92",
                        boxShadow: "0 0 0 1px #eb6f92",
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
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
                  isLoading={loading}
                  loadingText="Logging in..."
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            {/* Divider */}
            <Divider borderColor="#393552" />

            {/* Sign up link */}
            <Text color="#908caa" fontSize="sm">
              Don't have an account?{" "}
              <Link
                color="#eb6f92"
                fontWeight="bold"
                onClick={goToRegister}
                _hover={{ color: "#f6c177", textDecoration: "underline" }}
              >
                Sign Up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Center>
  );
};

export default BeLogin;
