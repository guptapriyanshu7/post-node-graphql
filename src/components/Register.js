import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link as ReactRouterLink, Redirect } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  AlertDescription,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const REGISTER = gql`
  mutation Register($userInput: UserInputData!) {
    createUser(userInput: $userInput) {
      _id
    }
  }
`;

function Register() {
  let emailEl, nameEl, passwordEl;

  const [showPassword, setShowPassword] = useState(false);

  const [register, { loading, error, data }] = useMutation(REGISTER);

  if (data) {
    return <Redirect to="/login" />;
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    register({
      variables: {
        userInput: {
          email: emailEl.value,
          name: nameEl.value,
          password: passwordEl.value,
        },
      },
    }).catch((err) => {});
  };

  return (
    <Flex justifyContent="center">
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" width="md">
        <Box>
          <Heading>Signup</Heading>
        </Box>
        <Box my={4}>
          <form onSubmit={onSubmitHandler}>
            {error && (
              <Alert status="error" borderRadius={8} mt={6}>
                <AlertIcon />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <FormControl isRequired mt={6}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="John Doe"
                size="lg"
                ref={(node) => (nameEl = node)}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="test@test.com"
                size="lg"
                ref={(node) => (emailEl = node)}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="*******"
                  size="lg"
                  ref={(node) => (passwordEl = node)}
                />
                <InputRightElement my={"0.2rem"} width={"3.2rem"}>
                  <IconButton
                    size="md"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              isLoading={loading}
              colorScheme="teal"
              variant="outline"
              type="submit"
              width="full"
              mt={6}
            >
              Sign Up
            </Button>
          </form>
        </Box>
        <Box mt={6}>
          Already registered?{" "}
          <Link as={ReactRouterLink} to="/login" color="teal">
            Log In
          </Link>
        </Box>
      </Box>
    </Flex>
  );
}

export default Register;
