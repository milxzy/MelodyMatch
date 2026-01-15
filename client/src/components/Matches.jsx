import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import Header from "./Header";
import { Center, Flex, Text, Button, Heading } from "@chakra-ui/react";

const API_URL = import.meta.env.VITE_API_URL;

const Matches = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    matches: [],
    currentMatchIndex: 0,
    loading: true,
    allMatchesViewed: false,
  });

  const { matches, currentMatchIndex, loading, allMatchesViewed } = state;

  const [currentIndex, setCurrentIndex] = useState(0); // initialize currentindex state

  // function to handle click on previous button
  const handlePrevClick = () => {
    setCurrentIndex(currentIndex - 5 < 0 ? 0 : currentIndex - 5);
  };

  

  // function to handle click on next button
  const handleNextClick = () => {
    setCurrentIndex(
      currentIndex + 5 > activeMatch.genres.length - 1
        ? activeMatch.genres.length - 1
        : currentIndex + 5
    );
  };

  // get the current active match safely
  const activeMatch = useMemo(
    () => matches[currentMatchIndex] || null,
    [matches, currentMatchIndex]
  );

  const moveToNextMatch = () => {
    setState((prevState) => {
      const nextIndex = prevState.currentMatchIndex + 1;
      const allViewed = nextIndex >= matches.length;

      return {
        ...prevState,
        currentMatchIndex: nextIndex,
        allMatchesViewed: allViewed,
      };
    });
    setCurrentIndex(0);
  };

  const handleLike = async () => {
    if (!activeMatch) return;
    console.log('match')

    try {
      console.log('work')
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));

      // send the like to the database
      await fetch(`${API_URL}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likedUserId: activeMatch._id,
          liker: activeUser._id,
        }),
      });

      console.log(`User ${activeUser._id} liked ${activeMatch._id}`);
    } catch (error) {
      console.error("Error liking user:", error);
    }

    moveToNextMatch();
    console.log('moving to next match')
  };

  const handleDislike = async () => {
    if (!activeMatch) return;

    try {
      const activeUser = JSON.parse(localStorage.getItem("userInfo"));

      // optionally, log or handle a "dislike" action if needed
      console.log(`User ${activeUser._id} disliked ${activeMatch._id}`);
    } catch (error) {
      console.error("Error disliking user:", error);
    }

    moveToNextMatch();
  };

  const handleViewMatchesAgain = () => {
    setState((prevState) => ({
      ...prevState,
      currentMatchIndex: 0,
      allMatchesViewed: false,
    }));
  };

  useEffect(() => {

 const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUserProfiles = async () => {
      try {
        const activeUser = JSON.parse(localStorage.getItem("userInfo"));
        if (!activeUser || !activeUser._id) {
          console.error("User not found in localStorage");
          return;
        }
        const userId = activeUser._id; // get the current user's id

        const response = await fetch(`${API_URL}/GetUsers?userId=${userId}`);
        const data = await response.json();
        console.log(data);
  
        setState((prevState) => ({
          ...prevState,
          matches: data.users,
          loading: false,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };
  
    fetchUserProfiles();
  }, []);
  


  return (
    <>
      <Header />
      <Center bg="#232136" minHeight="100vh">
        <Flex direction="column" justifyContent="center" alignItems="center">
           <Heading as="h3" textAlign="center" color="#eb6f92">
                    Users
                  </Heading>
          {loading ? (
            <Text>Loading...</Text>
          ) : matches.length > 0 ? (
            !allMatchesViewed ? (
              <ProfileCard
                profilePic={activeMatch?.profile_pic}
                name={activeMatch?.preferred_name}
                age={activeMatch?.age}
                genres={activeMatch?.genres}
                handleNextMatch={handleLike}
                handlePreviousMatch={handleDislike}
                handleNextClick={handleNextClick}
                handlePrevClick={handlePrevClick}
                currentIndex={currentIndex}
              />
            ) : (
              <Flex direction="column" alignItems="center" mt={4}>
                <Text fontSize="xl" mb={2}>
                  No more users available.
                </Text>
                <Button
                  onClick={handleViewMatchesAgain}
                  colorScheme="teal"
                  variant="solid"
                >
                  View Matches Again
                </Button>
              </Flex>
            )
          ) : (
            <Text>No matches found</Text>
          )}
        </Flex>
      </Center>
    </>
  );
};

export default Matches;
