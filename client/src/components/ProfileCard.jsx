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

const ProfileCard = ({
  name,
  primaryGenre,
  genres,
  subGenres,
  age,
  country,
  profilePic,
  handleNextMatch,
  handlePreviousMatch,
  handleNextClick,
  handlePrevClick,
  currentIndex,
}) => {

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

          <Text mt="2" color="gray.500">
            {country}
          </Text>

          <Stack mt="2" spacing={1}>
            {Array.isArray(genres)
              ? genres
                  .slice(currentIndex, currentIndex + 5)
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
          {/* Navigation buttons */}
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
        >
          <IconButton
            onClick={handlePreviousMatch}
            colorScheme="red"
            aria-label="Dislike"
            icon={<FaTimes />}
            isRound
          />
          <IconButton
            onClick={handleNextMatch}
            colorScheme="green"
            aria-label="Like"
            icon={<FaHeart />}
            isRound
          />
        </Flex>
      </Box>
    </>
  );
};

export default ProfileCard;
