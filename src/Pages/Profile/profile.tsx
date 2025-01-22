import React, { useState } from "react";
import {
  Box,
  Avatar,
  Text,
  Stack,
  Button,
  Badge,
  Flex,
  Divider,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";

import { EditIcon } from "@chakra-ui/icons";

type UserProfile = {
  nickname: string;
  email: string;
  role: string;
  profilePicture?: string;
  isVerified: boolean;
};

const ProfilePage: React.FC<{ user: UserProfile }> = ({ user }) => {
  const textColor = useColorModeValue("gray.700", "gray.300");
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [editedNickname, setEditedNickname] = useState(user.nickname);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    onOpen();
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} p={4}>
      <Box
        maxW="4xl"
        mx="auto"
        p={6}
        mt="150px"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg={bgColor}
        borderColor={borderColor}
      >
        {/* Header Section */}
        <Flex align="center" direction="column" mb={6}>
          <Avatar size="2xl" src={profilePicture} name={user.nickname} mb={4} />
          <Button mt={2} size="sm" colorScheme="blue" as="label">
            Upload Image
            <Input type="file" hidden onChange={handleImageUpload} />
          </Button>
          <Stack spacing={2} textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              {user.nickname}
            </Text>
            <Text fontSize="md" color={textColor}>
              {user.email}
            </Text>
            {user.isVerified && (
              <Badge
                colorScheme="green"
                mt={2}
                px={3}
                py={1}
                borderRadius="full"
              >
                Verified
              </Badge>
            )}
          </Stack>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={handleEditClick}
            leftIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
        </Flex>

        <Divider mb={6} borderColor={borderColor} />

        {/* Profile Details Section */}
        <Stack
          spacing={4}
          bg={cardBg}
          p={4}
          borderRadius="md"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" color={textColor}>
              Role
            </Text>
            <Text color={textColor}>{user.role}</Text>
          </Flex>

          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" color={textColor}>
              Nickname
            </Text>
            <Text color={textColor}>{editedNickname}</Text>
          </Flex>

          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" color={textColor}>
              Email
            </Text>
            <Text color={textColor}>{editedEmail}</Text>
          </Flex>

          {isEditing && (
            <Button mt={4} colorScheme="blue" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          )}
          <Button mt={2} variant="outline" colorScheme="red">
            Delete Account
          </Button>
        </Stack>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bgColor}>
          <ModalHeader color={textColor}>Edit Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Flex direction="column">
                <Text fontWeight="bold" color={textColor}>
                  Nickname
                </Text>
                <Input
                  value={editedNickname}
                  onChange={(e) => setEditedNickname(e.target.value)}
                  bg={cardBg}
                  color={textColor}
                />
              </Flex>

              <Flex direction="column">
                <Text fontWeight="bold" color={textColor}>
                  Email
                </Text>
                <Input
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  bg={cardBg}
                  color={textColor}
                />
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveChanges}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProfilePage;
