import useSWR from "swr";
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
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Layout";
import { profilePicRequest, profileUpdateRequest } from "../../Constant/api-requests";

const fetcher = (url:any) => fetch(url).then((res) => res.json());

const ProfilePage: React.FC<{ themeMode?: boolean }> = ({ themeMode }) => {
  const defaultImage = "profileImage";
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [nickname, setNickname] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userStore = useSelector((state) => state.user);
  const userInfo = userStore?.user;
  const userId = userInfo?._id;

  const { data: userData, mutate } = useSWR(
    userId ? `http://localhost:8000/api/auth/users/${userId}` : null,
    fetcher
  );

  // Handle profile image upload
  const handleImageUpload = async (e:any) => {
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

  // Handle nickname update
  const handleNicknameUpdate = async () => {
    if (!nickname) return;
    try {
      await profileUpdateRequest(userId, nickname);
      mutate(); // Revalidate SWR cache
      onClose();
    } catch (error) {
      console.error("Failed to update nickname", error);
    }
  };

  return (
    <Layout themeMode={themeMode}>
      <Box className="container mx-auto mt-10">
        <div className="flex gap-8 justify-center items-center">
          {/* Sidebar */}
          <Box className={`p-6 w-[300px] rounded-lg border ${themeMode ? "bg-gray-100 text-white" : "bg-gray-800 text-black"}`}>
            <div className="flex flex-col items-center space-y-6">
              <Avatar size="2xl" src={profileImage} mb={4} />
              <h2 className="text-xl font-semibold">{userData?.nickname || "User"}</h2>
              <Button onClick={onOpen} colorScheme="blue" size="sm" width="full">
                Edit Profile
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
                    <Avatar size="md" src={profileImage} />
                    <Button onClick={() => fileInputRef.current?.click()} colorScheme="blue">
                      Upload Image
                    </Button>
                    <Input type="file" accept="image/*" ref={fileInputRef} display="none" onChange={handleImageUpload} />
                  </HStack>
                </FormControl>
                <FormControl>
                  <FormLabel>Nickname</FormLabel>
                  <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Enter new nickname" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleNicknameUpdate}>
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
