import { useState, useRef } from "react"
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
  Grid,
  GridItem,
  Container,
  Divider,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react"

// Default profile image
import Defaultimg from "../../assets/png/profileImg1.png";

export default function ProfilePage() {
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState(Defaultimg)
  const [editForm, setEditForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfileImage(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle edit form changes
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your form submission logic here
    console.log("Form submitted:", editForm)
    onClose()
  }

  return (
 <div className="container">
     <Box minH="100vh" bg="white">
      <Flex>
        {/* Sidebar */}
        <Box w="64" borderRight="1px" borderColor="gray.200" p={6}>
          <VStack spacing={6}>
            <Box textAlign="center">
              <Avatar size="2xl" src={profileImage} mb={4} />
              <Button onClick={onOpen} colorScheme="blue" size="sm" width="full">
                Edit profile
              </Button>
            </Box>
            <VStack as="nav" spacing={2} align="stretch" width="full">
              <Button variant="ghost" justifyContent="flex-start">
                Account settings
              </Button>
              <Button variant="ghost" justifyContent="flex-start">
                Advanced settings
              </Button>
              <Button variant="outline" justifyContent="flex-start">
                Keluar
              </Button>
            </VStack>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={8}>
          <Container maxW="3xl">
            <Text fontSize="2xl" fontWeight="semibold" mb={6}>
              Public Profile
            </Text>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Nama</FormLabel>
                <Input placeholder="Enter your name" />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Use your real name to get verified and help your teammates
                </Text>
              </FormControl>
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea placeholder="Write something about yourself..." minH="32" />
              </FormControl>
            </VStack>
          </Container>
        </Box>
      </Flex>
      {/* Edit Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Profile Picture</FormLabel>
                <HStack>
                  <Avatar size="md" src={profileImage} />
                  <Button onClick={() => fileInputRef.current?.click()} colorScheme="blue">
                    Upload Image
                  </Button>
                  <Input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} display="none" />
                </HStack>
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  placeholder="Enter your email"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Current Password</FormLabel>
                <Input
                  name="currentPassword"
                  type="password"
                  value={editForm.currentPassword}
                  onChange={handleEditFormChange}
                  placeholder="Enter current password"
                />
              </FormControl>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  name="newPassword"
                  type="password"
                  value={editForm.newPassword}
                  onChange={handleEditFormChange}
                  placeholder="Enter new password"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={editForm.confirmPassword}
                  onChange={handleEditFormChange}
                  placeholder="Confirm new password"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
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
  )
}
