// Settings - Settings page with Kawaii Cute design
import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  useToast,
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
  Icon,
  Input,
  Circle,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiCamera, FiUser, FiHeart, FiAlertTriangle, FiSave, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { 
  ClayCard, 
  ClayCardBody, 
  ClayButton,
  DangerButton,
  GhostButton,
  FloatingShapes 
} from './ui';
import { GlowInput, GlowTextarea } from './ui/GlowInput';

const MotionBox = motion(Box);

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
        setFormData({ ...formData, profile_pic: reader.result });
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...formData, preferences }),
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
      <Box bg="surface.base" minH="100vh" position="relative" overflow="hidden" py={8}>
        <FloatingShapes variant="subtle" />
        
        <Container maxW="container.md" position="relative" zIndex={1}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <VStack spacing={6} align="stretch">
              <HStack spacing={3} justify="center">
                <Circle size="40px" bg="kawaii.pink">
                  <Icon as={FiSettings} boxSize={5} color="white.pure" />
                </Circle>
                <Heading
                  fontFamily="heading"
                  fontSize="2xl"
                  fontWeight="bold"
                  bgGradient="linear(135deg, kawaii.pink, kawaii.lilac)"
                  bgClip="text"
                >
                  Settings
                </Heading>
              </HStack>

              {/* Profile Information */}
              <ClayCard>
                <ClayCardBody>
                  <HStack mb={6}>
                    <Circle size="36px" bg="kawaii.pink">
                      <Icon as={FiUser} color="white.pure" boxSize={4} />
                    </Circle>
                    <Heading
                      fontFamily="heading"
                      fontSize="md"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      Profile Information
                    </Heading>
                  </HStack>

                  <form onSubmit={handleSubmit}>
                    <VStack spacing={6}>
                      {/* Profile Picture */}
                      <FormControl>
                        <FormLabel textAlign="center">Profile Picture</FormLabel>
                        <VStack spacing={3}>
                          <Box position="relative">
                            <Avatar
                              size="2xl"
                              src={imagePreview}
                              bg="surface.elevated"
                              border="4px solid"
                              borderColor="kawaii.pink"
                              boxShadow="0 6px 20px rgba(0, 0, 0, 0.15)"
                            />
                            <IconButton
                              icon={<FiCamera />}
                              position="absolute"
                              bottom="0"
                              right="0"
                              borderRadius="full"
                              bg="kawaii.lilac"
                              color="white.pure"
                              size="sm"
                              _hover={{ bg: "kawaii.pink" }}
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
                          <FormHelperText textAlign="center">
                            Click the camera icon to upload (max 5MB)
                          </FormHelperText>
                        </VStack>
                      </FormControl>

                      {/* Preferred Name */}
                      <FormControl>
                        <FormLabel fontFamily="body" fontWeight="semibold">Preferred Name</FormLabel>
                        <GlowInput
                          name="preferred_name"
                          value={formData.preferred_name}
                          onChange={handleChange}
                          placeholder="What should people call you?"
                        />
                      </FormControl>

                      {/* Bio */}
                      <FormControl>
                        <FormLabel fontFamily="body" fontWeight="semibold">Bio</FormLabel>
                        <GlowTextarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell others about yourself and your music taste..."
                          rows={4}
                          maxLength={500}
                        />
                        <FormHelperText>
                          {formData.bio.length}/500 characters
                        </FormHelperText>
                      </FormControl>

                      {/* Full Name */}
                      <FormControl>
                        <FormLabel fontFamily="body" fontWeight="semibold">Full Name</FormLabel>
                        <GlowInput
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </FormControl>

                      {/* Age */}
                      <FormControl>
                        <FormLabel fontFamily="body" fontWeight="semibold">Age</FormLabel>
                        <GlowInput
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                        />
                      </FormControl>

                      {/* Gender */}
                      <FormControl>
                        <FormLabel fontFamily="body" fontWeight="semibold">Gender</FormLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          bg="surface.muted"
                          border="2px solid"
                          borderColor="rgba(255, 200, 210, 0.12)"
                          borderRadius="2xl"
                          color="text.primary"
                          _hover={{ borderColor: "rgba(255, 200, 210, 0.2)" }}
                          _focus={{ borderColor: "kawaii.lilac", boxShadow: "0 0 0 1px rgba(212, 191, 255, 0.5)" }}
                        >
                          <option value="" style={{ background: '#1A1A2E' }}>Select gender</option>
                          <option value="male" style={{ background: '#1A1A2E' }}>Male</option>
                          <option value="female" style={{ background: '#1A1A2E' }}>Female</option>
                          <option value="non-binary" style={{ background: '#1A1A2E' }}>Non-binary</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </form>
                </ClayCardBody>
              </ClayCard>

              {/* Matching Preferences */}
              <ClayCard>
                <ClayCardBody>
                  <HStack mb={6}>
                    <Circle size="36px" bg="kawaii.lilac">
                      <Icon as={FiHeart} color="white.pure" boxSize={4} />
                    </Circle>
                    <Heading
                      fontFamily="heading"
                      fontSize="md"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      Matching Preferences
                    </Heading>
                  </HStack>

                  <VStack spacing={6} align="stretch">
                    {/* Interested In */}
                    <FormControl>
                      <FormLabel fontFamily="body" fontWeight="semibold">Interested In</FormLabel>
                      <CheckboxGroup
                        value={preferences.interestedIn}
                        onChange={(values) => setPreferences({ ...preferences, interestedIn: values })}
                      >
                        <Stack spacing={3}>
                          {['male', 'female', 'non-binary'].map((value) => (
                            <Checkbox
                              key={value}
                              value={value}
                              sx={{
                                '.chakra-checkbox__control': {
                                  bg: 'surface.muted',
                                  borderColor: 'rgba(255, 200, 210, 0.2)',
                                  borderRadius: 'lg',
                                  _checked: { bg: 'kawaii.pink', borderColor: 'kawaii.pink' }
                                },
                                '.chakra-checkbox__label': { color: 'text.secondary', fontFamily: 'body' }
                              }}
                            >
                              {value === 'male' ? 'Men' : value === 'female' ? 'Women' : 'Non-binary'}
                            </Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                      <FormHelperText>
                        Select all that apply. Leave blank to see everyone.
                      </FormHelperText>
                    </FormControl>

                    {/* Age Range */}
                    <FormControl>
                      <FormLabel fontFamily="body" fontWeight="semibold">
                        Age Range: {preferences.ageMin} - {preferences.ageMax}
                      </FormLabel>
                      <RangeSlider
                        min={18}
                        max={99}
                        step={1}
                        value={[preferences.ageMin, preferences.ageMax]}
                        onChange={(values) => setPreferences({ ...preferences, ageMin: values[0], ageMax: values[1] })}
                      >
                        <RangeSliderTrack bg="surface.muted" h="8px" borderRadius="full">
                          <RangeSliderFilledTrack bgGradient="linear(90deg, kawaii.pink, kawaii.lilac)" />
                        </RangeSliderTrack>
                        <RangeSliderThumb 
                          index={0} 
                          bg="kawaii.pink" 
                          boxSize={5} 
                          boxShadow="0 3px 8px rgba(0, 0, 0, 0.15)" 
                        />
                        <RangeSliderThumb 
                          index={1} 
                          bg="kawaii.lilac" 
                          boxSize={5} 
                          boxShadow="0 3px 8px rgba(0, 0, 0, 0.15)" 
                        />
                      </RangeSlider>
                    </FormControl>

                    <ClayButton
                      type="submit"
                      w="full"
                      size="lg"
                      leftIcon={<Icon as={FiSave} />}
                      isLoading={isLoading}
                      onClick={handleSubmit}
                    >
                      Save Changes
                    </ClayButton>
                  </VStack>
                </ClayCardBody>
              </ClayCard>

              {/* Danger Zone */}
              <ClayCard>
                <ClayCardBody>
                  <HStack mb={4}>
                    <Circle size="36px" bg="error">
                      <Icon as={FiAlertTriangle} color="white.pure" boxSize={4} />
                    </Circle>
                    <Heading
                      fontFamily="heading"
                      fontSize="md"
                      fontWeight="bold"
                      color="error"
                    >
                      Danger Zone
                    </Heading>
                  </HStack>
                  <Text fontFamily="body" color="text.muted" mb={4}>
                    Once you delete your account, there is no going back. Please be certain.
                  </Text>
                  <DangerButton onClick={() => setIsDeleteOpen(true)}>
                    Delete Account
                  </DangerButton>
                </ClayCardBody>
              </ClayCard>
            </VStack>
          </MotionBox>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay bg="rgba(15, 15, 26, 0.9)" backdropFilter="blur(10px)">
          <AlertDialogContent bg="surface.elevated" borderRadius="3xl" border="2px solid" borderColor="error">
            <AlertDialogHeader fontFamily="heading" fontWeight="bold" color="error">
              Delete Account
            </AlertDialogHeader>
            <AlertDialogBody fontFamily="body" color="text.secondary">
              Are you sure? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <GhostButton ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </GhostButton>
              <DangerButton onClick={handleDeleteAccount} ml={3}>
                Delete
              </DangerButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Settings;
