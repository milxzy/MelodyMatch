// BeRegister - Registration page with Kawaii Cute design
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container,
  Heading, 
  FormControl, 
  FormLabel, 
  VStack, 
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  Icon,
  useToast,
  Flex,
  HStack,
  Circle,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiMusic, FiHeart, FiArrowRight, FiStar } from 'react-icons/fi';
import { FloatingShapes, ClayCard, ClayCardBody, ClayButton, OutlineButton } from './ui';
import { GlowInput } from './ui/GlowInput';

const MotionBox = motion(Box);

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const BeRegister = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loginName, setLoginName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/profile");
    }
  }, [navigate]);

  const goToLogin = () => navigate("/belogin");
  const goHome = () => navigate("/");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!loginName || !email || !pass || !confirmPass) {
      setError('Please fill in all fields');
      return;
    }
    
    if (pass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }
    
    if (pass.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      const config = {
        headers: { "Content-type": "application/json" },
      };
      
      const { data } = await axios.post(
        `${API_URL}/registeruser`,
        { loginName, email, pass },
        config
      );
      
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      
      toast({
        title: 'Welcome to MelodyMatch!',
        description: 'Your account is ready',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      
      if (!data.hasCompletedMigration && data.connectedPlatforms?.length === 0) {
        navigate("/migrate");
      } else {
        navigate("/profile");
      }

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="surface.base" minHeight="100vh" position="relative" overflow="hidden">
      <FloatingShapes variant="subtle" />
      
      <Container maxW="6xl" py={8} px={{ base: 5, md: 8 }} position="relative" zIndex={1}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={12}>
          <HStack spacing={3} cursor="pointer" onClick={goHome}>
            <Circle size="40px" bg="kawaii.lilac">
              <Icon as={FiMusic} boxSize={5} color="white.pure" />
            </Circle>
            <Text fontFamily="heading" fontSize="lg" fontWeight="bold" color="text.primary">
              MelodyMatch
            </Text>
          </HStack>
          
          <HStack spacing={3}>
            <Text fontFamily="body" fontSize="sm" color="text.muted" display={{ base: "none", md: "block" }}>
              Already have an account?
            </Text>
            <OutlineButton size="sm" onClick={goToLogin}>
              Sign In
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
                  Join the
                </Heading>
                <Heading
                  fontFamily="heading"
                  fontSize={{ base: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  bgGradient="linear(135deg, kawaii.lilac, kawaii.pink)"
                  bgClip="text"
                  lineHeight="1.2"
                >
                  MelodyMatch
                </Heading>
                <Heading
                  fontFamily="heading"
                  fontSize={{ base: "3xl", lg: "4xl" }}
                  fontWeight="bold"
                  color="text.primary"
                  lineHeight="1.2"
                >
                  community
                </Heading>
                <Text fontFamily="body" fontSize="lg" color="text.secondary" maxW="400px" pt={2}>
                  Create your account and start finding people who vibe with your music taste.
                </Text>
              </VStack>
            </MotionBox>

            {/* Feature highlights */}
            <VStack align="flex-start" spacing={3} pt={4}>
              {[
                { icon: FiHeart, text: "Find your music soulmate", color: "kawaii.pink" },
                { icon: FiMusic, text: "Connect Spotify or Apple Music", color: "kawaii.lilac" },
                { icon: FiStar, text: "Match based on real taste", color: "kawaii.mint" },
              ].map((item, i) => (
                <MotionBox
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                >
                  <HStack spacing={3}>
                    <Circle size="36px" bg={item.color}>
                      <Icon as={item.icon} boxSize={4} color="white.pure" />
                    </Circle>
                    <Text fontFamily="body" color="text.secondary">{item.text}</Text>
                  </HStack>
                </MotionBox>
              ))}
            </VStack>
          </VStack>

          {/* Right - Register Form */}
          <Box flex="1" maxW="420px" w="full">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ClayCard>
                <ClayCardBody p={8}>
                  <VStack spacing={5}>
                    {/* Mobile Logo */}
                    <VStack spacing={3} display={{ base: "flex", lg: "none" }}>
                      <Circle size="60px" bg="kawaii.lilac">
                        <Icon as={FiMusic} boxSize={7} color="white.pure" />
                      </Circle>
                      <Heading fontFamily="heading" fontSize="xl" color="text.primary">
                        Create Account
                      </Heading>
                    </VStack>

                    {/* Desktop Header */}
                    <VStack spacing={1} display={{ base: "none", lg: "flex" }} w="full" align="flex-start">
                      <Heading fontFamily="heading" fontSize="2xl" color="text.primary">
                        Create Account
                      </Heading>
                      <Text fontFamily="body" fontSize="sm" color="text.muted">
                        Join MelodyMatch in just a few steps
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

                    {/* Form */}
                    <Box as="form" onSubmit={submitHandler} w="full">
                      <VStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontFamily="body" fontWeight="semibold" color="text.secondary">
                            Name
                          </FormLabel>
                          <InputGroup>
                            <GlowInput
                              type="text"
                              value={loginName}
                              placeholder="Your name"
                              onChange={(e) => setLoginName(e.target.value)}
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
                              <Icon as={FiUser} color="text.muted" />
                            </Box>
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontFamily="body" fontWeight="semibold" color="text.secondary">
                            Email
                          </FormLabel>
                          <InputGroup>
                            <GlowInput
                              type="email"
                              value={email}
                              placeholder="you@example.com"
                              onChange={(e) => setEmail(e.target.value)}
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
                              placeholder="At least 6 characters"
                              onChange={(e) => setPass(e.target.value)}
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
                                _hover={{ color: "kawaii.lilac", bg: "transparent" }}
                                size="sm"
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontFamily="body" fontWeight="semibold" color="text.secondary">
                            Confirm Password
                          </FormLabel>
                          <InputGroup>
                            <GlowInput
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPass}
                              placeholder="Type your password again"
                              onChange={(e) => setConfirmPass(e.target.value)}
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
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                icon={<Icon as={showConfirmPassword ? FiEyeOff : FiEye} />}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                variant="ghost"
                                color="text.muted"
                                _hover={{ color: "kawaii.lilac", bg: "transparent" }}
                                size="sm"
                              />
                            </InputRightElement>
                          </InputGroup>
                        </FormControl>

                        <ClayButton
                          type="submit"
                          w="full"
                          size="lg"
                          isLoading={isLoading}
                          loadingText="Creating account..."
                          rightIcon={<Icon as={FiArrowRight} />}
                          mt={2}
                        >
                          Create Account
                        </ClayButton>
                      </VStack>
                    </Box>

                    {/* Footer */}
                    <Text fontFamily="body" fontSize="sm" color="text.muted" pt={2}>
                      Already have an account?{' '}
                      <Link 
                        color="kawaii.lilac"
                        fontWeight="bold"
                        onClick={goToLogin}
                        _hover={{ color: "kawaii.pink" }}
                        cursor="pointer"
                      >
                        Sign in
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

export default BeRegister;
