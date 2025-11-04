import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import Header from "./Header";

import { Stack, HStack, VStack } from "@chakra-ui/react";
import {
  FaHeart,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Box, Image, Badge, Text, Flex, IconButton } from "@chakra-ui/react";

const UserProfileCard = ({
  name,
  primaryGenre,
  genres,
  subGenres,
  age,
  country,
  profilePic,
  handleNextMatch,
  handlePreviousMatch,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // initialize currentindex state

  // function to handle click on previous button
  const handlePrevClick = () => {
    setCurrentIndex(currentIndex - 5 < 0 ? 0 : currentIndex - 5);
  };

  // function to handle click on next button
  const handleNextClick = () => {
    setCurrentIndex(
      currentIndex + 5 > genres.length - 1
        ? genres.length - 1
        : currentIndex + 5
    );
  };

  return (
    <>
      <Box
        maxW="sm"
        width="400px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        position="relative"
        bg="#908caa"
        borderColor="#908caa"
      >
        <Flex justifyContent="center" alignItems="center" p="2">
          <Image
            src={profilePic}
            alt={`${name}'s picture`}
            boxSize="150px"
            borderRadius="10%"
          />
        </Flex>

        <Box p="6">
          <Flex justifyContent="space-between" alignItems="center">
            <Box d="flex" alignItems="baseline">
              <Badge borderRadius="full" px="2" colorScheme="teal">
                {primaryGenre}
              </Badge>
            </Box>
          </Flex>

          <Flex mt="2" justifyContent="space-between" alignItems="center">
            <Box fontWeight="bold" as="h4" lineHeight="tight" isTruncated>
              {name}, {age}
            </Box>
          </Flex>

          <Text mt="2" color="black">
            {country}
          </Text>

          <Stack mt="2" spacing={1}>
            {Array.isArray(genres)
              ? genres
                  .slice(currentIndex, currentIndex + 5)
                  .map((genre, index) => (
                    <Badge key={index} borderRadius="full" px="2" bg="#9ccfd8">
                      {genre}
                    </Badge>
                  ))
              : null}
          </Stack>
          {/* navigation buttons */}
          {genres.length > 5 && (
            <Flex mt="2" justifyContent="space-between">
              <IconButton
                aria-label="Previous"
                icon={<FaChevronLeft />}
                onClick={handlePrevClick}
                isDisabled={currentIndex === 0}
              />
              <IconButton
                aria-label="Next"
                icon={<FaChevronRight />}
                onClick={handleNextClick}
                isDisabled={currentIndex + 5 >= genres.length}
              />
            </Flex>
          )}
        </Box>

        <Flex
          // position="absolute"
          bottom="0"
          left="0"
          right="0"
          justifyContent="space-between"
          p="6"
        ></Flex>
      </Box>
    </>
  );
};

export default UserProfileCard;
