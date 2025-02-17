import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Layout from "../../Components/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import { apiBaseUrl } from "../../Constant/config";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(10); // Initial countdown value

  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/login");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isSuccess, navigate]);

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Password fields cannot be empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password. Please try again.");
        return;
      }

      // console.log("Password reset successful");
      setIsSuccess(true);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout themeMode={themeMode}>
      <div className="flex justify-center mx-auto py-[120px]">
        <div>
          <h2 className="text-center text-3xl font-semibold mb-4" style={{ color: themeMode ? "black" : "white" }}>
            Reset Your Password
          </h2>
          <span style={{ color: themeMode ? "#5A1073" : "#3BD6C6" }}>Token: {token}</span>

          {!isSuccess ? (
            <>
              <h2 className="text-xl font-medium text-center mb-3" style={{ color: themeMode ? "black" : "#fff" }}>
                Enter your new password to reset it.
              </h2>

              {error && <Text color="red.500" textAlign="center" mb={4}>{error}</Text>}

              <FormControl mb={4}>
                <FormLabel htmlFor="new-password" style={{ color: themeMode ? "black" : "#BBBCC0" }}>
                  New Password
                </FormLabel>
                <InputGroup>
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    style={{ color: themeMode ? "black" : "#fff" }}
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
                <FormLabel htmlFor="confirm-password" style={{ color: themeMode ? "black" : "#BBBCC0" }}>
                  Confirm Password
                </FormLabel>
                <InputGroup>
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    style={{ color: themeMode ? "black" : "#fff" }}
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
                size="lg"
                onClick={handlePasswordReset}
                width="full"
                style={{
                  color: themeMode ? "#5A1073" : "#3BD6C6",
                  backgroundColor: themeMode ? "#3BD6C6" : "#5A1073",
                }}
              >
                Reset Password
              </Button>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-medium mb-3" style={{ color: themeMode ? "#22BB33" :  "#22BB33"  }}>
                Your password has been successfully reset!
              </h3>
              <h3 className="text-xl font-bold" style={{
                color:themeMode? "#818ff0":"#5daf8c"
              }}>
                Redirecting to login in <span className="text-2xl">{countdown}</span> seconds...
              </h3>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
