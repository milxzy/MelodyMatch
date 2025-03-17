
import { useState } from "react";
import { FaHeart, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Box, Image, Badge, Text, Flex, IconButton, Heading, Wrap, WrapItem, HStack } from "@chakra-ui/react";

const ProfileCard = ({
  name,
  primaryGenre,
  genres,
  _subGenres,
  age,
  country,
  profilePic,
  pictures,
  bio,
  handleNextMatch,
  handlePreviousMatch,
  handleNextClick,
  handlePrevClick,
  currentIndex,
}) => {
  // State for managing current picture index
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
  
  // Get all pictures (use pictures array if available, otherwise fallback to single profile pic)
  const allPictures = pictures && pictures.length > 0 
    ? pictures 
    : [profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"];
  
  const handleNextPicture = (e) => {
    e.stopPropagation();
    if (currentPictureIndex < allPictures.length - 1) {
      setCurrentPictureIndex(prev => prev + 1);
    }
  };
  
  const handlePrevPicture = (e) => {
    e.stopPropagation();
    if (currentPictureIndex > 0) {
      setCurrentPictureIndex(prev => prev - 1);
    }
  };
  return (
    <Box
      maxW="md"
      width={{ base: "90vw", md: "450px" }}
      borderWidth="2px"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="2xl"
      bg="#2a273f"
      borderColor="#393552"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "0 20px 40px rgba(235, 111, 146, 0.3)" }}
    >
      {/* profile image section with swipeable pictures */}
      <Box position="relative" bg="#393552">
        <Image
          src={allPictures[currentPictureIndex]}
          alt={`${name || 'User'}'s picture ${currentPictureIndex + 1}`}
          width="100%"
          height="300px"
          objectFit="cover"
        />
        
        {/* Picture navigation buttons */}
        {allPictures.length > 1 && (
          <>
            {currentPictureIndex > 0 && (
              <IconButton
                aria-label="Previous picture"
                icon={<FaChevronLeft />}
                position="absolute"
                left="2"
                top="50%"
                transform="translateY(-50%)"
                onClick={handlePrevPicture}
                size="sm"
                bg="rgba(42, 39, 63, 0.8)"
                color="#e0def4"
                _hover={{ bg: "rgba(42, 39, 63, 0.95)" }}
                borderRadius="full"
              />
            )}
            
            {currentPictureIndex < allPictures.length - 1 && (
              <IconButton
                aria-label="Next picture"
                icon={<FaChevronRight />}
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                onClick={handleNextPicture}
                size="sm"
                bg="rgba(42, 39, 63, 0.8)"
                color="#e0def4"
                _hover={{ bg: "rgba(42, 39, 63, 0.95)" }}
                borderRadius="full"
              />
            )}
            
            {/* Picture indicators */}
            <HStack
              position="absolute"
              top="2"
              left="50%"
              transform="translateX(-50%)"
              spacing={1}
            >
              {allPictures.map((_, index) => (
                <Box
                  key={index}
                  width="30px"
                  height="3px"
                  bg={index === currentPictureIndex ? "#eb6f92" : "rgba(224, 222, 244, 0.3)"}
                  borderRadius="full"
                  transition="all 0.2s"
                />
              ))}
            </HStack>
          </>
        )}
        
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          bgGradient="linear(to-t, rgba(42, 39, 63, 0.95), transparent)"
          p="4"
        >
          <Heading size="lg" color="#e0def4" mb="1">
            {name || 'Unknown User'}{age ? `, ${age}` : ''}
          </Heading>
          {country && (
            <Text color="#908caa" fontSize="sm">
              {country}
            </Text>
          )}
        </Box>
      </Box>

      {/* content section */}
      <Box p="6">
        {/* bio section */}
        {bio && (
          <Box mb="4">
            <Text color="#e0def4" fontSize="sm" lineHeight="1.6">
              {bio}
            </Text>
          </Box>
        )}
        
        {/* primary genre badge */}
        {primaryGenre && (
          <Badge
            borderRadius="full"
            px="4"
            py="1"
            bg="#eb6f92"
            color="#e0def4"
            fontSize="sm"
            fontWeight="bold"
            mb="4"
          >
            {primaryGenre}
          </Badge>
        )}

        {/* genres section */}
        <Box>
          <Text color="#908caa" fontSize="sm" fontWeight="bold" mb="2">
            music taste:
          </Text>
          <Wrap spacing={2} mb="2">
            {Array.isArray(genres) && genres.length > 0
              ? genres.slice(currentIndex, currentIndex + 5).map((genre, index) => (
                  <WrapItem key={index}>
                    <Badge
                      borderRadius="full"
                      px="3"
                      py="1"
                      bg="#393552"
                      color="#9ccfd8"
                      fontSize="xs"
                      textTransform="capitalize"
                    >
                      {genre}
                    </Badge>
                  </WrapItem>
                ))
              : (
                <Text color="#6e6a86" fontSize="sm">
                  no genres available
                </Text>
              )}
          </Wrap>

          {/* genre navigation */}
          {genres && genres.length > 5 && (
            <Flex justify="center" gap={2} mt="3">
              <IconButton
                aria-label="previous genres"
                icon={<FaChevronLeft />}
                onClick={handlePrevClick}
                isDisabled={currentIndex === 0}
                size="sm"
                bg="#393552"
                color="#e0def4"
                _hover={{ bg: "#524f67" }}
                _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
              />
              <Text color="#908caa" fontSize="xs" alignSelf="center">
                {Math.floor(currentIndex / 5) + 1} / {Math.ceil(genres.length / 5)}
              </Text>
              <IconButton
                aria-label="next genres"
                icon={<FaChevronRight />}
                onClick={handleNextClick}
                isDisabled={currentIndex + 5 >= genres.length}
                size="sm"
                bg="#393552"
                color="#e0def4"
                _hover={{ bg: "#524f67" }}
                _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
              />
            </Flex>
          )}
        </Box>
      </Box>

      {/* action buttons */}
      <Flex
        justifyContent="center"
        gap={6}
        p="6"
        pt="0"
        pb="8"
      >
        <IconButton
          onClick={handlePreviousMatch}
          aria-label="dislike"
          icon={<FaTimes />}
          isRound
          size="lg"
          bg="#393552"
          color="#e0def4"
          _hover={{ bg: "#eb6f92", transform: "scale(1.1)" }}
          transition="all 0.2s"
          boxShadow="lg"
        />
        <IconButton
          onClick={handleNextMatch}
          aria-label="like"
          icon={<FaHeart />}
          isRound
          size="lg"
          bg="#eb6f92"
          color="#e0def4"
          _hover={{ bg: "#d45879", transform: "scale(1.1)" }}
          transition="all 0.2s"
          boxShadow="lg"
        />
      </Flex>
    </Box>
  );
};

export default ProfileCard;
