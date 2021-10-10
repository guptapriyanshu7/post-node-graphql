import { gql, useMutation, useQuery } from "@apollo/client";
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
    <div>
      <input
        ref={(node) => (statusEl = node)}
        defaultValue={data.user.status}
      />
      <button
        onClick={() => updateStatus({ variables: { status: statusEl.value } })}
      >
        Update
      </button>
    </div>
  );
}

export default Status;
