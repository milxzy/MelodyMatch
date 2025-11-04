import React, { useEffect, useState } from "react";
import { loginUrl } from "../spotify";
import { Button, Center, Spinner } from "@chakra-ui/react";

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
