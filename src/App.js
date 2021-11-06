import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Posts from "./components/Posts";
import {
  Link as ReactrouterLink,
  Route,
  Switch,
  useHistory,
  Redirect,
} from "react-router-dom";
// import { useState } from "react";
import SinglePost from "./components/SinglePost";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import { gql, useQuery } from "@apollo/client";
import ThemeToggler from "./components/ThemeToggler";
import { Flex, Heading, Box, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useEffect } from "react";

const STATUS = gql`
  query {
    user {
      _id
      name
    }
  }
`;

function App() {
  let { loading, error, data } = useQuery(STATUS);
  // const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {}, [data]);

  if (loading) {
    return <p>Loading...</p>;
  }
  // if (error) {
  //   history.push("/login");
  // }
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
      <Route path="/login" path="/signup" exact>
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

  const logOutHandler = (e) => {
    localStorage.removeItem("token");
    // data = null;
    // setLoggedIn(false);
    // history.replace("/login");
    // return <Redirect to="/login" />;
  };

  return (
    <div className="App">
      <Flex justifyContent="space-between" p={4} mb={16}>
        <Heading as={ReactrouterLink} to="/">
          PostNode
        </Heading>
        <ThemeToggler />
        {data && (
          <Box>
            <Link as={ReactrouterLink} to="/create" color="teal">
              Create
            </Link>{" "}
            <b>{data.user.name}</b>{" "}
            <Button onClick={logOutHandler}>Logout</Button>
          </Box>
        )}
      </Flex>
      {routes}
    </div>
  );
}

export default App;
