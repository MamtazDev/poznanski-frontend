import React from "react";
import { useParams } from "react-router-dom"; // To capture route params
import { Box, Heading, Text, Button, Container } from "@chakra-ui/react"; 

const VerifyEmail = () => {
  const { token } = useParams(); // This will get the 'token' from the URL path

  const handleVerification = () => {
    console.log("Verifying token:", token);
  };

  return (
    <Container maxW="lg" centerContent>
      <Box 
        w="100%" 
        p={6} 
        mt={10} 
        borderWidth={1} 
        borderRadius="lg" 
        boxShadow="md" 
        bg="white"
      >
        <Heading as="h2" size="lg" textAlign="center" mb={4}>
          Email Verification
        </Heading>
        <Text fontSize="md" textAlign="center" mb={4}>
          We have sent a verification link to your email address.
        </Text>
        <Text fontSize="lg" fontWeight="bold" color="teal.500" mb={6}>
          Token: {token}
        </Text>
        <Button 
          colorScheme="teal" 
          size="lg" 
          onClick={handleVerification} 
          width="full"
        >
          Verify Email
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyEmail;
