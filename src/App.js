import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Posts from "./components/Posts";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { useState } from "react";
import SinglePost from "./components/SinglePost";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import { gql, useQuery } from "@apollo/client";

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
  const [loggedIn, setLoggedIn] = useState(true);
  const history = useHistory();
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    history.push("/login");
  }
  const routes = (
    <Switch>
      <Route path="/" exact>
        <Posts />
      </Route>
      <Route path="/login" exact>
        <Login setAuth={setLoggedIn} />
      </Route>
      <Route path="/signup" exact>
        <Register />
      </Route>
      <Route path="/create" exact>
        <CreatePost />
      </Route>
      <Route path="/:id" exact>
        <SinglePost />
      </Route>
      <Route path="/edit/:id" exact>
        <EditPost />
      </Route>
      <Route path="*">
        <div>404</div>
      </Route>
    </Switch>
  );
  const logOutHandler = (e) => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    history.push("/login");
  };
  return (
    <div className="App">
      <h1>Hello World</h1>
      {loggedIn && data ? (
        <div>
          <button onClick={logOutHandler}>Logout</button>{" "}
          <Link to="/create">Create</Link>
          <p>{data.user.name}</p>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link> <Link to="/signup">Sign Up</Link>
        </div>
      )}
      {routes}
    </div>
  );
}

export default App;
