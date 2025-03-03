import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  useToast,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { apiBaseUrl } from "../../Constant/config";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";

const VerifyEmail = () => {
  const { token } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { mode: themeMode } = useSelector(
    (state: RootState) => state.themeMode
  );

  // Dynamic colors based on theme mode
  const bgColor = themeMode ? "white" : "gray.800";
  const textColor = themeMode ? "gray.800" : "white";
  const accentColor = themeMode ? "teal.500" : "teal.300";
  const borderColor = themeMode ? "gray.200" : "gray.600";
  const cardBgColor = themeMode ? "white" : "gray.700";

  const handleVerification = () => {
    if (token) {
      setIsLoading(true);
      fetch(`${apiBaseUrl}/auth/verify-email/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            toast({
              title: "Email verified successfully",
              description: "You can now login to your account",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            navigate("/login");
          } else {
            toast({
              title: "Email verification failed",
              description: data?.message || "Something went wrong",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Container
      maxW="lg"
      minH="100vh"
      centerContent
      py={10}
      // bg={bgColor}
      color={textColor}
      transition="all 0.3s ease"
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        h="100%"
      >
        <Box
          w="100%"
          p={8}
          borderRadius="xl"
          boxShadow="xl"
          bg={cardBgColor}
          borderWidth={1}
          borderColor={borderColor}
          transition="all 0.3s ease"
        >
          <Flex direction="column" align="center" justify="center" mb={6}>
            <Box
              w="80px"
              h="80px"
              borderRadius="full"
              bg={`${accentColor}20`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={4}
            >
              <Icon viewBox="0 0 24 24" boxSize={10} color={accentColor}>
                <path
                  fill="currentColor"
                  d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"
                />
              </Icon>
            </Box>

            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              mb={2}
              color={textColor}
            >
              Email Verification
            </Heading>

            <Text
              fontSize="md"
              textAlign="center"
              mb={6}
              color={themeMode ? "gray.600" : "gray.300"}
            >
              We have sent a verification link to your email address. Please
              verify your email to continue.
            </Text>
          </Flex>

          <Button
            colorScheme="teal"
            size="lg"
            onClick={handleVerification}
            width="full"
            borderRadius="lg"
            py={6}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.3s ease"
          >
            {isLoading ? (
              <Flex align="center" justify="center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </Flex>
            ) : (
              "Verify Email"
            )}
          </Button>

          <Text
            fontSize="xs"
            textAlign="center"
            mt={4}
            color={themeMode ? "gray.500" : "gray.400"}
          >
            Didn't receive an email? Check your spam folder or contact support.
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default VerifyEmail;

// import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom"; // To capture route params
// import {
//   Box,
//   Heading,
//   Text,
//   Button,
//   Container,
//   useToast,
// } from "@chakra-ui/react";
// import { apiBaseUrl } from "../../Constant/config";

// const VerifyEmail = () => {
//   const { token } = useParams(); // This will get the 'token' from the URL path
//   const toast = useToast();
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);

//   const handleVerification = () => {
//     setIsLoading(true);
//     fetch(`${apiBaseUrl}/verify-email/${token}`)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           toast({
//             title: "Email verified successfully",
//             description: "You can now login to your account",
//             status: "success",
//           });
//           navigate("/login");
//         }
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   return (
//     <Container maxW="lg" style={{ minHeight: "100vh" }} centerContent>
//       <Box
//         w="100%"
//         p={6}
//         mt={10}
//         borderWidth={1}
//         borderTopRadius="lg"
//         boxShadow="md"
//         bg="white"
//       >
//         <Heading as="h2" size="lg" textAlign="center" mb={4}>
//           Email Verification
//         </Heading>
//         <Text fontSize="md" textAlign="center" mb={4}>
//           We have sent a verification link to your email address.
//         </Text>
//         {/* <Text fontSize="lg" fontWeight="bold" color="teal.500" mb={6}>
//           Token: {token}
//         </Text> */}
//       </Box>

//       <Button
//         colorScheme="teal"
//         size="lg"
//         onClick={handleVerification}
//         width="full"
//         borderBottomRadius="lg"
//         borderTopRadius="0"
//       >
//         {isLoading ? (
//           <>
//             <svg
//               className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//             Verifying...
//           </>
//         ) : (
//           "Verify Email"
//         )}
//       </Button>
//     </Container>
//   );
// };

// export default VerifyEmail;
