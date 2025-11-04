import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Icon,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { FiMenu, FiHome, FiUsers, FiMessageCircle, FiUser, FiLogOut, FiHeart } from "react-icons/fi";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const navItems = [
    { name: "dashboard", path: "/dashboard", icon: FiHome },
    { name: "find matches", path: "/matches", icon: FiHeart },
    { name: "my matches", path: "/matcheslist", icon: FiUsers },
    { name: "messages", path: "/messaging", icon: FiMessageCircle },
    { name: "profile", path: "/profile", icon: FiUser },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      padding="1rem 2rem"
      bg="#2a273f"
      color="white"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.3)"
      position="sticky"
      top="0"
      zIndex="1000"
      width="100%"
    >
      {/* logo section */}
      <Link to="/dashboard">
        <HStack spacing={2} cursor="pointer" _hover={{ transform: "scale(1.05)" }} transition="all 0.2s">
          <Icon as={FiMessageCircle} boxSize={8} color="#eb6f92" />
          <Heading
            bgGradient="linear(to-r, #eb6f92, #f6c177)"
            bgClip="text"
            size="lg"
            fontWeight="extrabold"
          >
            MelodyMatch
          </Heading>
        </HStack>
      </Link>

      {/* desktop navigation */}
      <Flex
        display={{ base: "none", md: "flex" }}
        gap="1"
        align="center"
      >
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              color={isActive(item.path) ? "#eb6f92" : "#e0def4"}
              bg={isActive(item.path) ? "#393552" : "transparent"}
              _hover={{ bg: "#393552", color: "#eb6f92" }}
              leftIcon={<Icon as={item.icon} />}
              size="md"
              fontWeight={isActive(item.path) ? "bold" : "normal"}
            >
              {item.name}
            </Button>
          </Link>
        ))}
        <Button
          variant="ghost"
          color="#e0def4"
          _hover={{ bg: "#393552", color: "#eb6f92" }}
          leftIcon={<Icon as={FiLogOut} />}
          onClick={handleLogout}
          size="md"
        >
          logout
        </Button>
      </Flex>

      {/* mobile menu button */}
      <IconButton
        display={{ base: "flex", md: "none" }}
        icon={<FiMenu />}
        variant="ghost"
        color="#e0def4"
        _hover={{ bg: "#393552", color: "#eb6f92" }}
        onClick={onOpen}
        aria-label="open menu"
        size="lg"
      />

      {/* mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#2a273f">
          <DrawerCloseButton color="#e0def4" />
          <DrawerHeader color="#eb6f92" borderBottomWidth="1px" borderColor="#393552">
            menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    width="100%"
                    justifyContent="flex-start"
                    variant="ghost"
                    color={isActive(item.path) ? "#eb6f92" : "#e0def4"}
                    bg={isActive(item.path) ? "#393552" : "transparent"}
                    _hover={{ bg: "#393552", color: "#eb6f92" }}
                    leftIcon={<Icon as={item.icon} />}
                    onClick={onClose}
                    fontWeight={isActive(item.path) ? "bold" : "normal"}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              <Button
                width="100%"
                justifyContent="flex-start"
                variant="ghost"
                color="#e0def4"
                _hover={{ bg: "#393552", color: "#eb6f92" }}
                leftIcon={<Icon as={FiLogOut} />}
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
              >
                logout
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;
