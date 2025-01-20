import React from "react";
import { useEffect, useState } from "react";

import { loginUrl } from "../spotify";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Center, Square, Circle, Spinner, } from "@chakra-ui/react";
import Header from "./Header";


// if loginUrl is empty, show loading screen,
//when loginUrl is populated 


const Login = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    removePriorKey();
    console.log('removed')
    if(loginUrl){
      setLoading(false)
    }
  }, [])

  const removePriorKey = () => {
    localStorage.removeItem('token');
  };
  return (
    <>
      <Center bg="#232136" h="100vh">
        <div className="login">
          <img src="" alt="" />
          <Button colorScheme="green" >
            <a href={loginUrl}>LOGIN WITH SPOTIFY</a>
          </Button>
        </div>
      </Center>
    </>
  );
};

export default Login;
