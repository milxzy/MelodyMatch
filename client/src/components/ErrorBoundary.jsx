import { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Icon,
  Code,
  Collapse,
} from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    
    // Optionally reload the page
    if (this.props.resetOnError) {
      window.location.reload();
    }
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          bg="#232136"
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box
            bg="#2a273f"
            borderRadius="lg"
            p={8}
            maxW="600px"
            w="full"
            boxShadow="xl"
          >
            <VStack spacing={6} align="center">
              <Icon
                as={FaExclamationTriangle}
                boxSize={16}
                color="#EB6F92"
              />

              <Heading size="lg" color="#EB6F92" textAlign="center">
                Oops! Something went wrong
              </Heading>

              <Text color="#E0DEF4" textAlign="center">
                {this.props.fallbackMessage || 
                  "We're sorry for the inconvenience. Please try refreshing the page."}
              </Text>

              <VStack spacing={3} w="full">
                <Button
                  bg="#EB6F92"
                  color="white.pure"
                  _hover={{ bg: "#D45879" }}
                  onClick={this.handleReset}
                  w="full"
                  size="lg"
                >
                  Try Again
                </Button>

                <Button
                  variant="ghost"
                  color="#908CAA"
                  _hover={{ bg: "#393552" }}
                  onClick={this.toggleDetails}
                  size="sm"
                >
                  {this.state.showDetails ? 'Hide' : 'Show'} Error Details
                </Button>
              </VStack>

              <Collapse in={this.state.showDetails} style={{ width: '100%' }}>
                <Box
                  bg="#393552"
                  p={4}
                  borderRadius="md"
                  maxH="300px"
                  overflowY="auto"
                >
                  {this.state.error && (
                    <VStack align="start" spacing={3}>
                      <Box>
                        <Text color="#F6C177" fontSize="sm" fontWeight="bold" mb={1}>
                          Error Message:
                        </Text>
                        <Code
                          bg="#232136"
                          color="#EB6F92"
                          p={2}
                          borderRadius="md"
                          display="block"
                          whiteSpace="pre-wrap"
                          fontSize="xs"
                        >
                          {this.state.error.toString()}
                        </Code>
                      </Box>

                      {this.state.errorInfo && (
                        <Box>
                          <Text color="#F6C177" fontSize="sm" fontWeight="bold" mb={1}>
                            Stack Trace:
                          </Text>
                          <Code
                            bg="#232136"
                            color="#908CAA"
                            p={2}
                            borderRadius="md"
                            display="block"
                            whiteSpace="pre-wrap"
                            fontSize="xs"
                            maxH="200px"
                            overflowY="auto"
                          >
                            {this.state.errorInfo.componentStack}
                          </Code>
                        </Box>
                      )}
                    </VStack>
                  )}
                </Box>
              </Collapse>

              <Text color="#6E6A86" fontSize="sm" textAlign="center">
                If this problem persists, please contact support
              </Text>
            </VStack>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
