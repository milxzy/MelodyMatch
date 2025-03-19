// NotFound - 404 page with Kawaii Cute design
import { Box, Heading, Text, VStack, Icon, Circle } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiHome, FiMusic } from 'react-icons/fi';
import { ClayCard, ClayCardBody, ClayButton, FloatingShapes } from './ui';

const MotionBox = motion(Box);

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      bg="surface.base"
      minH="100vh"
      position="relative"
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <FloatingShapes variant="subtle" />
      
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        position="relative"
        zIndex={1}
        px={4}
      >
        <ClayCard maxW="500px">
          <ClayCardBody py={16} textAlign="center">
            <VStack spacing={6}>
              {/* 404 Text */}
              <Heading
                fontFamily="heading"
                fontSize="8xl"
                fontWeight="bold"
                bgGradient="linear(135deg, kawaii.pink, kawaii.lilac, kawaii.mint)"
                bgClip="text"
                lineHeight="1"
              >
                404
              </Heading>

              {/* Icon */}
              <Circle size="80px" bg="kawaii.pink">
                <Icon as={FiMusic} boxSize={10} color="white.pure" />
              </Circle>

              {/* Text */}
              <VStack spacing={2}>
                <Heading
                  fontFamily="heading"
                  fontSize="xl"
                  fontWeight="bold"
                  color="text.primary"
                >
                  Page Not Found
                </Heading>
                <Text fontFamily="body" color="text.muted" maxW="md">
                  The page you&apos;re looking for doesn&apos;t exist. 
                  It might have been moved or deleted.
                </Text>
              </VStack>

              {/* Button */}
              <ClayButton
                size="lg"
                leftIcon={<Icon as={FiHome} />}
                onClick={() => navigate('/')}
              >
                Go Home
              </ClayButton>
            </VStack>
          </ClayCardBody>
        </ClayCard>
      </MotionBox>
    </Box>
  );
};

export default NotFound;
