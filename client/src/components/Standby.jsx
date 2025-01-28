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
  if(token){
    localStorage.setItem("token", token);
    async function getUsername() {
      try {
        const myProfileResponse = await apiClient.get("me");
        const username = myProfileResponse.data.id;
        setSearchTerm(username);
        return username; // Add this line
      } catch (error) {
        console.error("Error getting username:", error);
      }
    }
    getUsername();
  }


  }, []);
  useEffect(() => {
    async function checkDB() {
      console.log(searchTerm);
      console.log(`checking on ${searchTerm}`);
      const sharedVariable = searchTerm;
      if (searchTerm !== "") {
        await fetch(
          ` https://melodymatch-3ro0.onrender.com/databaseLookup?keyword=${searchTerm}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then(console.log("front"))
          .then((data) => {
            if (data == "found") {
              console.log("user found");
              console.log(data);
              navigate("/profile", { state: { sharedVariable } });
            } else {
              console.log("user not found");
              navigate("/welcome");
            }
          });
      }
    }
    checkDB();
  }, [searchTerm]);

  useEffect(() => {
    const sharedVariable = "hello";
    console.log(
      ageState,
      artistState,
      contactInfoState,
      countryState,
      contactInfoState,
      countryState,
      emailState,
      genderState,
      genreState,
      preferredNameState,
      spotifyDisplayNameState,
      spotifyIdState
    );
    console.log("Ultimate state" + ultimateState);
  }, [spotifyIdState]);

  return (
    <>
      <h1>Loading</h1>
    </>
  );
};

export default Standby; 