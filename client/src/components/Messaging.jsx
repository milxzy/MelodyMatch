// Messaging - Chat interface with Kawaii Cute design
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Spinner,
  useToast,
  Icon,
  IconButton,
  Heading,
  Circle,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { FiSend, FiArrowLeft, FiMessageCircle, FiMusic, FiHeart } from "react-icons/fi";
import Header from "./Header";
import { 
  ClayCard, 
  ClayCardBody, 
  ClayButton,
  CyanButton,
  FloatingShapes 
} from "./ui";
import { GlowInput } from "./ui/GlowInput";

const MotionBox = motion(Box);

const apiUrl = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const Messaging = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const toast = useToast();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const storedData = localStorage.getItem("userInfo");
    if (!storedData) {
      navigate("/");
      return;
    }

    const user = JSON.parse(storedData);
    setUserInfo(user);

    socketRef.current = io(apiUrl, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.emit("user-online", user._id);

    socketRef.current.on("receive-message", (newMessage) => {
      if (selectedConversation &&
          (newMessage.sender._id === selectedConversation ||
           newMessage.recipient._id === selectedConversation)) {
        setMessages((prev) => [...prev, newMessage]);
      }

      toast({
        title: `New message from ${newMessage.sender.preferred_name}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    });

    socketRef.current.on("message-sent", (sentMessage) => {
      setMessages((prev) => [...prev, sentMessage]);
      setSending(false);
    });

    socketRef.current.on("user-typing", ({ userId }) => {
      setTypingUsers((prev) => new Set(prev).add(userId));
    });

    socketRef.current.on("user-stopped-typing", ({ userId }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (!userInfo) return;

    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/getMatches/${userInfo._id}`);
        const data = await response.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast({
          title: "Error",
          description: "Unable to fetch matches.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userInfo, toast]);

  useEffect(() => {
    if (!selectedConversation || !userInfo) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/messages/${userInfo._id}/${selectedConversation}`
        );
        const data = await response.json();
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedConversation, userInfo]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation || !userInfo) return;

    setSending(true);

    socketRef.current.emit("send-message", {
      sender: userInfo._id,
      recipient: selectedConversation,
      content: message.trim(),
    });

    setMessage("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socketRef.current.emit("typing-stop", {
      userId: userInfo._id,
      recipientId: selectedConversation,
    });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!selectedConversation || !userInfo) return;

    socketRef.current.emit("typing-start", {
      userId: userInfo._id,
      recipientId: selectedConversation,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing-stop", {
        userId: userInfo._id,
        recipientId: selectedConversation,
      });
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedMatch = matches.find((m) => m._id === selectedConversation);

  return (
    <Box bg="surface.base" minH="100vh" position="relative">
      <FloatingShapes variant="subtle" />
      
      {/* Fixed Header */}
      <Box position="relative" zIndex={10}>
        <Header />
      </Box>

      {/* Main Chat Container - fills remaining viewport */}
      <Flex
        position="relative"
        zIndex={1}
        mx={{ base: 0, md: 6 }}
        mt={4}
        mb={4}
        height={{ base: "calc(100vh - 100px)", md: "calc(100vh - 120px)" }}
        borderRadius={{ base: "none", md: "3xl" }}
        overflow="hidden"
        border={{ base: "none", md: "2px solid" }}
        borderColor="rgba(255, 200, 210, 0.1)"
        boxShadow={{ base: "none", md: "0 8px 32px rgba(0, 0, 0, 0.15)" }}
      >
        {/* Conversations Sidebar */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "320px" }}
          flexShrink={0}
          bg="surface.card"
          borderRight={{ base: "none", md: "1px solid" }}
          borderColor="rgba(255, 200, 210, 0.08)"
          display={{ base: selectedConversation ? "none" : "flex", md: "flex" }}
        >
          {/* Sidebar Header */}
          <HStack spacing={3} p={5} pb={4}>
            <Circle size="40px" bg="kawaii.pink">
              <Icon as={FiMessageCircle} boxSize={5} color="white.pure" />
            </Circle>
            <Heading
              fontFamily="heading"
              fontSize="xl"
              fontWeight="bold"
              color="text.primary"
            >
              Messages
            </Heading>
          </HStack>

          {/* Conversations List */}
          <Box flex="1" overflowY="auto" px={4} pb={4}>
            {loading ? (
              <Flex justify="center" py={12}>
                <Circle size="50px" bg="kawaii.pink">
                  <Spinner color="white.pure" size="md" />
                </Circle>
              </Flex>
            ) : matches.length === 0 ? (
              <ClayCard>
                <ClayCardBody textAlign="center" py={8}>
                  <VStack spacing={4}>
                    <Circle size="60px" bg="kawaii.lilac">
                      <Icon as={FiHeart} boxSize={7} color="white.pure" />
                    </Circle>
                    <VStack spacing={1}>
                      <Text fontFamily="heading" fontWeight="semibold" color="text.primary">
                        No matches yet
                      </Text>
                      <Text fontFamily="body" fontSize="sm" color="text.muted">
                        Start swiping to find your music soulmate!
                      </Text>
                    </VStack>
                    <CyanButton size="sm" onClick={() => navigate('/matches')}>
                      Find Matches
                    </CyanButton>
                  </VStack>
                </ClayCardBody>
              </ClayCard>
            ) : (
              <VStack spacing={2} align="stretch">
                {matches.map((match) => (
                  <MotionBox
                    key={match._id}
                    whileTap={{ scale: 0.98 }}
                  >
                    <HStack
                      p={3}
                      borderRadius="2xl"
                      bg={selectedConversation === match._id ? "surface.elevated" : "transparent"}
                      boxShadow={selectedConversation === match._id ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none"}
                      border="2px solid"
                      borderColor={selectedConversation === match._id ? "kawaii.pink" : "transparent"}
                      _hover={{ bg: "surface.elevated", cursor: "pointer" }}
                      onClick={() => setSelectedConversation(match._id)}
                      transition="all 0.2s"
                    >
                      <Avatar
                        src={match.profile_pic}
                        name={match.preferred_name}
                        size="md"
                        border="3px solid"
                        borderColor={selectedConversation === match._id ? "kawaii.pink" : "kawaii.lilac"}
                      />
                      <Box flex="1" minW={0}>
                        <Text fontFamily="body" fontWeight="bold" color="text.primary" noOfLines={1}>
                          {match.preferred_name}
                        </Text>
                        <Text fontFamily="body" fontSize="sm" color="text.muted" noOfLines={1}>
                          {match.genres?.[0] || "Music lover"}
                        </Text>
                      </Box>
                    </HStack>
                  </MotionBox>
                ))}
              </VStack>
            )}
          </Box>
        </Flex>

        {/* Chat Area */}
        <Flex
          flex="1"
          direction="column"
          bg="surface.base"
          display={{ base: selectedConversation ? "flex" : "none", md: "flex" }}
          minW={0}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <HStack
                spacing={3}
                p={4}
                bg="surface.card"
                borderBottom="1px solid"
                borderColor="rgba(255, 200, 210, 0.08)"
                flexShrink={0}
              >
                <IconButton
                  display={{ base: "flex", md: "none" }}
                  icon={<FiArrowLeft />}
                  onClick={() => setSelectedConversation(null)}
                  variant="ghost"
                  color="text.primary"
                  _hover={{ bg: "surface.elevated" }}
                  borderRadius="full"
                  aria-label="Back"
                />
                <Avatar
                  src={selectedMatch?.profile_pic}
                  name={selectedMatch?.preferred_name}
                  size="sm"
                  border="3px solid"
                  borderColor="kawaii.pink"
                />
                <Box flex="1" minW={0}>
                  <HStack spacing={2}>
                    <Text fontFamily="heading" fontWeight="bold" fontSize="md" color="text.primary" noOfLines={1}>
                      {selectedMatch?.preferred_name || "User"}
                    </Text>
                    {typingUsers.has(selectedConversation) && (
                      <Box px={2} py={0.5} bg="kawaii.mint" borderRadius="full" flexShrink={0}>
                        <Text fontFamily="body" fontSize="xs" fontWeight="bold" color="white.pure">
                          typing...
                        </Text>
                      </Box>
                    )}
                  </HStack>
                  <HStack spacing={1} color="text.muted">
                    <Icon as={FiMusic} boxSize={3} />
                    <Text fontFamily="body" fontSize="xs" noOfLines={1}>
                      {selectedMatch?.genres?.slice(0, 2).join(", ") || "Music lover"}
                    </Text>
                  </HStack>
                </Box>
              </HStack>

              {/* Messages Area */}
              <Flex
                flex="1"
                direction="column"
                p={4}
                overflowY="auto"
                minH={0}
              >
                {messages.length === 0 ? (
                  <Flex align="center" justify="center" flex="1">
                    <VStack spacing={3}>
                      <Circle size="70px" bg="kawaii.lilac">
                        <Icon as={FiMessageCircle} boxSize={8} color="white.pure" />
                      </Circle>
                      <Text fontFamily="body" color="text.muted" textAlign="center">
                        No messages yet. Say hi!
                      </Text>
                    </VStack>
                  </Flex>
                ) : (
                  <Flex direction="column" flex="1">
                    {messages.map((msg, index) => {
                      const isMyMessage = msg.sender._id === userInfo?._id || msg.sender === userInfo?._id;
                      return (
                        <MotionBox
                          key={msg._id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          alignSelf={isMyMessage ? "flex-end" : "flex-start"}
                          maxWidth="75%"
                          mb={3}
                        >
                          <Box
                            bg={isMyMessage ? "kawaii.pink" : "surface.card"}
                            color={isMyMessage ? "white" : "text.primary"}
                            px={4}
                            py={3}
                            borderRadius="2xl"
                            borderBottomRightRadius={isMyMessage ? "sm" : "2xl"}
                            borderBottomLeftRadius={isMyMessage ? "2xl" : "sm"}
                            boxShadow="0 2px 8px rgba(0, 0, 0, 0.08)"
                          >
                            <Text fontFamily="body" fontSize="sm">
                              {msg.content}
                            </Text>
                            <Text 
                              fontFamily="body"
                              fontSize="xs" 
                              color={isMyMessage ? "rgba(255, 255, 255, 0.7)" : "text.muted"} 
                              mt={1}
                              textAlign="right"
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          </Box>
                        </MotionBox>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </Flex>
                )}
              </Flex>

              {/* Input Area */}
              <HStack 
                p={4} 
                bg="surface.card" 
                borderTop="1px solid"
                borderColor="rgba(255, 200, 210, 0.08)"
                spacing={3}
                flexShrink={0}
              >
                <GlowInput
                  placeholder="Type a message..."
                  value={message}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  disabled={!selectedConversation || sending}
                />
                <ClayButton
                  onClick={handleSendMessage}
                  disabled={!selectedConversation || !message.trim() || sending}
                  isLoading={sending}
                  px={6}
                  borderRadius="full"
                >
                  <Icon as={FiSend} />
                </ClayButton>
              </HStack>
            </>
          ) : (
            /* Empty State - No conversation selected */
            <Flex align="center" justify="center" flex="1">
              <VStack spacing={4}>
                <Circle size="80px" bg="kawaii.lilac">
                  <Icon as={FiMessageCircle} boxSize={10} color="white.pure" />
                </Circle>
                <VStack spacing={1}>
                  <Text fontFamily="heading" fontWeight="semibold" color="text.primary">
                    Your messages
                  </Text>
                  <Text fontFamily="body" color="text.muted" textAlign="center">
                    Select a conversation to start chatting
                  </Text>
                </VStack>
              </VStack>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Messaging;
