import React from "react";
import { Link } from "react-router-dom"; // React Router for navigation
import { Flex, Box, Heading, Button } from "@chakra-ui/react"; // Chakra UI for styling

const Header = () => {
  return (
    <Flex
      as="header"
      direction={{ base: "column", md: "row" }} // Stack on small screens and row on larger ones
      align="center" // Vertically center content
      justify="space-between" // Distribute space between logo and buttons on larger screens
      padding={{ base: "0.5rem", md: "1rem" }} // Responsive padding
      bg="#908caa" // Background color
      color="white" // Text color
      boxShadow="md"
      width="100%" // Full width
    >
      {/* Logo Section */}
      <Box
        display="flex" // Flexbox for centering the logo
        alignItems="center" // Vertically center the logo
        justifyContent={{ base: "center", md: "flex-start" }} // Center the logo on small screens, left-align on larger screens
        flexGrow="1" // Make sure the logo can take up available space
        mb={{ base: "1rem", md: "0" }} // Add margin on small screens
      >
        <Heading
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
          size="md"
        >
          MelodyMatch
        </Heading>
      </Box>

      {/* Navigation Buttons */}
      <Flex
        justify="center" // Horizontally center the buttons
        align="center" // Vertically align the buttons
        gap="2" // Spacing between buttons
        wrap="wrap" // Allow wrapping on smaller screens
        order={{ base: 2, md: 1 }} // Ensure buttons are after the logo on larger screens
      >
        <Link to="/matcheslist">
          <Button variant="ghost">Matches</Button>
        </Link>
        <Link to="/matches">
          <Button variant="ghost">Users</Button>
        </Link>
        <Link to="/profile">
          <Button variant="ghost">Profile</Button>
        </Link>
        {/* <Link to="/messaging">
        <Button variant="ghost">Messaging</Button>
        </Link> */}
      </Flex>
    </Flex>
  );
};

export default Header;
