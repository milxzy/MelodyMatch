// ProfileCard - Swipe card with Kawaii Cute design
import { useState } from "react";
import { FiHeart, FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiMusic } from "react-icons/fi";
import { Box, Image, Text, Flex, IconButton, Heading, Wrap, WrapItem, HStack, VStack, Icon, Circle } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionIconButton = motion(IconButton);

const ProfileCard = ({
  name,
  primaryGenre,
  genres,
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
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
  
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
    <MotionBox
      maxW="md"
      width={{ base: "100%", md: "450px" }}
      borderRadius="3xl"
      overflow="hidden"
      bg="surface.card"
      border="2px solid"
      borderColor="rgba(255, 200, 210, 0.1)"
      boxShadow="0 12px 40px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.1)"
      style={{ willChange: 'transform, opacity' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Profile Image Section */}
      <Box position="relative" bg="surface.elevated">
        <Image
          src={allPictures[currentPictureIndex]}
          alt={`${name || 'User'}'s picture ${currentPictureIndex + 1}`}
          width="100%"
          height="350px"
          objectFit="cover"
        />
        
        {/* Picture Navigation */}
        {allPictures.length > 1 && (
          <>
            {currentPictureIndex > 0 && (
              <IconButton
                aria-label="Previous picture"
                icon={<FiChevronLeft />}
                position="absolute"
                left="3"
                top="50%"
                transform="translateY(-50%)"
                onClick={handlePrevPicture}
                size="sm"
                bg="rgba(26, 26, 46, 0.9)"
                color="white.pure"
                _hover={{ bg: "surface.card" }}
                borderRadius="full"
              />
            )}
            
            {currentPictureIndex < allPictures.length - 1 && (
              <IconButton
                aria-label="Next picture"
                icon={<FiChevronRight />}
                position="absolute"
                right="3"
                top="50%"
                transform="translateY(-50%)"
                onClick={handleNextPicture}
                size="sm"
                bg="rgba(26, 26, 46, 0.9)"
                color="white.pure"
                _hover={{ bg: "surface.card" }}
                borderRadius="full"
              />
            )}
            
            {/* Picture Indicators */}
            <HStack
              position="absolute"
              top="3"
              left="50%"
              transform="translateX(-50%)"
              spacing={1}
            >
              {allPictures.map((_, index) => (
                <Box
                  key={index}
                  width="32px"
                  height="4px"
                  bg={index === currentPictureIndex 
                    ? "kawaii.pink" 
                    : "rgba(255, 220, 225, 0.5)"
                  }
                  borderRadius="full"
                  transition="background-color 0.2s ease"
                />
              ))}
            </HStack>
          </>
        )}
        
        {/* Name/Age Overlay */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          bgGradient="linear(to-t, rgba(15, 15, 26, 0.98), rgba(15, 15, 26, 0.7), transparent)"
          p="5"
          pt="12"
        >
          <HStack justify="space-between" align="flex-end">
            <VStack align="flex-start" spacing={1}>
              <Heading 
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="bold"
                color="text.primary"
              >
                {name || 'Unknown User'}{age ? `, ${age}` : ''}
              </Heading>
              {country && (
                <HStack spacing={1} color="text.muted">
                  <Icon as={FiMapPin} boxSize={3} />
                  <Text fontFamily="body" fontSize="sm">
                    {country}
                  </Text>
                </HStack>
              )}
            </VStack>
            {primaryGenre && (
              <Box px={3} py={1.5} bg="kawaii.mint" borderRadius="full">
                <Text fontFamily="body" fontSize="xs" fontWeight="bold" color="white.pure">
                  {primaryGenre}
                </Text>
              </Box>
            )}
          </HStack>
        </Box>
      </Box>

      {/* Content Section */}
      <Box p="6">
        {/* Bio */}
        {bio && (
          <Box 
            mb="5" 
            p={4} 
            bg="surface.muted" 
            borderRadius="2xl"
            border="2px solid"
            borderColor="rgba(255, 200, 210, 0.06)"
          >
            <Text fontFamily="body" color="text.secondary" fontSize="sm" lineHeight="1.7">
              {bio}
            </Text>
          </Box>
        )}

        {/* Genres Section */}
        <Box>
          <HStack mb={3}>
            <Circle size="28px" bg="kawaii.mint">
              <Icon as={FiMusic} color="white.pure" boxSize={3} />
            </Circle>
            <Text 
              fontFamily="body"
              fontSize="sm"
              fontWeight="semibold"
              color="text.secondary"
            >
              Music Taste
            </Text>
          </HStack>
          <Wrap spacing={2} mb="2">
            {Array.isArray(genres) && genres.length > 0
              ? genres.slice(currentIndex, currentIndex + 5).map((genre, index) => (
                  <WrapItem key={index}>
                    <Box
                      px={3}
                      py={1.5}
                      bg="rgba(181, 234, 221, 0.15)"
                      border="2px solid"
                      borderColor="rgba(181, 234, 221, 0.4)"
                      borderRadius="full"
                      transition="background-color 0.2s ease, transform 0.2s ease"
                      _hover={{ 
                        bg: "rgba(181, 234, 221, 0.25)",
                        transform: "translateY(-1px)"
                      }}
                    >
                      <Text 
                        fontFamily="body"
                        fontSize="xs"
                        fontWeight="semibold"
                        color="kawaii.mint"
                        textTransform="capitalize"
                      >
                        {genre}
                      </Text>
                    </Box>
                  </WrapItem>
                ))
              : (
                <Text fontFamily="body" color="text.muted" fontSize="sm">
                  No genres available
                </Text>
              )}
          </Wrap>

          {/* Genre Navigation */}
          {genres && genres.length > 5 && (
            <Flex justify="center" gap={3} mt="4">
              <IconButton
                aria-label="Previous genres"
                icon={<FiChevronLeft />}
                onClick={handlePrevClick}
                isDisabled={currentIndex === 0}
                size="sm"
                bg="surface.elevated"
                color="text.primary"
                borderRadius="full"
                _hover={{ bg: "surface.card", color: "kawaii.mint" }}
                _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
              />
              <Text 
                fontFamily="body"
                fontSize="xs"
                color="text.muted"
                alignSelf="center"
              >
                {Math.floor(currentIndex / 5) + 1} / {Math.ceil(genres.length / 5)}
              </Text>
              <IconButton
                aria-label="Next genres"
                icon={<FiChevronRight />}
                onClick={handleNextClick}
                isDisabled={currentIndex + 5 >= genres.length}
                size="sm"
                bg="surface.elevated"
                color="text.primary"
                borderRadius="full"
                _hover={{ bg: "surface.card", color: "kawaii.mint" }}
                _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
              />
            </Flex>
          )}
        </Box>
      </Box>

      {/* Action Buttons */}
      <Flex
        justifyContent="center"
        gap={8}
        p="6"
        pt="2"
        pb="8"
      >
        <MotionIconButton
          onClick={handlePreviousMatch}
          aria-label="Pass"
          icon={<FiX size={28} />}
          isRound
          size="lg"
          w="64px"
          h="64px"
          bg="surface.elevated"
          color="text.muted"
          border="3px solid"
          borderColor="rgba(255, 200, 210, 0.12)"
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
          style={{ willChange: 'transform' }}
          _hover={{ 
            bg: "surface.muted",
            color: "text.secondary",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        <MotionIconButton
          onClick={handleNextMatch}
          aria-label="Like"
          icon={<FiHeart size={28} />}
          isRound
          size="lg"
          w="64px"
          h="64px"
          bg="kawaii.pink"
          color="white.pure"
          boxShadow="0 6px 16px rgba(0, 0, 0, 0.15)"
          style={{ willChange: 'transform' }}
          _hover={{ 
            bg: "#ff9da3",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </Flex>
    </MotionBox>
  );
};

export default ProfileCard;
