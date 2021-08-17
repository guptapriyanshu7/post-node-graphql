import { useState, useEffect, useRef } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";

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
  const [login, { loading, error, data }] = useLazyQuery(LOGIN);
  let authSuccess = useRef(false);
  useEffect(() => {
    return () => {
      setAuth(authSuccess.current);
    };
  }, [setAuth]);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error :(</p>;
  }
  if (data) {
    localStorage.setItem("token", data.login.token);
    authSuccess.current = true;
    return <Redirect to={{ pathname: "/" }} />;
  }
  return (
    <div>
      <input type="text" onChange={(event) => setEmail(event.target.value)} />
      <input
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button
        onClick={() =>
          login({ variables: { email: email, password: password } })
        }
      >
        Login
      </button>
    </div>
  );
}

export default Login;
