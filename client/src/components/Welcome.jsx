import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// import { getTokenFromUrl } from '../spotify.js'
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";
import apiClient from "../spotify";
const spotify = new SpotifyWebApi();
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Flex,
  Center,
} from "@chakra-ui/react";

const Welcome = () => {
  const [artistState, setArtistState] = useState([]);
  const [profileState, setProfileState] = useState([]);
  const [genreState, setGenreState] = useState([]);
  const [beState, setBeState] = useState([]);

  const [userData, setUserData] = useState({
    userSpotifyData: {},
    userSpotifyArtists: {},
    userSpotifyGenres: {},
  });
  const [data, setData] = useState([]);

  useEffect(() => {
     const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    async function fetchData() {
      const myProfileResponse = await apiClient.get("me");
      const myProfileData = myProfileResponse.data;
      const country = myProfileData.country;
      const email = myProfileData.email;
      const spotifyId = myProfileData.id;
      const displayName = myProfileData.display_name;
      const profilePic = myProfileData.images[0].url;
      console.log(profilePic);
      const profileInfo = [country, email, spotifyId, displayName, profilePic];
      setProfileState(profileInfo);

      const followedArtistsResponse = await apiClient.get(
        "me/following?type=artist"
      );
      const artistData = followedArtistsResponse.data;
      const allGenres = [];
      const followedArtists = [];
      artistData.artists.items.forEach((artist) => {
        if (artist.genres && artist.genres.length > 0) {
          allGenres.push(...artist.genres);
        }
      });
      artistData.artists.items.forEach((artist) => {
        followedArtists.push(artist.name);
      });
      setArtistState(followedArtists);
      setGenreState(allGenres);
    }
    fetchData();
  }, []);

  const navigate = useNavigate();
  const [text, setText] = useState({
    contactInfo: "",
  });
  const [form, setForm] = useState({
    contactInfo: "",
    preferredName: "",
    age: "",
    gender: "",
    beEmail: "",
  });

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const newPerson = { form, artistState, genreState, profileState };
    await fetch("https://melodymatch-3ro0.onrender.com/addUserInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => {
        window.alert(error);
        return;
      });

    setForm({ contactInfo: "", preferredName: "", age: "", gender: "" });
    navigate("/Profile");
    console.log(newPerson);
  }
  async function onDecline() {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    console.log(data);
  }

  console.log(genreState);
  console.log(artistState);
  console.log(profileState);

  return (
    <>
      <Flex
        align="center"
        justify="center"
        bg="#232136"
        minHeight="100vh"
        color="white"
        px={4}
      >
        <Center>
          <Box
            bg="#2a273f"
            borderRadius="lg"
            p={8}
            width="100%"
            maxW="500px"
            boxShadow="lg"
          >
            <Heading
              as="h1"
              size="lg"
              mb={6}
              textAlign="center"
              color="#eb6f92"
            >
              Register for MelodyMatch
            </Heading>
            <form onSubmit={onSubmit}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel htmlFor="contactInfo" color="#eb6f92">
                    Contact Info
                  </FormLabel>
                  <Input
                    id="contactInfo"
                    type="text"
                    placeholder="Snapchat / Phone Number / Etc..."
                    value={form.contactInfo}
                    onChange={(e) =>
                      updateForm({ contactInfo: e.target.value })
                    }
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="preferredName" color="#eb6f92">
                    Preferred Name
                  </FormLabel>
                  <Input
                    id="preferredName"
                    type="text"
                    placeholder="Preferred Name"
                    value={form.preferredName}
                    onChange={(e) =>
                      updateForm({ preferredName: e.target.value })
                    }
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="age" color="#eb6f92">
                    Age
                  </FormLabel>
                  <Input
                    id="age"
                    type="text"
                    placeholder="18+"
                    value={form.age}
                    onChange={(e) => updateForm({ age: e.target.value })}
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor="email" color="#eb6f92">
                    Email (Must be same email originally signed up with)
                  </FormLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={form.beEmail}
                    onChange={(e) => updateForm({ beEmail: e.target.value })}
                    bg="gray.700"
                    border="none"
                    focusBorderColor="#eb6f92"
                    _placeholder={{ color: "gray.400" }}
                  />
                </FormControl>


                <Stack
                  direction={{ base: "column", sm: "row" }}
                  spacing={4}
                  mt={4}
                >
                  <Button
                    type="submit"
                    bg="#eb6f92"
                    color="white"
                    _hover={{ bg: "#d45879" }}
                    flex={1}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={onDecline}
                    bg="gray.600"
                    color="white"
                    _hover={{ bg: "gray.500" }}
                    flex={1}
                  >
                    Decline
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Center>
      </Flex>
    </>
  );
};

export default Welcome;
