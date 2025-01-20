import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AbsoluteCenter, Heading } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Center, Square, Circle } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import Header from "./Header";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const goToLogin = () => {
    navigate("/belogin");
  };

  const goToRegister = () => {
    navigate("/beregister");
  };

  return (
    <>
      <Center bg="#232136" h="100vh">
        <AbsoluteCenter w="50%" p="10px">
          <Box>
            <Heading
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontSize="6l"
              fontWeight="extrabold"
            >
              Welcome to MelodyMatch
            </Heading>
            <Text
              as="b"
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              bgClip="text"
              fontSize="2l"
              fontWeight="extrabold"
            >
              Find your perfect harmony
            </Text>
            <br />
            <Button mr="3%" colorScheme="blue" onClick={goToLogin}>
              Login
            </Button>
            <Button colorScheme="blue" onClick={goToRegister}>
              Signup
            </Button>
          </Box>
        </AbsoluteCenter>
      </Center>
    </>
  );
};

export default Auth;
