import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Avatar,
  Spacer,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const Messaging = ({ userId }) => {
  const [matches, setMatches] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch matches on component mount
  useEffect(() => {
     const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const fetchMatches = async () => {
      setLoading(true);
      const storedData = localStorage.getItem("userInfo");
      const userInfo = JSON.parse(storedData);
      userId = userInfo._id;
      console.log(userInfo)
      
      
      
      try {
        const { data } = await axios.get(`https://melodymatch-3ro0.onrender.com/getMatches/${userId}`);
        setMatches(data.matches);
        // console.log(data.matches[0].preferred_name)
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
        console.log(matches[0])
      }
    };

    fetchMatches();
  }, [userId, toast]);

  const handleSendMessage = () => {
    if (message.trim() && selectedConversation) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedConversation]: [...(prevMessages[selectedConversation] || []), message],
      }));
      setMessage("");
    }
  };

  return (
    <Flex height="100vh" bg="gray.100">
      {/* Sidebar */}
      <Box width="300px" bg="white" boxShadow="md" p="4">
        <Text fontSize="lg" fontWeight="bold" mb="4">
          Matches
        </Text>
        {loading ? (
          <Spinner />
        ) : matches.length === 0 ? (
          <Text>No matches found</Text>
        ) : (
          <VStack spacing="4" align="stretch">
            
            {matches.map((match) => (
                
              <HStack
                key={match._id}
                p="3"
                borderRadius="md"
                bg={selectedConversation === match._id ? "blue.50" : "white"}
                _hover={{ bg: "blue.100", cursor: "pointer" }}
                onClick={() => setSelectedConversation(match._id)}
              >
                <Avatar src={match.avatar || "https://via.placeholder.com/50"} name={match.name} />
                <Text fontWeight="medium">{match.preferred_name}</Text>
              </HStack>
            ))}
          </VStack>
        )}
      </Box>

      {/* Chat Area */}
      <Flex flex="1" direction="column" bg="white" boxShadow="md">
        <Box bg="blue.500" color="white" p="4">
          <Text fontSize="lg" fontWeight="bold">
            {selectedConversation
              ? matches.find((m) => m._id === selectedConversation)?.name
              : "Select a match to chat"}
          </Text>
        </Box>

        {/* Messages */}
        <Flex flex="1" direction="column" p="4" overflowY="auto">
          {selectedConversation &&
            (messages[selectedConversation] || []).map((msg, index) => (
              <Box
                key={index}
                alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
                bg={index % 2 === 0 ? "gray.200" : "blue.200"}
                p="3"
                borderRadius="md"
                maxWidth="70%"
                mb="2"
              >
                {msg}
              </Box>
            ))}
        </Flex>

        {/* Input Area */}
        <HStack p="4" borderTop="1px solid" borderColor="gray.200">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedConversation}
          />
          <Button
            colorScheme="blue"
            onClick={handleSendMessage}
            disabled={!selectedConversation || !message.trim()}
          >
            Send
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default Messaging;
