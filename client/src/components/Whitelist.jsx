
import { Box, Text, useColorModeValue } from '@chakra-ui/react';

const Whitelist = () => {
  const bgColor = useColorModeValue('rose.100', 'rose.900');
  const textColor = useColorModeValue('rose.800', 'rose.100');

  return (
    <Box
      p={8}
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      maxW="600px"
      mx="auto"
      my={8}
    >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        color={textColor}
        mb={4}
        textAlign="center"
      >
        Whitelist Required
      </Text>
      <Text
        fontSize="md"
        color={textColor}
        textAlign="center"
      >
        To access this content, your account needs to be whitelisted.
      </Text>
    </Box>
  );
};

export default Whitelist;
