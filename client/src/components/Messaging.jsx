import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Avatar,
  Spinner,
  useToast,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { io } from "socket.io-client";
import Header from "./Header";

const apiUrl = import.meta.env.VITE_API_URL || 'https:// melodymatch-3ro0.onrender.com';

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

  // scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // initialize socket connection
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

    // connect to socket.io server
    socketRef.current = io(apiUrl, {
      transports: ['websocket', 'polling']
    });

    // emit user online event
    socketRef.current.emit("user-online", user._id);

    // listen for incoming messages
    socketRef.current.on("receive-message", (newMessage) => {
      // only add message if it's for the current conversation
      if (selectedConversation &&
          (newMessage.sender._id === selectedConversation ||
           newMessage.recipient._id === selectedConversation)) {
        setMessages((prev) => [...prev, newMessage]);
      }

      // show toast notification
      toast({
        title: `new message from ${newMessage.sender.preferred_name}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    });

    // listen for message sent confirmation
    socketRef.current.on("message-sent", (sentMessage) => {
      setMessages((prev) => [...prev, sentMessage]);
      setSending(false);
    });

    // listen for typing indicators
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

    // cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [navigate]);

  // fetch matches on mount
  useEffect(() => {
    if (!userInfo) return;

    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/getMatches/${userInfo._id}`);
        const data = await response.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.error("error fetching matches:", error);
        toast({
          title: "error",
          description: "unable to fetch matches.",
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

  // fetch messages when conversation is selected
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
        console.error("error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedConversation, userInfo]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation || !userInfo) return;

    setSending(true);

    // emit message through socket
    socketRef.current.emit("send-message", {
      sender: userInfo._id,
      recipient: selectedConversation,
      content: message.trim(),
    });

    setMessage("");

    // stop typing indicator
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

    // emit typing start
    socketRef.current.emit("typing-start", {
      userId: userInfo._id,
      recipientId: selectedConversation,
    });

    // clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // stop typing after 2 seconds of no input
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
    <>
      <Header />
      <Flex height="calc(100vh - 80px)" bg="#232136">
        {/* sidebar */}
        <Box
          width={{ base: "100%", md: "350px" }}
          bg="#2a273f"
          boxShadow="lg"
          p="4"
          overflowY="auto"
          display={{ base: selectedConversation ? "none" : "block", md: "block" }}
        >
          <Text fontSize="2xl" fontWeight="bold" mb="4" color="#eb6f92">
            your matches
          </Text>
          <Divider mb="4" borderColor="#6e6a86" />
          {loading ? (
            <Flex justify="center" mt="8">
              <Spinner color="#eb6f92" size="lg" />
            </Flex>
          ) : matches.length === 0 ? (
            <Text color="#e0def4" textAlign="center" mt="8">
              no matches yet. keep swiping!
            </Text>
          ) : (
            <VStack spacing="3" align="stretch">
              {matches.map((match) => (
                <HStack
                  key={match._id}
                  p="3"
                  borderRadius="lg"
                  bg={selectedConversation === match._id ? "#393552" : "#2a273f"}
                  _hover={{ bg: "#393552", cursor: "pointer", transform: "translateX(4px)" }}
                  onClick={() => setSelectedConversation(match._id)}
                  transition="all 0.2s"
                  border="1px solid"
                  borderColor={selectedConversation === match._id ? "#eb6f92" : "transparent"}
                >
                  <Avatar
                    src={match.profile_pic || "https:// via.placeholder.com/50"}
                    name={match.preferred_name}
                    size="md"
                  />
                  <Box flex="1">
                    <Text fontWeight="medium" color="#e0def4">
                      {match.preferred_name}
                    </Text>
                    <Text fontSize="sm" color="#908caa" noOfLines={1}>
                      {match.genres?.[0] || "music lover"}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>

        {/* chat area */}
        <Flex
          flex="1"
          direction="column"
          bg="#232136"
          display={{ base: selectedConversation ? "flex" : "none", md: "flex" }}
        >
          {selectedConversation ? (
            <>
              {/* chat header */}
              <Box bg="#2a273f" color="#e0def4" p="4" boxShadow="md">
                <HStack>
                  <Button
                    display={{ base: "block", md: "none" }}
                    onClick={() => setSelectedConversation(null)}
                    size="sm"
                    bg="#393552"
                    color="#e0def4"
                    _hover={{ bg: "#524f67" }}
                  >
                    ← back
                  </Button>
                  <Avatar
                    src={selectedMatch?.profile_pic || "https:// via.placeholder.com/50"}
                    name={selectedMatch?.preferred_name}
                    size="sm"
                  />
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">
                      {selectedMatch?.preferred_name || "user"}
                    </Text>
                    {typingUsers.has(selectedConversation) && (
                      <Text fontSize="xs" color="#eb6f92">
                        typing...
                      </Text>
                    )}
                  </Box>
                </HStack>
              </Box>

              {/* messages */}
              <Flex
                flex="1"
                direction="column"
                p="4"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#2a273f',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#6e6a86',
                    borderRadius: '4px',
                  },
                }}
              >
                {messages.length === 0 ? (
                  <Flex align="center" justify="center" flex="1">
                    <Text color="#908caa" textAlign="center">
                      no messages yet. say hi! 👋
                    </Text>
                  </Flex>
                ) : (
                  messages.map((msg, index) => {
                    const isMyMessage = msg.sender._id === userInfo?._id || msg.sender === userInfo?._id;
                    return (
                      <Box
                        key={msg._id || index}
                        alignSelf={isMyMessage ? "flex-end" : "flex-start"}
                        bg={isMyMessage ? "#eb6f92" : "#393552"}
                        color="#e0def4"
                        p="3"
                        borderRadius="lg"
                        maxWidth="70%"
                        mb="2"
                        boxShadow="md"
                      >
                        <Text>{msg.content}</Text>
                        <Text fontSize="xs" color={isMyMessage ? "#f6c177" : "#908caa"} mt="1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Box>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </Flex>

              {/* input area */}
              <HStack p="4" borderTop="1px solid" borderColor="#393552" bg="#2a273f">
                <Input
                  placeholder="type a message..."
                  value={message}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  disabled={!selectedConversation || sending}
                  bg="#393552"
                  border="none"
                  color="#e0def4"
                  _placeholder={{ color: "#908caa" }}
                  _focus={{ boxShadow: "0 0 0 2px #eb6f92" }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!selectedConversation || !message.trim() || sending}
                  bg="#eb6f92"
                  color="#e0def4"
                  _hover={{ bg: "#d45879" }}
                  _disabled={{ bg: "#6e6a86", cursor: "not-allowed" }}
                  isLoading={sending}
                >
                  send
                </Button>
              </HStack>
            </>
          ) : (
            <Flex align="center" justify="center" flex="1">
              <Text color="#908caa" fontSize="lg" textAlign="center">
                select a match to start chatting
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default Messaging;
