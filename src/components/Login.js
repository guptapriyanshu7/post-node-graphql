import { useState, useEffect, useRef } from "react";
import { gql, useLazyQuery } from "@apollo/client";
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

const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
    }
  }
`;

function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { loading, error, data }] = useLazyQuery(LOGIN);

  let authSuccess = useRef(false);

  useEffect(() => {
    return () => {
      setAuth(authSuccess.current);
    };
  }, [setAuth]);

  if (data) {
    localStorage.setItem("token", data.login.token);
    authSuccess.current = true;
    return <Redirect to="/" />;
  }

  return (
    <Flex justifyContent="center">
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg" width="md">
        <Box>
          <Heading>Login</Heading>
        </Box>
        <Box my={4}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              login({ variables: { email: email, password: password } });
            }}
          >
            {error && (
              <Alert status="error" borderRadius={8} mt={6}>
                <AlertIcon />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <FormControl isRequired mt={6}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="test@test.com"
                size="lg"
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="*******"
                  size="lg"
                  onChange={(event) => setPassword(event.target.value)}
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
              Log In
            </Button>
          </form>
        </Box>
        <Box mt={6}>
          New to us?{" "}
          <Link as={ReactRouterLink} to="/signup" color="teal">
            Sign Up
          </Link>
        </Box>
      </Box>
    </Flex>
  );
}

export default Login;
