import React from 'react';
import { Box, Text, VStack, Heading, Center, Container, Icon, Button } from '@chakra-ui/react';
import { FaClock, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Whitelist = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <>
      <Header />
      <Center bg="#232136" minHeight="100vh">
        <Container maxW="600px">
          <VStack spacing={6} p={8} bg="#908caa" borderRadius="lg" boxShadow="xl">
            <Icon as={FaClock} boxSize={16} color="#eb6f92" />

            <Heading as="h2" size="xl" color="#232136" textAlign="center">
              Account Pending Approval
            </Heading>

            <Text fontSize="lg" color="#232136" textAlign="center" fontWeight="medium">
              Thank you for registering with MelodyMatch!
            </Text>

            <Box bg="#232136" p={6} borderRadius="md" w="full">
              <VStack spacing={4} align="start">
                <Text color="#eb6f92" fontSize="md">
                  <Icon as={FaCheckCircle} mr={2} />
                  Your account has been created successfully
                </Text>

                <Text color="white" fontSize="md">
                  Your account is currently under review. This process typically takes up to 24 hours.
                </Text>

                <Text color="white" fontSize="md">
                  Once approved, you'll be able to:
                </Text>

                <VStack align="start" pl={4} color="white" spacing={2}>
                  <Text>• Connect with Spotify and import your music taste</Text>
                  <Text>• Discover users with similar music preferences</Text>
                  <Text>• Match with people who share your musical interests</Text>
                  <Text>• Chat with your matches</Text>
                </VStack>
              </VStack>
            </Box>

            <Text fontSize="sm" color="#232136" textAlign="center" fontStyle="italic">
              We'll notify you via email once your account is approved. Please check back soon!
            </Text>

            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleLogout}
              mt={4}
            >
              Logout
            </Button>
          </VStack>
        </Container>
      </Center>
    </>
  );
};

export default Whitelist;
