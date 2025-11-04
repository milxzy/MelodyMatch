import { Spinner, Box, Text } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh" // full viewport height
    >
      <Spinner size="xl" color="teal.500" />
      <Text ml={4} fontSize="lg" color="teal.500">
        Loading...
      </Text>
    </Box>
  );
};

export default Loader;
