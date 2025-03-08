
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import Header from './Header';

const TermsOfService = () => {
  return (
    <>
      <Header />
      <Box bg="#232136" minH="100vh" py={8}>
        <Container maxW="container.lg">
          <VStack spacing={6} align="stretch">
            <Heading color="#eb6f92" size="2xl">
              Terms of Service
            </Heading>
            <Text color="#908caa" fontSize="sm">
              Last updated: February 2025
            </Text>

            <Box color="#e0def4" lineHeight="tall">
              <Heading size="md" color="#eb6f92" mb={3}>
                1. Acceptance of Terms
              </Heading>
              <Text mb={4}>
                By accessing MelodyMatch, you agree to be bound by these Terms of Service
                and all applicable laws and regulations.
              </Text>

              <Heading size="md" color="#eb6f92" mb={3}>
                2. User Conduct
              </Heading>
              <Text mb={4}>
                You agree to use the service respectfully and not to harass, abuse, or harm
                other users. Violations may result in account termination.
              </Text>

              <Heading size="md" color="#eb6f92" mb={3}>
                3. Account Termination
              </Heading>
              <Text mb={4}>
                We reserve the right to terminate accounts that violate these terms or
                engage in inappropriate behavior.
              </Text>

              <Heading size="md" color="#eb6f92" mb={3}>
                4. Disclaimer
              </Heading>
              <Text mb={4}>
                MelodyMatch is provided &quot;as is&quot; without warranties. We are not responsible
                for interactions between users outside our platform.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default TermsOfService;
