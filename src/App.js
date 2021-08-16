import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Posts from "./components/Posts";
import { Route, Switch } from "react-router-dom";

function App() {
  let routes = (
    <Switch>
      <Route path="/" render={(props) => <Login />} />
      <Route path="/" render={(props) => <Register />} />
    </Switch>
  );
  return (
    <div className="App">
      <h1>Hello World</h1>
      <Posts />
    </div>
  );
}

export default App;
