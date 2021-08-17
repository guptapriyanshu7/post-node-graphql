import { gql, useMutation } from "@apollo/client";
import { Redirect } from "react-router-dom";

const REGISTER = gql`
  mutation Register($userInput: UserInputData!) {
    createUser(userInput: $userInput) {
      _id
    }
  }
`;

function Register() {
  let emailEl, nameEl, passwordEl;
  const [register, { loading, error, data }] = useMutation(REGISTER);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (data) {
    return <Redirect to={{ pathname: "/login" }} />;
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
    <div>
      <form onSubmit={onSubmitHandler}>
        <input ref={(node) => (emailEl = node)} />
        <input ref={(node) => (nameEl = node)} />
        <input type="password" ref={(node) => (passwordEl = node)} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
