import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Divider,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const cancelRef = useRef();

  const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-3ro0.onrender.com';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const response = await fetch(`${API_URL}/getUserById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.user) {
        setFormData({
          name: data.user.name || '',
          age: data.user.age || '',
          gender: data.user.gender || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/profile/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmDelete: true }),
      });

      if (response.ok) {
        localStorage.clear();
        toast({
          title: 'Account Deleted',
          description: 'Your account has been deleted successfully',
          status: 'info',
          duration: 3000,
        });
        navigate('/');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Header />
      <Box bg="#232136" minH="100vh" py={8}>
        <Container maxW="container.md">
          <VStack spacing={6} align="stretch">
            <Heading color="#eb6f92" size="xl">
              Settings
            </Heading>

            <Box bg="#2a273f" p={6} borderRadius="lg">
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel color="#e0def4">Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      bg="#393552"
                      color="#e0def4"
                      border="none"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="#e0def4">Age</FormLabel>
                    <Input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      bg="#393552"
                      color="#e0def4"
                      border="none"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="#e0def4">Gender</FormLabel>
                    <Input
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      bg="#393552"
                      color="#e0def4"
                      border="none"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    bg="#eb6f92"
                    color="white"
                    width="full"
                    isLoading={isLoading}
                    _hover={{ bg: "#d64d73" }}
                  >
                    Save Changes
                  </Button>
                </VStack>
              </form>
            </Box>

            <Divider />

            <Box bg="#2a273f" p={6} borderRadius="lg">
              <Heading size="md" color="#eb6f92" mb={4}>
                Danger Zone
              </Heading>
              <Text color="#e0def4" mb={4}>
                Once you delete your account, there is no going back. Please be certain.
              </Text>
              <Button
                colorScheme="red"
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete Account
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="#2a273f">
            <AlertDialogHeader color="#eb6f92">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody color="#e0def4">
              Are you sure? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Settings;
