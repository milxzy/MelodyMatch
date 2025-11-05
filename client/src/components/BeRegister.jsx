import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { FiMail, FiLock, FiUser, FiArrowLeft } from "react-icons/fi";
import Loader from "./Loader";

const BeRegister = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loginName, setLoginName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowedAccess, setAllowedAccess] = useState(false);

  useEffect(() => {
    setAllowedAccess(false);
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/spotify");
    }
  }, [navigate]);

  const goToLogin = () => {
    navigate("/belogin");
  };

  const goBack = () => {
    navigate("/");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginName || !email || !pass || !confirmPass) {
      setError("Please fill in all fields");
      return;
    }

    if (pass !== confirmPass) {
      setError("Passwords do not match");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/registeruser",
        {
          loginName,
          email,
          pass,
          allowedAccess,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/whitelist");
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "An error occurred during registration. Please try again."
      );
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Creating your account..." />;
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
                Create Account
              </Heading>
              <Text color="#908caa" fontSize="md">
                Join MelodyMatch and find your musical soulmate
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

            {/* Registration Form */}
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <VStack spacing={5} w="100%">
                <FormControl isRequired>
                  <FormLabel color="#e0def4" fontSize="sm" fontWeight="medium">
                    Name
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiUser} color="#908caa" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
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
                      placeholder="Create a password"
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

                <FormControl isRequired>
                  <FormLabel color="#e0def4" fontSize="sm" fontWeight="medium">
                    Confirm Password
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="#908caa" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
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
                  loadingText="Creating account..."
                  fontWeight="bold"
                  letterSpacing="wide"
                >
                  Sign Up
                </Button>
              </VStack>
            </form>

            {/* Divider */}
            <Divider borderColor="#393552" />

            {/* Login link */}
            <Text color="#908caa" fontSize="sm">
              Already have an account?{" "}
              <Link
                color="#eb6f92"
                fontWeight="bold"
                onClick={goToLogin}
                _hover={{ color: "#f6c177", textDecoration: "underline" }}
              >
                Sign In
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Center>
  );
};

export default BeRegister;