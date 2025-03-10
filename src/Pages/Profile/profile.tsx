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
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Components/Layout";
import {
  logoutRequest,
  profilePicRequest,
  profileUpdateRequest,
} from "../../Constant/api-requests";
import { deleteCookie } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { logout } from "../../reducers/user";

const ProfilePage: React.FC<{ themeMode?: boolean }> = ({ themeMode }) => {
  const defaultImage = "profileImage";
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [nickname, setNickname] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user info from Redux state
  const userStore = useSelector((state: any) => state.user);
  const userInfo = userStore?.user;

  // Function to update localStorage
  const updateLocalStorage = (nickname: string, profileImage: string) => {
    const updatedUserInfo = {
      ...userInfo,
      nickname,
      profilePicture: profileImage,
    };
    localStorage.setItem("creds", JSON.stringify(updatedUserInfo));
  };

  const [newImage, setNewImage] = useState<File | null>(null);

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file) {
        setNewImage(file);
      }
    }
  };

  // Handle nickname update
  const handleSubmit = async () => {
    try {
      if (newImage) {
        const uploadedImageUrl = await profilePicRequest(newImage);
        if (uploadedImageUrl) {
          setProfileImage(uploadedImageUrl); // Set the uploaded image URL here
        }
      }
      // Call the profileUpdateRequest with user ID, nickname, and profile image
      await profileUpdateRequest(userInfo._id, nickname, profileImage);
      console.log("Profile updated successfully");

      // Update localStorage with new nickname and image
      updateLocalStorage(nickname, profileImage);

      // Close the modal after saving the changes
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("creds") || "{}");
    setProfileImage(userInfo?.profilePicture || defaultImage);
    setNickname(userInfo?.nickname || "");
  }, []);

  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    dispatch(logout());
    logoutRequest();
    navigate("/login");
  };

  return (
    <Layout themeMode={themeMode}>
      <Box className="container mx-auto mt-10">
        <div className="flex gap-8 justify-center items-center">
          {/* Sidebar */}
          <Box
            className={`p-6 w-[300px] rounded-lg border ${themeMode ? "bg-gray-100 text-white" : "bg-gray-800 text-black"}`}
          >
            <div className="flex flex-col items-center space-y-6">
              <Avatar
                size="2xl"
                src={profileImage} // Convert File to URL
                mb={4}
              />

              {/* Display nickname directly */}
              <h2
                className="text-xl font-medium"
                style={{ color: themeMode ? "black" : "white" }}
              >
                {nickname || "User"}
              </h2>
              <Button
                onClick={onOpen}
                colorScheme="blue"
                size="sm"
                width="full"
              >
                Edit Profile
              </Button>
              <Button
                onClick={handleLogout}
                colorScheme="red"
                size="sm"
                width="full"
              >
                Log Out
              </Button>
            </div>
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
                    <Avatar
                      size="md"
                      src={
                        newImage ? URL.createObjectURL(newImage) : profileImage
                      }
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      colorScheme="blue"
                    >
                      Upload Image
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      display="none"
                      onChange={handleImageUpload}
                    />
                  </HStack>
                </FormControl>
                <FormControl>
                  <FormLabel>Nickname</FormLabel>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter new nickname"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Save Changes
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

export default ProfilePage;
