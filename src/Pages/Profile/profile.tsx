import React, { useState, useRef } from "react";
import {
  Box,
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
import { logoutRequest } from "../../Constant/api-requests";
import Layout from "../../Components/Layout";

interface RootState {
  user: {
    name: string;
    bio: string;
  }; // Replace with actual user state type
}

const ProfilePage: React.FC<{ themeMode?: boolean }> = ({ themeMode }) => {
  const userStore = useSelector((state: RootState) => state.user);
  const [profileImage, setProfileImage] = useState<string>(Defaultimg);
  const [name, setName] = useState<string>(userStore.name || "Your Name");
  const [bio, setBio] = useState<string>(userStore.bio || "Your bio goes here...");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
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
                    className={`px-3 py-4 ${
                      themeMode ? "text-white" : "text-black"
                    }`}
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
              <Button colorScheme="blue" mr={3} onClick={onClose}>
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
