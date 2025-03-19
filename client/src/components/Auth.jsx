// Auth - Landing page with Kawaii Cute design
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Flex,
  Grid,
  GridItem,
  Circle,
  Image,
} from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { FiMusic, FiHeart, FiUsers, FiMessageCircle, FiArrowRight, FiStar } from "react-icons/fi";
import { FaApple, FaYoutube } from "react-icons/fa";
import { FloatingShapes, ClayCard, ClayCardBody, ClayButton, OutlineButton, CyanButton, PinkBadge, CyanBadge } from "./ui";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Auth = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const goToLogin = () => navigate("/belogin");
  const goToRegister = () => navigate("/beregister");

  // Cute bouncy animation
  const bounceTransition = {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  return (
    <Box bg="surface.base" minHeight="100vh" position="relative" overflow="hidden">
      <FloatingShapes variant="hero" />

      {/* Hero Section - Asymmetric Layout */}
      <Container maxW="6xl" pt={{ base: 8, md: 16 }} pb={8} px={{ base: 5, md: 8 }} position="relative" zIndex={1}>
        
        {/* Top bar with logo and sign in */}
        <Flex justify="space-between" align="center" mb={{ base: 12, md: 20 }}>
          <HStack spacing={3}>
            <Circle 
              size="45px" 
              bg="kawaii.pink" 
              boxShadow="0 4px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.4)"
            >
              <Icon as={FiMusic} boxSize={5} color="white.pure" />
            </Circle>
            <Text fontFamily="heading" fontSize="xl" fontWeight="bold" color="text.primary">
              MelodyMatch
            </Text>
          </HStack>
          
          <HStack spacing={3}>
            <Text 
              fontFamily="body" 
              fontSize="sm" 
              color="text.muted"
              display={{ base: "none", md: "block" }}
            >
              Already have an account?
            </Text>
            <OutlineButton size="sm" onClick={goToLogin}>
              Sign In
            </OutlineButton>
          </HStack>
        </Flex>

        {/* Main Hero - Two Column Asymmetric */}
        <Grid 
          templateColumns={{ base: "1fr", lg: "1.1fr 0.9fr" }}
          gap={{ base: 10, lg: 16 }}
          alignItems="center"
          mb={{ base: 16, md: 24 }}
        >
          {/* Left - Text Content */}
          <GridItem>
            <MotionBox
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <VStack align={{ base: "center", lg: "flex-start" }} spacing={6} textAlign={{ base: "center", lg: "left" }}>
                {/* Cute tag */}
                <HStack spacing={2}>
                  <PinkBadge>New</PinkBadge>
                  <Text fontFamily="body" fontSize="sm" color="text.muted">
                    Music-powered dating
                  </Text>
                </HStack>

                {/* Main headline - staggered lines */}
                <Box>
                  <Heading
                    fontFamily="heading"
                    fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                    fontWeight="bold"
                    color="text.primary"
                    lineHeight="1.1"
                    mb={2}
                  >
                    Find someone who
                  </Heading>
                  <Heading
                    fontFamily="heading"
                    fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
                    fontWeight="bold"
                    bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
                    bgClip="text"
                    lineHeight="1.1"
                  >
                    gets your music
                  </Heading>
                </Box>

                <Text
                  fontFamily="body"
                  fontSize={{ base: "lg", md: "xl" }}
                  color="text.secondary"
                  maxW="480px"
                  lineHeight="1.7"
                >
                  Connect your music library and discover people who share your vibe. 
                  Because the best relationships start with the same playlist.
                </Text>

                {/* CTA Buttons - stacked on mobile, side by side on desktop */}
                <HStack spacing={4} pt={4} flexDir={{ base: "column", sm: "row" }} w={{ base: "full", sm: "auto" }}>
                  <ClayButton
                    size="lg"
                    onClick={goToRegister}
                    w={{ base: "full", sm: "auto" }}
                    rightIcon={<Icon as={FiArrowRight} />}
                  >
                    Get Started Free
                  </ClayButton>
                </HStack>

                {/* Social proof mini */}
                <HStack spacing={3} pt={2}>
                  <HStack spacing={-2}>
                    {[...Array(4)].map((_, i) => (
                      <Circle
                        key={i}
                        size="32px"
                        bg={['kawaii.pink', 'kawaii.lilac', 'kawaii.mint', 'kawaii.peach'][i]}
                        border="2px solid"
                        borderColor="surface.base"
                        boxShadow="sm"
                      >
                        <Icon as={FiHeart} boxSize={3} color="white.pure" />
                      </Circle>
                    ))}
                  </HStack>
                  <Text fontFamily="body" fontSize="sm" color="text.muted">
                    Join music lovers finding love
                  </Text>
                </HStack>
              </VStack>
            </MotionBox>
          </GridItem>

          {/* Right - Visual/Card Stack */}
          <GridItem display={{ base: "none", lg: "block" }}>
            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              position="relative"
              h="450px"
            >
              {/* Decorative circles */}
              <Circle
                size="180px"
                bg="rgba(212, 191, 255, 0.15)"
                position="absolute"
                top="-20px"
                right="-30px"
                zIndex={0}
              />
              <Circle
                size="120px"
                bg="rgba(255, 181, 186, 0.12)"
                position="absolute"
                bottom="40px"
                left="-40px"
                zIndex={0}
              />

              {/* Main match card */}
              <MotionBox
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
                transition={bounceTransition}
              >
                <ClayCard w="280px">
                  <ClayCardBody p={5}>
                    <VStack spacing={4}>
                      <Circle size="80px" bg="kawaii.lilac" boxShadow="md">
                        <Icon as={FiMusic} boxSize={8} color="white.pure" />
                      </Circle>
                      <VStack spacing={1}>
                        <Text fontFamily="heading" fontWeight="bold" color="text.primary">
                          Sarah, 24
                        </Text>
                        <Text fontFamily="body" fontSize="sm" color="text.muted">
                          Indie & Alternative
                        </Text>
                      </VStack>
                      <HStack spacing={2} flexWrap="wrap" justify="center">
                        <CyanBadge size="sm">Arctic Monkeys</CyanBadge>
                        <PinkBadge size="sm">The 1975</PinkBadge>
                      </HStack>
                      <Box 
                        w="full" 
                        bg="rgba(181, 234, 221, 0.2)" 
                        borderRadius="full" 
                        p={2}
                        textAlign="center"
                      >
                        <Text fontFamily="body" fontSize="sm" fontWeight="bold" color="kawaii.mint">
                          87% Match
                        </Text>
                      </Box>
                    </VStack>
                  </ClayCardBody>
                </ClayCard>
              </MotionBox>

              {/* Floating mini cards */}
              <MotionBox
                position="absolute"
                top="20px"
                left="0"
                animate={shouldReduceMotion ? {} : { y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{ ...bounceTransition, delay: 0.3 }}
              >
                <ClayCard w="140px">
                  <ClayCardBody p={3}>
                    <HStack spacing={2}>
                      <Circle size="32px" bg="kawaii.pink">
                        <Icon as={FiHeart} boxSize={4} color="white.pure" />
                      </Circle>
                      <Text fontFamily="body" fontSize="xs" color="text.secondary">
                        New Match!
                      </Text>
                    </HStack>
                  </ClayCardBody>
                </ClayCard>
              </MotionBox>

              <MotionBox
                position="absolute"
                bottom="30px"
                right="10px"
                animate={shouldReduceMotion ? {} : { y: [0, -6, 0], rotate: [0, -2, 0] }}
                transition={{ ...bounceTransition, delay: 0.5 }}
              >
                <ClayCard w="160px">
                  <ClayCardBody p={3}>
                    <HStack spacing={2}>
                      <Circle size="32px" bg="kawaii.mint">
                        <Icon as={FiMessageCircle} boxSize={4} color="white.pure" />
                      </Circle>
                      <VStack spacing={0} align="start">
                        <Text fontFamily="body" fontSize="xs" fontWeight="bold" color="text.primary">
                          Alex
                        </Text>
                        <Text fontFamily="body" fontSize="xs" color="text.muted">
                          Love that song!
                        </Text>
                      </VStack>
                    </HStack>
                  </ClayCardBody>
                </ClayCard>
              </MotionBox>
            </MotionBox>
          </GridItem>
        </Grid>

        {/* How it works - Horizontal scroll on mobile, grid on desktop */}
        <Box mb={{ base: 16, md: 24 }}>
          <VStack spacing={8} mb={10}>
            <HStack spacing={3}>
              <Circle size="36px" bg="kawaii.lilac">
                <Icon as={FiStar} boxSize={4} color="white.pure" />
              </Circle>
              <Heading fontFamily="heading" fontSize={{ base: "xl", md: "2xl" }} color="text.primary">
                How it works
              </Heading>
            </HStack>
          </VStack>

          <Grid 
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={6}
          >
            {[
              { 
                num: "01", 
                title: "Connect your music", 
                desc: "Link your Apple Music to share your taste",
                color: "kawaii.pink",
                icon: FaApple
              },
              { 
                num: "02", 
                title: "Get matched", 
                desc: "Our algorithm finds your musical soulmates",
                color: "kawaii.lilac",
                icon: FiHeart
              },
              { 
                num: "03", 
                title: "Start chatting", 
                desc: "Connect and bond over shared favorites",
                color: "kawaii.mint",
                icon: FiMessageCircle
              },
            ].map((step, idx) => (
              <MotionBox
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <ClayCard h="full">
                  <ClayCardBody p={6}>
                    <VStack align="flex-start" spacing={4}>
                      <HStack justify="space-between" w="full">
                        <Text 
                          fontFamily="heading" 
                          fontSize="3xl" 
                          fontWeight="bold" 
                          color={step.color}
                          opacity={0.5}
                        >
                          {step.num}
                        </Text>
                        <Circle size="45px" bg={step.color}>
                          <Icon as={step.icon} boxSize={5} color="white.pure" />
                        </Circle>
                      </HStack>
                      <Text fontFamily="heading" fontSize="lg" fontWeight="bold" color="text.primary">
                        {step.title}
                      </Text>
                      <Text fontFamily="body" fontSize="sm" color="text.muted" lineHeight="1.6">
                        {step.desc}
                      </Text>
                    </VStack>
                  </ClayCardBody>
                </ClayCard>
              </MotionBox>
            ))}
          </Grid>
        </Box>

        {/* Platform support - compact */}
        <Box mb={{ base: 16, md: 24 }}>
          <ClayCard>
            <ClayCardBody py={6} px={8}>
              <Flex 
                direction={{ base: "column", md: "row" }}
                align="center" 
                justify="space-between"
                gap={6}
              >
                <HStack spacing={4}>
                  <Text fontFamily="body" color="text.secondary">
                    Works with
                  </Text>
                  <HStack spacing={3}>
                    <HStack 
                      spacing={2} 
                      bg="surface.elevated" 
                      px={4} 
                      py={2} 
                      borderRadius="full"
                      border="2px solid"
                      borderColor="rgba(255, 200, 210, 0.12)"
                    >
                      <Icon as={FaApple} boxSize={5} color="#FF2D55" />
                      <Text fontFamily="body" fontSize="sm" fontWeight="bold" color="text.primary">
                        Apple Music
                      </Text>
                    </HStack>
                    <HStack 
                      spacing={2} 
                      bg="surface.elevated" 
                      px={4} 
                      py={2} 
                      borderRadius="full"
                      border="2px solid"
                      borderColor="rgba(255, 200, 210, 0.12)"
                      opacity={0.5}
                    >
                      <Icon as={FaYoutube} boxSize={5} color="#FF0000" />
                      <Text fontFamily="body" fontSize="sm" color="text.muted">
                        Soon
                      </Text>
                    </HStack>
                  </HStack>
                </HStack>

                <CyanButton size="md" onClick={goToRegister} rightIcon={<Icon as={FiArrowRight} />}>
                  Start Matching
                </CyanButton>
              </Flex>
            </ClayCardBody>
          </ClayCard>
        </Box>

        {/* Footer - minimal */}
        <Flex 
          justify="space-between" 
          align="center" 
          pt={8}
          borderTop="1px solid"
          borderColor="rgba(255, 200, 210, 0.1)"
          flexDir={{ base: "column", md: "row" }}
          gap={4}
        >
          <HStack spacing={3}>
            <Circle size="32px" bg="kawaii.pink">
              <Icon as={FiMusic} boxSize={4} color="white.pure" />
            </Circle>
            <Text fontFamily="heading" fontSize="sm" color="text.muted">
              MelodyMatch
            </Text>
          </HStack>

          <HStack spacing={6}>
            <Text 
              as="a" 
              href="/privacy" 
              fontFamily="body" 
              fontSize="sm" 
              color="text.muted"
              _hover={{ color: "kawaii.pink" }}
              cursor="pointer"
            >
              Privacy
            </Text>
            <Text 
              as="a" 
              href="/terms" 
              fontFamily="body" 
              fontSize="sm" 
              color="text.muted"
              _hover={{ color: "kawaii.pink" }}
              cursor="pointer"
            >
              Terms
            </Text>
          </HStack>

          <Text fontFamily="body" fontSize="sm" color="text.muted">
            Made with <Icon as={FiHeart} boxSize={3} color="kawaii.pink" mx={1} /> and music
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Auth;
