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
import { logoutRequest } from "../../Constant/api-requests";

// RootState should be defined in your application's store typings
interface RootState {
  user: any; // Replace 'any' with the actual user state type
}

const ProfilePage: React.FC<{ themeMode?: boolean }> = ({ themeMode }) => {
  const [profileImage, setProfileImage] = useState<string>(Defaultimg);
  const [name, setName] = useState<string>("Your Name");
  const [bio, setBio] = useState<string>("Your bio goes here...");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const userStore = useSelector((state: RootState) => state.user);

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
    <div className="mt-10">
      <Box minH="100vh" bg={themeMode ? "#454547" : "white"} className="container">
      <Flex direction={{ base: "column", md: "row" }}>
        {/* Sidebar */}
        <Box w={{ base: "full", md: "64" }} p={6} bg={themeMode ? "#6f6f71" : "white"}>
          <VStack spacing={6} align="center">
            <Avatar size="2xl" src={profileImage} mb={4} />
            <Button onClick={onOpen} colorScheme="blue" size="sm" width="full">
              Edit Profile
            </Button>
            <Button onClick={handleLogout} colorScheme="red" size="sm" width="full">
              Log Out
            </Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={8}>
          <Text fontSize="2xl" fontWeight="semibold" mb={6}>
            Public Profile
          </Text>
          <VStack spacing={6} align="stretch">
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
        </Box>
      </Flex>

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
    </div>
  );
};

export default ProfilePage;
