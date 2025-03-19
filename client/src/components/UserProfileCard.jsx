// UserProfileCard - User's own profile card with Kawaii Cute design
import { useState } from "react";
import { 
  Box, 
  Text, 
  Flex, 
  IconButton, 
  VStack, 
  HStack,
  Heading,
  Wrap,
  WrapItem,
  Icon,
  Avatar,
  Circle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiMapPin, FiMusic } from "react-icons/fi";
import { ClayCard, ClayCardBody } from "./ui";

const MotionBox = motion(Box);

const UserProfileCard = ({
  name,
  primaryGenre,
  genres = [],
  age,
  country,
  profilePic,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex - 5 < 0 ? 0 : currentIndex - 5);
  };

  const handleNextClick = () => {
    setCurrentIndex(
      currentIndex + 5 > genres.length - 1 ? genres.length - 1 : currentIndex + 5
    );
  };

  const displayGenres = Array.isArray(genres) ? genres : [];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      w="full"
      maxW="500px"
    >
      <ClayCard>
        <ClayCardBody>
          <VStack spacing={6}>
            {/* Profile Picture */}
            <Box position="relative">
              <Avatar
                size="2xl"
                src={profilePic}
                name={name}
                border="4px solid"
                borderColor="kawaii.pink"
                boxShadow="0 6px 20px rgba(0, 0, 0, 0.15)"
              />
              {primaryGenre && (
                <Box
                  position="absolute"
                  bottom="-2"
                  left="50%"
                  transform="translateX(-50%)"
                  px={3}
                  py={1}
                  bg="kawaii.mint"
                  borderRadius="full"
                >
                  <Text fontFamily="body" fontSize="xs" fontWeight="bold" color="white.pure">
                    {primaryGenre}
                  </Text>
                </Box>
              )}
            </Box>

            {/* Name and Info */}
            <VStack spacing={2}>
              <Heading
                fontFamily="heading"
                fontSize="2xl"
                fontWeight="bold"
                color="text.primary"
              >
                {name || 'Unknown'}{age ? `, ${age}` : ''}
              </Heading>
              
              {country && (
                <HStack spacing={1} color="text.muted">
                  <Icon as={FiMapPin} boxSize={4} />
                  <Text fontFamily="body" fontSize="sm">
                    {country}
                  </Text>
                </HStack>
              )}
              
              {/* Decorative dots */}
              <HStack spacing={2} pt={1}>
                {['kawaii.pink', 'kawaii.lilac', 'kawaii.mint'].map((color, i) => (
                  <Circle key={i} size="8px" bg={color} />
                ))}
              </HStack>
            </VStack>

            {/* Genres Section */}
            {displayGenres.length > 0 && (
              <Box w="full">
                <HStack spacing={2} mb={3} justify="center">
                  <Circle size="28px" bg="kawaii.lilac">
                    <Icon as={FiMusic} color="white.pure" boxSize={3} />
                  </Circle>
                  <Text
                    fontFamily="body"
                    fontSize="sm"
                    fontWeight="semibold"
                    color="text.secondary"
                  >
                    Your Music Taste
                  </Text>
                </HStack>

                <Wrap spacing={2} justify="center">
                  {displayGenres.slice(currentIndex, currentIndex + 5).map((genre, index) => (
                    <WrapItem key={index}>
                      <Box
                        px={3}
                        py={1.5}
                        bg="rgba(212, 191, 255, 0.15)"
                        border="2px solid"
                        borderColor="rgba(212, 191, 255, 0.4)"
                        borderRadius="full"
                        transition="all 0.2s"
                        _hover={{ 
                          bg: "rgba(212, 191, 255, 0.25)",
                          transform: "translateY(-1px)"
                        }}
                      >
                        <Text
                          fontFamily="body"
                          fontSize="xs"
                          fontWeight="semibold"
                          color="kawaii.lilac"
                          textTransform="capitalize"
                        >
                          {genre}
                        </Text>
                      </Box>
                    </WrapItem>
                  ))}
                </Wrap>

                {/* Genre Navigation */}
                {displayGenres.length > 5 && (
                  <Flex mt={4} justify="center" gap={3}>
                    <IconButton
                      aria-label="Previous genres"
                      icon={<FiChevronLeft />}
                      onClick={handlePrevClick}
                      isDisabled={currentIndex === 0}
                      size="sm"
                      bg="surface.elevated"
                      color="text.primary"
                      borderRadius="full"
                      _hover={{ bg: "surface.card", color: "kawaii.lilac" }}
                      _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                    />
                    <Text fontFamily="body" fontSize="xs" color="text.muted" alignSelf="center">
                      {Math.floor(currentIndex / 5) + 1} / {Math.ceil(displayGenres.length / 5)}
                    </Text>
                    <IconButton
                      aria-label="Next genres"
                      icon={<FiChevronRight />}
                      onClick={handleNextClick}
                      isDisabled={currentIndex + 5 >= displayGenres.length}
                      size="sm"
                      bg="surface.elevated"
                      color="text.primary"
                      borderRadius="full"
                      _hover={{ bg: "surface.card", color: "kawaii.lilac" }}
                      _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                    />
                  </Flex>
                )}
              </Box>
            )}
          </VStack>
        </ClayCardBody>
      </ClayCard>
    </MotionBox>
  );
};

export default UserProfileCard;
