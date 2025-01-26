import React, { useEffect, useState } from "react";
import { loginUrl } from "../spotify";
import { Button, Center, Spinner } from "@chakra-ui/react";

const Login = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's already a valid token
    const token = localStorage.getItem("token");



    // Simulate an async check for loginUrl (if necessary)
    if (loginUrl) {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    // Show a loading spinner while loginUrl is being prepared
    return (
      <Center bg="#232136" h="100vh">
        <Spinner size="xl" color="green.500" />
      </Center>
    );
  }

  return (
    <Center bg="#232136" h="100vh">
      <div className="login">
        <img src="" alt="" />
        <Button colorScheme="green">
          <a href={loginUrl}>LOGIN WITH SPOTIFY</a>
        </Button>
      </div>
    </Center>
  );
};

export default Login;
