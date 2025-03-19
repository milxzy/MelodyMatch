// Header - Kawaii Cute design
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Flex,
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
  Box,
  Text,
  Circle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiMenu, FiHome, FiUsers, FiMessageCircle, FiUser, FiLogOut, FiHeart, FiMusic } from "react-icons/fi";

const MotionFlex = motion(Flex);
const MotionBox = motion(Box);

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
    { name: "Dashboard", path: "/dashboard", icon: FiHome, color: "kawaii.pink" },
    { name: "Discover", path: "/matches", icon: FiHeart, color: "kawaii.lilac" },
    { name: "Matches", path: "/matcheslist", icon: FiUsers, color: "kawaii.mint" },
    { name: "Messages", path: "/messaging", icon: FiMessageCircle, color: "kawaii.peach" },
    { name: "Profile", path: "/profile", icon: FiUser, color: "kawaii.pink" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <MotionFlex
      as="header"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 6 }}
      py={3}
      bg="surface.card"
      position="sticky"
      top={4}
      mx={{ base: 3, md: 6 }}
      mt={4}
      borderRadius="3xl"
      border="2px solid"
      borderColor="rgba(255, 200, 210, 0.1)"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)"
      zIndex="sticky"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <Link to="/dashboard">
        <HStack 
          spacing={3} 
          cursor="pointer" 
          _hover={{ transform: "scale(1.02)" }} 
          transition="all 0.2s"
        >
          <MotionBox
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            <Circle size="40px" bg="kawaii.pink">
              <Icon as={FiMusic} boxSize={5} color="white.pure" />
            </Circle>
          </MotionBox>
          <Text
            fontFamily="heading"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
            bgClip="text"
          >
            MelodyMatch
          </Text>
        </HStack>
      </Link>

      {/* Desktop Navigation */}
      <HStack
        display={{ base: "none", lg: "flex" }}
        spacing={1}
        bg="surface.muted"
        p={1.5}
        borderRadius="full"
      >
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <Button
              variant="ghost"
              size="sm"
              color={isActive(item.path) ? item.color : "text.secondary"}
              bg={isActive(item.path) ? "surface.card" : "transparent"}
              boxShadow={isActive(item.path) ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none"}
              _hover={{ 
                bg: isActive(item.path) ? "surface.card" : "rgba(255, 200, 210, 0.1)",
                color: item.color,
                transform: "translateY(-1px)"
              }}
              leftIcon={<Icon as={item.icon} />}
              fontFamily="body"
              fontWeight="semibold"
              fontSize="sm"
              borderRadius="full"
              px={4}
              transition="all 0.2s"
            >
              {item.name}
            </Button>
          </Link>
        ))}
      </HStack>

      {/* Desktop Logout */}
      <Button
        display={{ base: "none", lg: "flex" }}
        variant="ghost"
        size="sm"
        leftIcon={<Icon as={FiLogOut} />}
        onClick={handleLogout}
        fontFamily="body"
        fontWeight="semibold"
        fontSize="sm"
        color="text.secondary"
        borderRadius="full"
        border="2px solid"
        borderColor="rgba(255, 200, 210, 0.12)"
        _hover={{
          bg: "rgba(255, 181, 186, 0.1)",
          borderColor: "kawaii.pink",
          color: "kawaii.pink"
        }}
        px={4}
      >
        Logout
      </Button>

      {/* Mobile Menu Button */}
      <IconButton
        display={{ base: "flex", lg: "none" }}
        icon={<FiMenu size={20} />}
        variant="ghost"
        color="text.primary"
        bg="surface.muted"
        _hover={{ bg: "surface.elevated", color: "kawaii.pink" }}
        onClick={onOpen}
        aria-label="Open menu"
        borderRadius="full"
        size="md"
      />

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay bg="rgba(15, 15, 26, 0.9)" backdropFilter="blur(10px)" />
        <DrawerContent bg="surface.card" borderLeftRadius="3xl">
          <DrawerCloseButton color="text.muted" _hover={{ color: "kawaii.pink" }} />
          <DrawerHeader 
            borderBottomWidth="2px" 
            borderColor="rgba(255, 200, 210, 0.06)"
            fontFamily="heading"
            fontWeight="bold"
            color="kawaii.pink"
          >
            Menu
          </DrawerHeader>
          <DrawerBody py={6}>
            <VStack spacing={2} align="stretch">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <MotionBox
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      width="100%"
                      justifyContent="flex-start"
                      variant="ghost"
                      color={isActive(item.path) ? item.color : "text.secondary"}
                      bg={isActive(item.path) ? "surface.elevated" : "transparent"}
                      boxShadow={isActive(item.path) ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none"}
                      _hover={{ 
                        bg: "surface.elevated", 
                        color: item.color 
                      }}
                      leftIcon={
                        <Circle size="32px" bg={isActive(item.path) ? item.color : "surface.muted"}>
                          <Icon as={item.icon} boxSize={4} color={isActive(item.path) ? "white" : "text.muted"} />
                        </Circle>
                      }
                      onClick={onClose}
                      fontFamily="body"
                      fontWeight="semibold"
                      fontSize="sm"
                      borderRadius="2xl"
                      py={6}
                    >
                      {item.name}
                    </Button>
                  </MotionBox>
                </Link>
              ))}
              
              <Box pt={4} borderTop="2px solid" borderColor="rgba(255, 200, 210, 0.06)" mt={4}>
                <Button
                  width="100%"
                  justifyContent="flex-start"
                  variant="ghost"
                  color="text.secondary"
                  _hover={{ bg: "rgba(255, 181, 186, 0.1)", color: "kawaii.pink" }}
                  leftIcon={
                    <Circle size="32px" bg="surface.muted">
                      <Icon as={FiLogOut} boxSize={4} color="text.muted" />
                    </Circle>
                  }
                  onClick={() => {
                    handleLogout();
                    onClose();
                  }}
                  fontFamily="body"
                  fontWeight="semibold"
                  fontSize="sm"
                  borderRadius="2xl"
                  py={6}
                >
                  Logout
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MotionFlex>
  );
};

export default Header;
