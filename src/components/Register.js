import React from 'react';
import { gql, useMutation } from '@apollo/client';

const REGISTER = gql`
  mutation Register($userInput: UserInputData!) {
    createUser(userInput: $userInput) {
      _id
    }
  }
`;

function Register() {
  let email, name, password;
  const [register, { loading, error, data }] = useMutation(REGISTER);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  if (data) {
    return <div>Successful</div>;
  }
  const onSubmitHandler = (e) => {
    e.preventDefault();
    register({
      variables: {
        userInput: {
          email: email.value,
          name: name.value,
          password: password.value,
        },
      },
    }).catch((err) => {});
  };
  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <input ref={(node) => (email = node)} />
        <input ref={(node) => (name = node)} />
        <input type='password' ref={(node) => (password = node)} />
        <button type='submit'>Register</button>
      </form>
    </div>
  );
}

export default Register;
