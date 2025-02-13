import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const ResetPassword = () => {
  const { token } = useParams(); // This will get the 'token' from the URL path
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordReset = () => {
    console.log("Verifying token:", token);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    console.log(
      "Password reset with token:",
      token,
      "New password:",
      newPassword
    );
    setIsSuccess(true);
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
          Reset Your Password
        </Heading>
        Token: {token}
        {!isSuccess ? (
          <>
            <Text fontSize="md" textAlign="center" mb={4}>
              Enter your new password to reset it.
            </Text>
            {error && (
              <Text color="red.500" textAlign="center" mb={4}>
                {error}
              </Text>
            )}
            <FormControl mb={4}>
              <FormLabel htmlFor="new-password">New Password</FormLabel>
              <InputGroup>
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <InputRightElement>
                  <IconButton
                    icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle password visibility"
                    variant="link"
                  />
                </InputRightElement>
              </InputGroup>
              <FormHelperText textAlign="start" mt={2}>
                Password should be at least 8 characters long.
              </FormHelperText>
            </FormControl>

            <FormControl mb={6}>
              <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
                <InputRightElement>
                  <IconButton
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle password visibility"
                    variant="link"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              // colorScheme="teal"
              size="lg"
              onClick={handlePasswordReset}
              width="full"
              className=""
            >
              Reset Password
            </Button>
            <div className="g"></div>
          </>
        ) : (
          <Text color="green.500" fontSize="lg" textAlign="center">
            Your password has been successfully reset!
          </Text>
        )}
      </Box>
    </Container>
  );
};

export default ResetPassword;
