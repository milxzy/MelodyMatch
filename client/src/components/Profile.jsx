import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";
import apiClient from "../spotify";
const spotify = new SpotifyWebApi();
import ProfileCard from "./ProfileCard";
import { Center, Square, Circle, Heading, Spinner, Text, Alert, AlertIcon } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Stack, HStack, VStack, Flex, Box } from '@chakra-ui/react'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import UserProfileCard from "./UserProfileCard";

const API_URL = import.meta.env.VITE_API_URL;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  async function getMainUser() {
    try {
      setLoading(true);
      setError(null);
      console.log(userData.email);
      const api = await fetch(
        `${API_URL}/getsingleuser?keyword=${userData.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!api.ok) {
        throw new Error(`Failed to fetch user data: ${api.statusText}`);
      }

      const data = await api.json()
      console.log(data)
      console.log(JSON.stringify(data.searchedUser))

      if (!data.searchedUser) {
        throw new Error("User data not found");
      }

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
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
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
    <Center bg='#232136' minHeight="100vh" >
      {loading ? (
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#eb6f92"
            size="xl"
          />
          <Text color="white">Loading profile...</Text>
        </VStack>
      ) : error ? (
        <VStack spacing={4}>
          <Alert status="error" borderRadius="md" maxW="500px">
            <AlertIcon />
            {error}
          </Alert>
          <Button colorScheme="pink" onClick={getMainUser}>
            Try Again
          </Button>
        </VStack>
      ) : (
        <VStack>
          <Heading as='h3' color="#eb6f92">My Profile</Heading>
          <UserProfileCard
            name={user.preferredName}
            genres={user.genres}
            age={user.age}
            country={user.country}
            profilePic={user.profilePic}
          />
        </VStack>
      )}
    </Center>
    </>
  );
};

export default Profile;
