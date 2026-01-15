import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Center, Square, Circle } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import Header from "./Header";

const API_URL = import.meta.env.VITE_API_URL;

const BeLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);


  

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/spotify");
    }
  });

  const goToRegister = () => {
    navigate("/beregister");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      setLoading(true);
      const { data } = await axios.post(
        `${API_URL}/backendlogin`,
        {
          email,
          pass,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <>
      <Center bg="#232136" h="100vh">
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pass">Pass</label>
            <input
              type="pass"
              className="form-control"
              id="pass"
              value={pass}
              placeholder="Pass"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <div>Submit</div>
          <Button colorScheme="blue" onClick={submitHandler}>
            Submit
          </Button>
        </form>
      </Center>
    </>
  );
};

export default BeLogin;
