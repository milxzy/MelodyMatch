import { Spinner, Box, VStack } from '@chakra-ui/react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="#232136"
    >
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <VStack spacing={6}>
        <Box position="relative">
          {/* Outer spinning ring */}
          <Spinner
            size="xl"
            color="#eb6f92"
            thickness="4px"
            speed="0.8s"
            emptyColor="#393552"
          />
          {/* Inner pulsing ring */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="40px"
            height="40px"
            borderRadius="full"
            bg="#eb6f92"
            opacity="0.3"
            sx={{
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        </Box>
        <Box
          fontSize="lg"
          fontWeight="medium"
          color="#e0def4"
          letterSpacing="wide"
          sx={{
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          {message}
        </Box>
      </VStack>
    </Box>
  );
};

export default Loader;
