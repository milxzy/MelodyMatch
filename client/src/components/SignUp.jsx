import React from "react";
import { useState } from "react";
import { fileURLToPath } from "url";
import { useNavigate } from "react-router";
import Header from "./Header";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function handleUserNameChange(e) {
    setUsername((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  }

  function handlePasswordChange(e) {
    setPassword((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(username, password),
      });
      if (!response.ok) {
        throw new Error("Failed to sign up");
      }
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("db_token", data.token);
        navigate("/Profile");
      } else {
        alert("login failed");
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
    setUsername("");
    setPassword("");
  }

  return (
    <>
      <h1>Sign Up Page</h1>
      <label htmlFor="username">username</label>
      <input
        type="text"
        placeholder="username"
        name="username"
        id="username"
        onChange={handleUserNameChange}
      />
      <label htmlFor="password">password</label>
      <input
        type="password"
        name="password"
        placeholder="password"
        id="password"
        onChange={handlePasswordChange}
      />
      <button onClick={onSubmit}>submit</button>
    </>
  );
};

export default SignUp;
