import React, { useState, useEffect } from "react";
import apiClient from "../spotify";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

const Standby = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ageState, setAgeState] = useState("");
  const [artistState, setArtistState] = useState("");
  const [contactInfoState, setContactInfoState] = useState("");
  const [countryState, setCountryState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [genderState, setGenderState] = useState("");
  const [genreState, setGenreState] = useState([]);
  const [preferredNameState, setPreferredNameState] = useState("");
  const [spotifyDisplayNameState, setSpotifyDisplayNameState] = useState("");
  const [spotifyIdState, setSpotifyIdState] = useState("");
  const [profielePicState, setProfilePicState] = useState("");
  const [ultimateState, setUltimateState] = useState([]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem("token", token);
      async function getUsername() {
        try {
          const myProfileResponse = await apiClient.get("me");
          const username = myProfileResponse.data.id;
          setSearchTerm(username);
        } catch (error) {
          console.error("Error getting username:", error);
        }
      }
      getUsername();
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchTerm !== "") {
      async function checkDB() {
        console.log("Checking for user:", searchTerm);
        const sharedVariable = searchTerm;
        const response = await fetch(
          `https://melodymatch-3ro0.onrender.com/databaseLookup?keyword=${searchTerm}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Database response:", data);
        if (data === "found") {
          console.log("User found");
          navigate("/profile", { state: { sharedVariable } });
        } else {
          console.log("User not found");
          navigate("/welcome");
        }
      }
      checkDB();
    }
  }, [searchTerm, navigate]);

  useEffect(() => {
    console.log(
      "Age:", ageState,
      "Artist:", artistState,
      "Contact Info:", contactInfoState,
      "Country:", countryState,
      "Email:", emailState,
      "Gender:", genderState,
      "Genre:", genreState,
      "Preferred Name:", preferredNameState,
      "Spotify Display Name:", spotifyDisplayNameState,
      "Spotify ID:", spotifyIdState,
      "Profile Pic:", profielePicState,
      "Ultimate State:", ultimateState
    );
  }, [spotifyIdState]);

  return (
    <>
      <h1>Loading</h1>
    </>
  );
};

export default Standby;
