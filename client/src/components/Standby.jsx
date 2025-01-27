import React, { useState, useEffect } from "react";
import apiClient from "../spotify";
import { useNavigate } from "react-router";

const Standby = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from hash fragment
    const hashFragment = window.location.hash.substring(1); // Remove the '#'
    const params = new URLSearchParams(hashFragment);
    const token = params.get("access_token");

    if (token) {
      // Store token and set client token
      localStorage.setItem("token", token);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Fetch user profile
      apiClient
        .get("me")
        .then((response) => {
          const username = response.data.id;
          setSearchTerm(username); // Update searchTerm with the username
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    } else {
      console.error("No token found in URL.");
      navigate("/error"); // Redirect to an error page if no token is found
    }
  }, [navigate]);

  useEffect(() => {
    // Check if user exists in the database
    const checkDB = async () => {
      if (searchTerm) {
        console.log(`Checking database for: ${searchTerm}`);
        try {
          const response = await fetch(
            `https://melodymatch-3ro0.onrender.com/databaseLookup?keyword=${searchTerm}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          const data = await response.json();
          if (data === "found") {
            console.log("User found in the database.");
            navigate("/profile", { state: { username: searchTerm } });
          } else {
            console.log("User not found. Redirecting to welcome page.");
            navigate("/welcome");
          }
        } catch (error) {
          console.error("Error checking database:", error);
        }
      }
    };

    checkDB();
  }, [searchTerm, navigate]);

  return (
    <div>
      <h1>Loading...</h1>
      <p>Please wait while we process your information.</p>
    </div>
  );
};

export default Standby;