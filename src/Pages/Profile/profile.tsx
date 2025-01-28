import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout";
import {
  logoutRequest,
  profilePicRequest,
  profileUpdateRequest,
} from "../../Constant/api-requests";
import { logout } from "../../reducers/user";
import { deleteCookie } from "../../utils/auth";

interface RootState {
  user: any;
}

const ProfilePage: React.FC<{ themeMode?: boolean }> = ({ themeMode }) => {
  const defaultImage = "profileImage"; // Default image placeholder
  const [profileImage, setProfileImage] = useState<string>(defaultImage);
  const [name, setName] = useState<string>("Your Name");
  const [bio, setBio] = useState<string>("Your bio goes here...");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const userStore = useSelector((state: RootState) => state.user);
  const userInfo = userStore?.user;
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();
  // Load initial data from userInfo
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.nickname || "Your Name");
      setProfileImage(userInfo.profilePicture || defaultImage);
    }
  }, [userInfo]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const uploadedImageUrl = await profilePicRequest(file);
        setProfileImage(uploadedImageUrl);
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await profileUpdateRequest(userInfo.id, name, profileImage);
      onClose();
      handleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    dispatch(logout());
    logoutRequest();
    navigate("/login");
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!currentPassword || !newPassword) {
      setError("All fields are required");
      return;
    }
    setError(null);
    console.log("Password reset request sent");
    // Add API call logic here
    onResetClose();
  };

  return (
    <Layout themeMode={themeMode}>
      <Box className="container  mx-auto mt-10">
        <div className="flex gap-8 justify-center items-center">
          {/* Sidebar */}
          <Box
            className={`p-6 w-[300px] rounded-lg border ${themeMode ? "bg-gray-100 text-white" : "bg-gray-800 text-black"
              }`}>
            <div className="flex flex-col items-center space-y-6">
              <Avatar size="3xl" src={profileImage} mb={4} />
              <button
                style={{
                  width: 250,
                }
                }
                onClick={onOpen}
                className={`submit-btn ${themeMode ? "submit-btn" : "submit-btn-dark"
                  } flex place-items-center w-full cursor-pointer`}>
                Edit Profile
              </button>
              <button
                className={`reset-btn ${themeMode ? "reset-btn" : "reset-btn-dark"
                  } flex place-items-center w-full cursor-pointer`}
                onClick={onResetOpen}
              >
                Reset Password
              </button>
              <Button
                onClick={handleLogout}
                colorScheme="red"
                size="sm"
                width="full">
                Log Out
              </Button>
            </div>
          </Box>

          {/* Main Content */}
          <Box flex={1} p={8}>
            <h2
              className={`text-2xl mb-6 font-semibold ${themeMode ? "text-black" : "text-white"
                }`}>
              Public Profile
            </h2>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel
                  className={`mb-6 font-semibold text-2xl ${themeMode ? "text-black" : "text-white"
                    }`}>
                  Name
                </FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={`text-black focus:outline-none ${themeMode ? "text-black" : "text-white"
                    }`}
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  className={`text-2xl mb-6 font-semibold ${themeMode ? "text-black" : "text-white"
                    }`}>
                  Bio
                </FormLabel>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something about yourself..."
                  minH="32"
                  className={`${themeMode ? "text-black" : "text-white"}`}
                />
              </FormControl>
            </VStack>
          </Box>
        </div>

        {/* Edit Profile Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Profile Picture</FormLabel>
                  <HStack>
                    <Avatar size="md" src={profileImage} />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      colorScheme="blue">
                      Upload Image
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      display="none"
                    />
                  </HStack>
                </FormControl>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write something about yourself..."
                    minH="32"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleProfileUpdate}>
                Save Changes
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* reset modal  */}
        <div className="flex justify-center pt-28">
          <Modal isOpen={isResetOpen} onClose={onResetClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Reset Password</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Current Password</FormLabel>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </FormControl>
                  {error && <p className="text-red-500">{error}</p>}
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleResetPassword}>
                  Reset Password
                </Button>
                <Button variant="ghost" onClick={onResetClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </Box>
    </Layout>
  );
};

export default ProfilePage;