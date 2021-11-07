import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Posts from "./components/Posts";
import {
  Link as ReactrouterLink,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import SinglePost from "./components/SinglePost";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import { gql, useQuery } from "@apollo/client";
import ThemeToggler from "./components/ThemeToggler";
import { Flex, Heading, Link, HStack, Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useApolloClient } from "@apollo/client";

const STATUS = gql`
  query {
    user {
      _id
      name
    }
  }
`;

function App() {
  let { loading, data } = useQuery(STATUS);
  const apolloClient = useApolloClient();

  if (loading) {
    console.log("Loading...");
    return <p>Loading...</p>;
  }

  const routes = !data ? (
    <Switch>
      <Route path="/login" exact component={Login} />
      <Route path="/signup" exact component={Register} />
      <Route path="*">
        <Redirect to="/login" />
      </Route>
    </Switch>
  ) : (
    <Switch>
      <Route path="/" exact component={Posts} />
      <Route path="/login" exact>
        <Redirect to="/" />
      </Route>
      <Route path="/signup" exact>
        <Redirect to="/" />
      </Route>
      <Route path="/create" exact component={CreatePost} />
      <Route path="/:id" exact component={SinglePost} />
      <Route path="/edit/:id" exact component={EditPost} />
      <Route path="*">
        <div>404</div>
      </Route>
    </Switch>
  );

  const logOutHandler = async (e) => {
    localStorage.removeItem("token");
    await apolloClient.resetStore();
  };

  return (
    <Box className="App">
      <Flex justifyContent="space-between" p={4} mb={12}>
        <Heading as={ReactrouterLink} to="/" color="teal">
          PostNode
        </Heading>
        <HStack spacing={8}>
          <ThemeToggler />
          {data && (
            <>
              <Link as={ReactrouterLink} to="/create" color="teal">
                Create
              </Link>
              <b>{data.user.name}</b>
              <Button onClick={logOutHandler}>Logout</Button>
            </>
          )}
        </HStack>
      </Flex>
      {routes}
    </Box>
  );
}

export default App;
