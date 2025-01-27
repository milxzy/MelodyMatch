import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Image,
  Badge,
  Text,
  Flex,
  Button,
  Center,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import {
  FaHeart,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import MatchesCard from "./MatchesCard";

const MatchesList = ({}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndices, setCurrentIndices] = useState([]);
  const [noMatches, setNoMatches] = useState(false); // New state for no matches message
  const navigate = useNavigate();


  

  const goBack = () => {
    navigate("/profile");
  };



  const handlePrevClick = (index) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((val, i) => (i === index ? val - 5 : val))
    );
  };
  
  const handleNextClick = (index) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((val, i) => (i === index ? val + 5 : val))
    );
  };

  useEffect(() => {

 const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const storedData = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(storedData);
    const userId = userInfo._id;
  
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://melodymatch-3ro0.onrender.com/getMatches/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
  
        console.log(data.matches); // Debugging matches data
        setMatches(data.matches);
  
        if (data.matches.length === 0) {
          setNoMatches(true); // Set noMatches to true if there are no matches
        } else {
          setNoMatches(false); // Otherwise, reset noMatches
        }
  
        // Initialize pagination indices for each match
        setCurrentIndices(new Array(data.matches.length).fill(0)); // Fill with 0
      } catch (error) {
        console.log("error fetching matches");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <>
      <Header />
      <Box bg="#232136" minHeight="100vh">
        <Heading as="h3" textAlign="center" color="#eb6f92">
          Matches
        </Heading>

        {/* Display a message if there are no matches */}
        {noMatches ? (
          <Center>
            <Text color="white" fontSize="lg" mt={4}>
              You don't have any matches yet. Keep searching!
            </Text>
          </Center>
        ) : (
          <VStack spacing={4} p="4">
            {matches &&
              Array.isArray(matches) &&
              matches.map((match, index) => (
                <Box
                  key={index}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  position="relative"
                  width="400px"
                  maxW="sm"
                  bg="#908caa"
                  borderColor="#908caa"
                >
                  <Flex justifyContent="center" alignItems="center" p="2">
                    <Image
                      src={match.profile_pic}
                      alt={`${match.preferred_name}'s picture`}
                      boxSize="50px"
                      borderRadius="full"
                    ></Image>
                  </Flex>

                  <Flex mt="2" justifyContent="space-between" alignItems="center">
                    <Box fontWeight="bold" as="h4" lineHeight="tight" isTruncated>
                      {match.preferred_name}, {match.age}
                    </Box>
                  </Flex>

                  <Stack mt="2" spacing={1}>
                    {Array.isArray(match.genres)
                      ? match.genres
                          .slice(currentIndices[index], currentIndices[index] + 5)
                          .map((genre, index) => (
                            <Badge
                              key={index}
                              borderRadius="full"
                              px="2"
                              colorScheme="blue"
                            >
                              {genre}
                            </Badge>
                          ))
                      : null}
                  </Stack>

                  {match.genres.length > 5 && (
                    <Flex mt="2" justifyContent="space-between">
                      <IconButton
                        aria-label="Previous"
                        icon={<FaChevronLeft />}
                        onClick={() => handlePrevClick(index)} // Pass the index here
                        isDisabled={currentIndices[index] === 0}
                      />
                      <IconButton
                        aria-label="Next"
                        icon={<FaChevronRight />}
                        onClick={() => handleNextClick(index)} // Pass the index here
                        isDisabled={currentIndices[index] + 5 >= match.genres.length}
                      />
                    </Flex>
                  )}

                  <Badge borderRadius="full" px="2" colorScheme="blue" marginBottom="2" marginTop="2" width="full">
                    Contact Info: {match.contact_info}
                  </Badge>
                
                </Box>
              ))}
          </VStack>
        )}
      </Box>
    </>
  );
};

export default MatchesList;
