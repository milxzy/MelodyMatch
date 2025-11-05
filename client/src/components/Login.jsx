import React, { useEffect, useState } from "react";
import { loginUrl } from "../spotify";
import { Button, Center } from "@chakra-ui/react";
import Loader from "./Loader";

const Login = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check if there's already a valid token
    const token = localStorage.getItem("token");

    // simulate an async check for loginurl (if necessary)
    if (loginUrl) {
      setLoading(false);
    }
  }, []); // empty dependency array ensures this runs only once

  if (loading) {
    // show a loading spinner while loginurl is being prepared
    return <Loader message="Preparing Spotify login..." />;
  }

  return (
    <Center bg="#232136" minH="100vh" position="relative">
      <Center
        bg="#2a273f"
        p={12}
        borderRadius="2xl"
        border="1px solid"
        borderColor="#393552"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
        flexDirection="column"
        gap={6}
        maxW="md"
      >
        <Button
          as="a"
          href={loginUrl}
          size="lg"
          bg="#1DB954"
          color="white"
          _hover={{
            bg: "#1ed760",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(29, 185, 84, 0.4)",
          }}
          _active={{ transform: "translateY(0)" }}
          transition="all 0.2s"
          fontWeight="bold"
          letterSpacing="wide"
          px={8}
          py={6}
          fontSize="md"
        >
          LOGIN WITH SPOTIFY
        </Button>
      </Center>
    </Center>
  );
};

export default Login;
