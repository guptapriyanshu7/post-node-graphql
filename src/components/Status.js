import { gql, useMutation, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Center, HStack, Spacer } from "@chakra-ui/layout";
import React from "react";

const STATUS = gql`
  query {
    user {
      _id
      status
    }
  }
`;

const UPDATESTATUS = gql`
  mutation ($status: String!) {
    updateStatus(status: $status) {
      status
    }
  }
`;

function Status() {
  let statusEl;
  const { loading, error, data } = useQuery(STATUS);
  const [updateStatus] = useMutation(UPDATESTATUS);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <Center>
      <Input
        variant="filled"
        width="md"
        ref={(node) => (statusEl = node)}
        defaultValue={data.user.status}
      />
      <Button
        onClick={() => updateStatus({ variables: { status: statusEl.value } })}
        ms="1rem"
      >
        Update
      </Button>
    </Center>
  );
}

export default Status;
