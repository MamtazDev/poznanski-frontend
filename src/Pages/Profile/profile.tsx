import React, { useState, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Avatar,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import Defaultimg from "../../assets/png/profileImg1.png";
import { useDispatch, useSelector } from "react-redux";
import { deleteCookie } from "../../utils/auth";
import { logout } from "../../reducers/user";
import { logoutRequest, profilePicRequest, profileUpdateRequest } from "../../Constant/api-requests";
import Layout from "../../Components/Layout";

interface RootState {
  user: any;
}

const ProfilePage: React.FC<{ themeMode?: boolean }> = ({ themeMode }) => {
  const [profileImage, setProfileImage] = useState<string>(Defaultimg);
  const [name, setName] = useState<string>("Your Name");
  const [bio, setBio] = useState<string>("Your bio goes here...");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const userStore = useSelector((state: RootState) => state.user);
  console.log(userStore,"userStore");
  const userId = userStore?.user?.id;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const uploadedImageUrl = await profilePicRequest(file); // Get the uploaded image URL
        setProfileImage(uploadedImageUrl); // Update the profile image state with the new URL
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // Pass the userId, name, and profileImage URL to the update request
      await profileUpdateRequest(userId, name, profileImage);
      onClose();  // Close the modal after successful update
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    dispatch(logout());
    logoutRequest();
  };

  return (
    <Layout themeMode={themeMode}>
      <Box className="container h-[100vh] mx-auto">
         <div className="flex gap-8 justify-center items-center">
                  {/* Sidebar */}
                  <Box
                    className={`p-6 w-[300px] rounded-lg border ${
                      themeMode ? "bg-gray-100 text-white" : "bg-gray-800 text-black"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-6">
                      <Avatar size="3xl" src={profileImage} mb={4} />
                      <button
                        onClick={onOpen}
                        className={`submit-btn ${
                          themeMode ? "submit-btn" : "submit-btn-dark"
                        } flex place-items-center w-full cursor-pointer`}
                      >
                        Edit Profile
                      </button>
                      <Button onClick={handleLogout} colorScheme="red" size="sm" width="full">
                        Log Out
                      </Button>
                    </div>
                  </Box>

                  {/* Main Content */}
                  <Box flex={1} p={8}>
                    <h2
                      className={`text-2xl mb-6 font-semibold ${
                        themeMode ? "text-black" : "text-white"
                      }`}
                    >
                      Public Profile
                    </h2>
                    <VStack spacing={6} align="stretch">
                      <FormControl>
                        <FormLabel
                          className={`mb-6 font-semibold text-2xl ${
                            themeMode ? "text-black" : "text-white"
                          }`}
                        >
                          Name
                        </FormLabel>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className={`text-black focus:outline-none ${
                            themeMode ? "text-black" : "text-white"
                          }`}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          className={`text-2xl mb-6 font-semibold ${
                            themeMode ? "text-black" : "text-white"
                          }`}
                        >
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
                      colorScheme="blue"
                    >
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
      </Box>
    </Layout>
  );
};

export default ProfilePage;
