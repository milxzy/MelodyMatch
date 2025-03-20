
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import Header from './Header';

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <Box bg="#232136" minH="100vh" py={8}>
        <Container maxW="container.lg">
          <VStack spacing={6} align="stretch">
            <Heading color="#eb6f92" size="2xl">
              Privacy Policy
            </Heading>
            <Text color="#908caa" fontSize="sm">
              Last updated: February 2025
            </Text>

            <Box color="#e0def4" lineHeight="tall">
              <Heading size="md" color="#eb6f92" mb={3}>
                1. Information We Collect
              </Heading>
              <Text mb={4}>
                We collect information you provide directly, including your music platform data
                (artists, genres, playlists), profile information, and messages with matches.
              </Text>

              <Heading size="md" color="#eb6f92" mb={3}>
                2. How We Use Your Information
              </Heading>
              <Text mb={4}>
                We use your information to match you with compatible users, improve our service,
                and communicate with you about your account.
              </Text>

              <Heading size="md" color="#eb6f92" mb={3}>
                3. Data Security
              </Heading>
              <Text mb={4}>
                We implement industry-standard security measures to protect your data,
                including encryption and secure authentication.
              </Text>

              <Heading size="md" color="#eb6f92" mb={3}>
                4. Your Rights
              </Heading>
              <Text mb={4}>
                You have the right to access, update, or delete your personal data at any time
                through your account settings.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default PrivacyPolicy;
