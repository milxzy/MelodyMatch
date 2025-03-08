import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      bg="#232136"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={6}>
        <Heading size="4xl" color="#eb6f92">
          404
        </Heading>
        <Heading size="xl" color="#e0def4">
          Page Not Found
        </Heading>
        <Text color="#908caa" textAlign="center" maxW="md">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
        </Text>
        <Button
          bg="#eb6f92"
          color="white"
          size="lg"
          onClick={() => navigate('/')}
          _hover={{ bg: "#d64d73" }}
        >
          Go Home
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound;
