import { useEffect, useState } from 'react'
import axios from 'axios'
import {useNavigate, Link as RouterLink} from 'react-router-dom'
import Header from './Header';

import { 
  Flex, 
  Center, 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  VStack, 
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  useToast
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'https://melodymatch-production.up.railway.app';

const BeRegister= () => {
const navigate = useNavigate()
const toast = useToast()
const [email, setEmail] = useState('') 
const [pass, setPass] = useState('')
const [confirmPass, setConfirmPass] = useState('')
const [loginName, setLoginName] = useState('')
const [, setError] = useState(false)
const [showPassword, setShowPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)
const [isLoading, setIsLoading] = useState(false)

useEffect(() => {
  const userInfo = localStorage.getItem("userInfo");
  if(userInfo){
    navigate("/profile")
  }
}, [navigate])

  

const submitHandler = async (e) => {
  e.preventDefault()
  
  // Validation
  if (!loginName || !email || !pass || !confirmPass) {
    toast({
      title: 'Missing Fields',
      description: 'Please fill in all fields',
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
    return
  }
  
  if (pass !== confirmPass) {
    toast({
      title: 'Password Mismatch',
      description: 'Passwords do not match',
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
    return
  }
  
  if (pass.length < 6) {
    toast({
      title: 'Weak Password',
      description: 'Password must be at least 6 characters',
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
    return
  }
  
  try{
    setIsLoading(true)
    const config = {
      headers: {
        "Content-type": "application/json"
      },
    };
    
    const {data} = await axios.post(
      `${API_URL}/registeruser`,
      {
         loginName, email, pass
      },
      config
    )
    
    // Save both userInfo and token separately
    localStorage.setItem("userInfo", JSON.stringify(data))
    localStorage.setItem("token", data.token)
    
    toast({
      title: 'Registration Successful',
      description: 'Welcome to MelodyMatch!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    
    // Check if user needs to complete migration (connect platforms)
    if (!data.hasCompletedMigration && data.connectedPlatforms?.length === 0) {
      navigate("/migrate")
    } else {
      navigate("/profile")
    }

  } catch (error){
    console.error(error)
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
    setError(errorMessage)
    toast({
      title: 'Registration Failed',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  } finally {
    setIsLoading(false)
  }
}



  return (
    <>
    <Header />
     <Flex 
       alignContent="center" 
       bg="#232136" 
       justifyContent="center" 
       minHeight="100vh"
       py={12}
     >
      <Center width="100%">
        <Box
          maxW="450px"
          w="full"
          bg="#2A273F"
          borderRadius="xl"
          boxShadow="2xl"
          p={8}
          mx={4}
        >
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading 
                as="h1" 
                size="xl" 
                color="#EB6F92"
                mb={2}
              >
                Create Account
              </Heading>
              <Text color="#908CAA" fontSize="sm">
                Join MelodyMatch and find your music soulmate
              </Text>
            </Box>

            <form onSubmit={submitHandler}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="#E0DEF4" fontSize="sm" fontWeight="medium">
                    Name
                  </FormLabel>
                  <Input
                    type="text"
                    id="loginName"
                    value={loginName}
                    placeholder="Enter your name"
                    onChange={(e) => setLoginName(e.target.value)}
                    bg="#232136"
                    border="1px solid"
                    borderColor="#6E6A86"
                    color="#E0DEF4"
                    _placeholder={{ color: "#6E6A86" }}
                    _hover={{ borderColor: "#908CAA" }}
                    _focus={{ 
                      borderColor: "#EB6F92", 
                      boxShadow: "0 0 0 1px #EB6F92" 
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="#E0DEF4" fontSize="sm" fontWeight="medium">
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    bg="#232136"
                    border="1px solid"
                    borderColor="#6E6A86"
                    color="#E0DEF4"
                    _placeholder={{ color: "#6E6A86" }}
                    _hover={{ borderColor: "#908CAA" }}
                    _focus={{ 
                      borderColor: "#EB6F92", 
                      boxShadow: "0 0 0 1px #EB6F92" 
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="#E0DEF4" fontSize="sm" fontWeight="medium">
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="pass"
                      value={pass}
                      placeholder="Enter your password"
                      onChange={(e) => setPass(e.target.value)}
                      bg="#232136"
                      border="1px solid"
                      borderColor="#6E6A86"
                      color="#E0DEF4"
                      _placeholder={{ color: "#6E6A86" }}
                      _hover={{ borderColor: "#908CAA" }}
                      _focus={{ 
                        borderColor: "#EB6F92", 
                        boxShadow: "0 0 0 1px #EB6F92" 
                      }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        color="#908CAA"
                        _hover={{ color: "#EB6F92" }}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Text color="#6E6A86" fontSize="xs" mt={1}>
                    Must be at least 6 characters
                  </Text>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="#E0DEF4" fontSize="sm" fontWeight="medium">
                    Confirm Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPass"
                      value={confirmPass}
                      placeholder="Confirm your password"
                      onChange={(e) => setConfirmPass(e.target.value)}
                      bg="#232136"
                      border="1px solid"
                      borderColor="#6E6A86"
                      color="#E0DEF4"
                      _placeholder={{ color: "#6E6A86" }}
                      _hover={{ borderColor: "#908CAA" }}
                      _focus={{ 
                        borderColor: "#EB6F92", 
                        boxShadow: "0 0 0 1px #EB6F92" 
                      }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        variant="ghost"
                        color="#908CAA"
                        _hover={{ color: "#EB6F92" }}
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  bg="#EB6F92"
                  color="white"
                  size="lg"
                  mt={4}
                  _hover={{ 
                    bg: "#D45879",
                    transform: "translateY(-2px)",
                    boxShadow: "lg"
                  }}
                  _active={{ 
                    bg: "#C04868",
                    transform: "translateY(0)"
                  }}
                  isLoading={isLoading}
                  loadingText="Creating Account..."
                  transition="all 0.2s"
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            <Box textAlign="center" pt={4} borderTop="1px solid" borderColor="#393552">
              <Text color="#908CAA" fontSize="sm">
                Already have an account?{' '}
                <Link 
                  as={RouterLink} 
                  to="/belogin" 
                  color="#EB6F92"
                  fontWeight="medium"
                  _hover={{ 
                    color: "#D45879",
                    textDecoration: "underline"
                  }}
                >
                  Sign in
                </Link>
              </Text>
            </Box>
          </VStack>
        </Box>
      </Center>
     </Flex>
    </>
  )
}

export default BeRegister