// BeLogin - Login page with Kawaii Cute design
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  VStack,
  HStack,
  useToast,
  Alert,
  AlertIcon,
  Link,
  Flex,
  Circle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiMusic, FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiHeart } from "react-icons/fi";
import { FloatingShapes, ClayCard, ClayCardBody, ClayButton, OutlineButton } from "./ui";
import { GlowInput } from "./ui/GlowInput";

const MotionBox = motion(Box);

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const BeLogin = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/profile");
    }
  }, [navigate]);

  const goToRegister = () => navigate("/register");
  const goHome = () => navigate("/");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !pass) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      setLoading(true);
      const { data } = await axios.post(
        `${API_URL}/backendlogin`,
        { email, pass },
        config
      );
      
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      
      toast({
        title: "Welcome back!",
        description: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setLoading(false);
      
      if (data.hasCompletedMigration) {
        navigate("/profile");
      } else {
        navigate("/migrate");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(
        error.response?.data?.message || 
        "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <Box bg="surface.base" minHeight="100vh" position="relative" overflow="hidden">
      <FloatingShapes variant="subtle" />
      
      <Container maxW="6xl" py={8} px={{ base: 5, md: 8 }} position="relative" zIndex={1}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={12}>
          <HStack spacing={3} cursor="pointer" onClick={goHome}>
            <Circle size="40px" bg="kawaii.pink">
              <Icon as={FiMusic} boxSize={5} color="white.pure" />
            </Circle>
            <Text fontFamily="heading" fontSize="lg" fontWeight="bold" color="text.primary">
              MelodyMatch
            </Text>
          </HStack>
          
          <HStack spacing={3}>
            <Text fontFamily="body" fontSize="sm" color="text.muted" display={{ base: "none", md: "block" }}>
              Don&apos;t have an account?
            </Text>
            <OutlineButton size="sm" onClick={goToRegister}>
              Sign Up
            </OutlineButton>
          </HStack>
        </Flex>

        {/* Main Content - Two Column */}
        <Flex 
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="center"
          gap={{ base: 10, lg: 16 }}
          minH="70vh"
        >
          {/* Left - Branding */}
          <VStack 
            align={{ base: "center", lg: "flex-start" }} 
            spacing={6} 
            flex="1"
            textAlign={{ base: "center", lg: "left" }}
            display={{ base: "none", lg: "flex" }}
          >
            <MotionBox
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VStack align={{ base: "center", lg: "flex-start" }} spacing={4}>
                <Heading
                  fontFamily="heading"
                  fontSize={{ base: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  color="text.primary"
                  lineHeight="1.2"
                >
                  Welcome back to
                </Heading>
                <Heading
                  fontFamily="heading"
                  fontSize={{ base: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
                  bgClip="text"
                  lineHeight="1.2"
                >
                  MelodyMatch
                </Heading>
                <Text fontFamily="body" fontSize="lg" color="text.secondary" maxW="400px">
                  Sign in to continue finding people who share your music taste.
                </Text>
              </VStack>
            </MotionBox>

            {/* Decorative elements */}
            <HStack spacing={4} pt={4}>
              {['kawaii.pink', 'kawaii.lilac', 'kawaii.mint', 'kawaii.peach'].map((color, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                >
                  <Circle size="50px" bg={color} opacity={0.8}>
                    <Icon as={[FiMusic, FiHeart, FiMusic, FiHeart][i]} boxSize={5} color="white.pure" />
                  </Circle>
                </MotionBox>
              ))}
            </HStack>
          </VStack>

          {/* Right - Login Form */}
          <Box flex="1" maxW="420px" w="full">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ClayCard>
                <ClayCardBody p={8}>
                  <VStack spacing={6}>
                    {/* Mobile Logo */}
                    <VStack spacing={3} display={{ base: "flex", lg: "none" }}>
                      <Circle size="60px" bg="kawaii.pink">
                        <Icon as={FiMusic} boxSize={7} color="white.pure" />
                      </Circle>
                      <Heading fontFamily="heading" fontSize="xl" color="text.primary">
                        Welcome Back
                      </Heading>
                    </VStack>

                    {/* Desktop Header */}
                    <VStack spacing={1} display={{ base: "none", lg: "flex" }} w="full" align="flex-start">
                      <Heading fontFamily="heading" fontSize="2xl" color="text.primary">
                        Sign In
                      </Heading>
                      <Text fontFamily="body" fontSize="sm" color="text.muted">
                        Enter your credentials to continue
                      </Text>
                    </VStack>

                    {/* Error Alert */}
                    {error && (
                      <Alert 
                        status="error" 
                        borderRadius="xl" 
                        bg="rgba(255, 181, 181, 0.15)"
                        border="2px solid"
                        borderColor="error"
                      >
                        <AlertIcon color="error" />
                        <Text fontFamily="body" fontSize="sm" color="error">
                          {error}
                        </Text>
                      </Alert>
                    )}

                    {/* Login Form */}
                    <Box as="form" onSubmit={submitHandler} w="full">
                      <VStack spacing={5}>
                        <FormControl isRequired>
                          <FormLabel fontFamily="body" fontWeight="semibold" color="text.secondary">
                            Email
                          </FormLabel>
                          <InputGroup>
                            <GlowInput
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              pl={12}
                            />
                            <Box
                              position="absolute"
                              left={4}
                              top="50%"
                              transform="translateY(-50%)"
                              zIndex={2}
                              pointerEvents="none"
                            >
                              <Icon as={FiMail} color="text.muted" />
                            </Box>
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontFamily="body" fontWeight="semibold" color="text.secondary">
                            Password
                          </FormLabel>
                          <InputGroup>
                            <GlowInput
                              type={showPassword ? "text" : "password"}
                              value={pass}
                              onChange={(e) => setPass(e.target.value)}
                              placeholder="Enter your password"
                              pl={12}
                              pr={12}
                            />
                            <Box
                              position="absolute"
                              left={4}
                              top="50%"
                              transform="translateY(-50%)"
                              zIndex={2}
                              pointerEvents="none"
                            >
                              <Icon as={FiLock} color="text.muted" />
                            </Box>
                            <InputRightElement h="full">
                              <IconButton
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                                onClick={() => setShowPassword(!showPassword)}
                                variant="ghost"
                                color="text.muted"
                                _hover={{ color: "kawaii.pink", bg: "transparent" }}
                                size="sm"
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <ClayButton
                          type="submit"
                          w="full"
                          size="lg"
                          isLoading={loading}
                          loadingText="Signing in..."
                          rightIcon={<Icon as={FiArrowRight} />}
                        >
                          Sign In
                        </ClayButton>
                      </VStack>
                    </Box>

                    {/* Footer */}
                    <Text fontFamily="body" fontSize="sm" color="text.muted" pt={2}>
                      Don&apos;t have an account?{" "}
                      <Link
                        color="kawaii.pink"
                        fontWeight="bold"
                        onClick={goToRegister}
                        _hover={{ color: "kawaii.lilac" }}
                        cursor="pointer"
                      >
                        Sign up free
                      </Link>
                    </Text>
                  </VStack>
                </ClayCardBody>
              </ClayCard>
            </MotionBox>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default BeLogin;
