import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
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
  Avatar,
  HStack,
  IconButton,
  FormHelperText,
  Checkbox,
  CheckboxGroup,
  Stack,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    bio: '',
    profile_pic: '',
    preferred_name: '',
  });
  const [preferences, setPreferences] = useState({
    interestedIn: [],
    ageMin: 18,
    ageMax: 99,
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef();
  const toast = useToast();
  const navigate = useNavigate();
  const cancelRef = useRef();

  const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const userId = userInfo?._id || userInfo?.id;

      const response = await fetch(`${API_URL}/getUserById/${userId}`);

      const data = await response.json();
      if (data.user) {
        setFormData({
          name: data.user.name || '',
          age: data.user.age || '',
          gender: data.user.gender || '',
          bio: data.user.bio || '',
          profile_pic: data.user.profile_pic || data.user.pic || '',
          preferred_name: data.user.preferred_name || '',
        });
        setPreferences({
          interestedIn: data.user.preferences?.interestedIn || [],
          ageMin: data.user.preferences?.ageMin || 18,
          ageMax: data.user.preferences?.ageMax || 99,
        });
        setImagePreview(data.user.profile_pic || data.user.pic || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Error',
          description: 'Please upload an image file',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          profile_pic: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const userId = userInfo?._id || userInfo?.id;

      const response = await fetch(`${API_URL}/updateUserProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData,
          preferences
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Update localStorage with new data
        const updatedUserInfo = { ...userInfo, ...data.user };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
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
              <Heading size="md" color="#eb6f92" mb={6}>
                Profile Information
              </Heading>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  {/* Profile Picture */}
                  <FormControl>
                    <FormLabel color="#e0def4" textAlign="center">Profile Picture</FormLabel>
                    <VStack spacing={3}>
                      <Box position="relative">
                        <Avatar
                          size="2xl"
                          src={imagePreview}
                          bg="#393552"
                          color="#e0def4"
                        />
                        <IconButton
                          icon={<FaCamera />}
                          position="absolute"
                          bottom="0"
                          right="0"
                          borderRadius="full"
                          bg="#eb6f92"
                          color="white"
                          size="sm"
                          _hover={{ bg: "#d64d73" }}
                          onClick={() => fileInputRef.current.click()}
                          aria-label="Upload profile picture"
                        />
                      </Box>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        display="none"
                      />
                      <FormHelperText color="#908CAA" textAlign="center">
                        Click the camera icon to upload a new picture (max 5MB)
                      </FormHelperText>
                    </VStack>
                  </FormControl>

                  {/* Preferred Name */}
                  <FormControl>
                    <FormLabel color="#e0def4">Preferred Name</FormLabel>
                    <Input
                      name="preferred_name"
                      value={formData.preferred_name}
                      onChange={handleChange}
                      placeholder="What should people call you?"
                      bg="#393552"
                      color="#e0def4"
                      border="1px solid"
                      borderColor="#6E6A86"
                      _hover={{ borderColor: "#908CAA" }}
                      _focus={{ 
                        borderColor: "#EB6F92", 
                        boxShadow: "0 0 0 1px #EB6F92" 
                      }}
                    />
                  </FormControl>

                  {/* Bio */}
                  <FormControl>
                    <FormLabel color="#e0def4">Bio</FormLabel>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell others about yourself and your music taste..."
                      bg="#393552"
                      color="#e0def4"
                      border="1px solid"
                      borderColor="#6E6A86"
                      rows={4}
                      maxLength={500}
                      _hover={{ borderColor: "#908CAA" }}
                      _focus={{ 
                        borderColor: "#EB6F92", 
                        boxShadow: "0 0 0 1px #EB6F92" 
                      }}
                    />
                    <FormHelperText color="#908CAA">
                      {formData.bio.length}/500 characters
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="#e0def4">Full Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      bg="#393552"
                      color="#e0def4"
                      border="1px solid"
                      borderColor="#6E6A86"
                      _hover={{ borderColor: "#908CAA" }}
                      _focus={{ 
                        borderColor: "#EB6F92", 
                        boxShadow: "0 0 0 1px #EB6F92" 
                      }}
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
                      border="1px solid"
                      borderColor="#6E6A86"
                      _hover={{ borderColor: "#908CAA" }}
                      _focus={{ 
                        borderColor: "#EB6F92", 
                        boxShadow: "0 0 0 1px #EB6F92" 
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="#e0def4">Gender</FormLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      bg="#393552"
                      color="#e0def4"
                      border="1px solid"
                      borderColor="#6E6A86"
                      _hover={{ borderColor: "#908CAA" }}
                      _focus={{ 
                        borderColor: "#EB6F92", 
                        boxShadow: "0 0 0 1px #EB6F92" 
                      }}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                    </Select>
                  </FormControl>

                  <Divider borderColor="#6E6A86" />

                  {/* Matching Preferences Section */}
                  <Heading size="sm" color="#eb6f92" alignSelf="flex-start">
                    Matching Preferences
                  </Heading>

                  <FormControl>
                    <FormLabel color="#e0def4">Interested In</FormLabel>
                    <CheckboxGroup
                      value={preferences.interestedIn}
                      onChange={(values) => setPreferences({ ...preferences, interestedIn: values })}
                    >
                      <Stack spacing={3} direction="column">
                        <Checkbox
                          value="male"
                          colorScheme="pink"
                          iconColor="white"
                          sx={{
                            '.chakra-checkbox__control': {
                              bg: '#393552',
                              borderColor: '#6E6A86',
                              _checked: {
                                bg: '#EB6F92',
                                borderColor: '#EB6F92'
                              }
                            },
                            '.chakra-checkbox__label': {
                              color: '#e0def4'
                            }
                          }}
                        >
                          Men
                        </Checkbox>
                        <Checkbox
                          value="female"
                          colorScheme="pink"
                          iconColor="white"
                          sx={{
                            '.chakra-checkbox__control': {
                              bg: '#393552',
                              borderColor: '#6E6A86',
                              _checked: {
                                bg: '#EB6F92',
                                borderColor: '#EB6F92'
                              }
                            },
                            '.chakra-checkbox__label': {
                              color: '#e0def4'
                            }
                          }}
                        >
                          Women
                        </Checkbox>
                        <Checkbox
                          value="non-binary"
                          colorScheme="pink"
                          iconColor="white"
                          sx={{
                            '.chakra-checkbox__control': {
                              bg: '#393552',
                              borderColor: '#6E6A86',
                              _checked: {
                                bg: '#EB6F92',
                                borderColor: '#EB6F92'
                              }
                            },
                            '.chakra-checkbox__label': {
                              color: '#e0def4'
                            }
                          }}
                        >
                          Non-binary
                        </Checkbox>
                      </Stack>
                    </CheckboxGroup>
                    <FormHelperText color="#908CAA">
                      Select all that apply. Leave blank to see everyone.
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="#e0def4">Age Range: {preferences.ageMin} - {preferences.ageMax}</FormLabel>
                    <RangeSlider
                      min={18}
                      max={99}
                      step={1}
                      value={[preferences.ageMin, preferences.ageMax]}
                      onChange={(values) => setPreferences({ ...preferences, ageMin: values[0], ageMax: values[1] })}
                      colorScheme="pink"
                    >
                      <RangeSliderTrack bg="#393552">
                        <RangeSliderFilledTrack bg="#EB6F92" />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} bg="#EB6F92" />
                      <RangeSliderThumb index={1} bg="#EB6F92" />
                    </RangeSlider>
                    <FormHelperText color="#908CAA">
                      Set your preferred age range for matches
                    </FormHelperText>
                  </FormControl>

                  <Button
                    type="submit"
                    bg="#eb6f92"
                    color="white"
                    width="full"
                    size="lg"
                    isLoading={isLoading}
                    _hover={{ bg: "#d64d73", transform: "translateY(-2px)" }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s"
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
