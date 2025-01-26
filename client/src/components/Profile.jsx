import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";
import apiClient from "../spotify";
const spotify = new SpotifyWebApi();
import ProfileCard from "./ProfileCard";
import { Center, Square, Circle, Heading } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Stack, HStack, VStack, Flex, Box } from '@chakra-ui/react'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import UserProfileCard from "./UserProfileCard";

const Profile = () => {
  const location = useLocation();
  const sharedVariable = location.state?.sharedVariable;
  const userData = JSON.parse(localStorage.getItem("userInfo")) 
  console.log(userData);
  const [user, setUser] = useState({
    age: "",
    artists: [],
    contactInfo: "",
    country: "",
    email: "",
    gender: "",
    genres: [],
    preferredName: "",
    spotifyDisplayName: "",
    spotifyId: "",
    profilePic: "",
  });

  const navigate = useNavigate()

  async function getMainUser() {
    console.log(userData.email);
    const api = await fetch(
      `http://localhost:4000/getSingleUser?keyword=${userData.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    const data = await api.json()
    console.log(data)
    console.log(JSON.stringify(data.searchedUser))
    setUser({
      age: data.searchedUser.age || "",
      artists: data.searchedUser.artists || [],
      contactInfo: data.searchedUser.contact_info || "",
      country: data.searchedUser.country || "",
      email: data.searchedUser.email || "",
      gender: data.searchedUser.gender || "",
      genres: data.searchedUser.genres || [],
      preferredName: data.searchedUser.preferred_name || "",
      spotifyDisplayName: data.searchedUser.spotify_display_name || "",
      spotifyId: data.searchedUser.spotify_id || "",
      profilePic: data.searchedUser.profile_pic || "",
    });
  }

  useEffect(() => {
     const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    console.log(user)
    getMainUser();
  }, []);

  const goToMatches = () => {
    navigate('/matches')
  }


  return (
    <>

    <Header></Header>
    <Center bg='#232136' height="100vh" >

    <VStack  >
<Heading as='h3' color="#eb6f92">My Profile</Heading>
    

    
<UserProfileCard
  name={user.preferredName}
  genres={user.genres}
  age={user.age}
  country={user.country}
  profilePic={user.profilePic}
/>

    </VStack>
    </Center>
    </>
  );
};

export default Profile;
