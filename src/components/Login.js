import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
    }
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { loading, error, data }] = useLazyQuery(LOGIN);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error :(</p>;
  }
  if (data) {
    localStorage.setItem("token", data.login.token);
    return <div>Successful</div>;
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
