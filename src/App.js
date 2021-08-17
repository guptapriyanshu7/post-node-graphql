import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Posts from "./components/Posts";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { useState } from "react";
import SinglePost from "./components/SinglePost";
import CreatePost from "./components/CreatePost";

function App() {
  const token = localStorage.getItem("token");
  const [auth, setAuth] = useState(token ? true : false);
  const history = useHistory();
  const routes = (
    <Switch>
      <Route path="/" exact>
        <Posts />
      </Route>
      <Route path="/login" exact>
        <Login setAuth={setAuth} />
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
      <Route path="*">
        <div>404</div>
      </Route>
    </Switch>
  );
  const logOutHandler = (e) => {
    localStorage.removeItem("token");
    setAuth(false);
    history.push("/login");
  };
  return (
    <div className="App">
      <h1>Hello World</h1>
      {auth ? (
        <div>
          <button onClick={logOutHandler}>Logout</button>{" "}
          <Link to="/create">Create</Link>
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
