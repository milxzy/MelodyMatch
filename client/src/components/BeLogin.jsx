import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  Link,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { FaMusic, FaEye, FaEyeSlash } from "react-icons/fa";

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

  const goToRegister = () => {
    navigate("/beregister");
  };

  const goToMusicPlatform = () => {
    navigate("/migrate");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    // Form validation
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
        `${API_URL}/backendlogin`,
        {
          email,
          pass,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      toast({
        title: "Login successful!",
        description: "Welcome back to MelodyMatch",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setLoading(false);
      
      // Check if user has completed migration
      if (data.hasCompletedMigration) {
        navigate("/profile");
      } else {
        navigate("/migrate");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError(
        error.response?.data?.message || 
        "An error occurred while logging in. Please check your credentials and try again."
      );
      setLoading(false);
    }
  };

  return (
    <Center bg="#232136" minHeight="100vh" p={4}>
      <Container maxW="450px">
        <VStack spacing={8} p={8} bg="#2a273f" borderRadius="xl" boxShadow="2xl">
          {/* Logo and Header */}
          <Icon as={FaMusic} boxSize={16} color="#eb6f92" />

          <VStack spacing={2}>
            <Heading
              as="h1"
              size="xl"
              bgGradient="linear(to-r, #eb6f92, #f6c177)"
              bgClip="text"
              fontWeight="extrabold"
              textAlign="center"
            >
              Welcome Back
            </Heading>
            <Text color="#908caa" fontSize="md" textAlign="center">
              Sign in to continue to MelodyMatch
            </Text>
          </VStack>

          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="md" bg="#eb6f92" color="white">
              <AlertIcon color="white" />
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box as="form" onSubmit={submitHandler} w="full">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="#e0def4" fontSize="sm" fontWeight="semibold">
                  Email Address
                </FormLabel>
                <InputGroup>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    bg="#393552"
                    border="1px solid"
                    borderColor="#6e6a86"
                    color="#e0def4"
                    _hover={{ borderColor: "#eb6f92" }}
                    _focus={{ borderColor: "#eb6f92", boxShadow: "0 0 0 1px #eb6f92" }}
                    _placeholder={{ color: "#6e6a86" }}
                    size="lg"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color="#e0def4" fontSize="sm" fontWeight="semibold">
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="Enter your password"
                    bg="#393552"
                    border="1px solid"
                    borderColor="#6e6a86"
                    color="#e0def4"
                    _hover={{ borderColor: "#eb6f92" }}
                    _focus={{ borderColor: "#eb6f92", boxShadow: "0 0 0 1px #eb6f92" }}
                    _placeholder={{ color: "#6e6a86" }}
                    size="lg"
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={<Icon as={showPassword ? FaEyeSlash : FaEye} />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      color="#908caa"
                      _hover={{ color: "#eb6f92", bg: "transparent" }}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                w="full"
                size="lg"
                bg="#eb6f92"
                color="white"
                _hover={{ bg: "#d45879", transform: "translateY(-2px)" }}
                _active={{ bg: "#c24d6b" }}
                isLoading={loading}
                loadingText="Signing in..."
                fontWeight="bold"
                borderRadius="lg"
                transition="all 0.2s"
                boxShadow="md"
                mt={2}
              >
                Sign In
              </Button>
            </VStack>
          </Box>

          {/* Divider */}
          <HStack w="full" spacing={4}>
            <Divider borderColor="#6e6a86" />
            <Text color="#908caa" fontSize="sm" whiteSpace="nowrap">
              OR
            </Text>
            <Divider borderColor="#6e6a86" />
          </HStack>

          {/* Music Platform Login Button */}
          <Button
            onClick={goToMusicPlatform}
            w="full"
            size="lg"
            bg="#31748F"
            color="white"
            _hover={{ bg: "#286983", transform: "translateY(-2px)" }}
            _active={{ bg: "#1f5c76" }}
            leftIcon={<Icon as={FaMusic} boxSize={5} />}
            fontWeight="bold"
            borderRadius="lg"
            transition="all 0.2s"
            boxShadow="md"
          >
            Connect Music Platform
          </Button>

          {/* Footer Links */}
          <VStack spacing={2}>
            <Text color="#908caa" fontSize="sm">
              Don&apos;t have an account?{" "}
              <Link
                color="#eb6f92"
                fontWeight="semibold"
                onClick={goToRegister}
                _hover={{ color: "#f6c177", textDecoration: "underline" }}
                cursor="pointer"
              >
                Sign up
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Center>
  );
};

export default BeLogin;
