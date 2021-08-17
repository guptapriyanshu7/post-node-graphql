import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";

const SINGLEPOST = gql`
  query SinglePost($id: ID!) {
    post(id: $id) {
      title
      content
      imageUrl
      creator {
        name
      }
    }
  }
`;

function SinglePost() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(SINGLEPOST, {
    variables: {
      id: id,
    },
  });
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error :(</p>;
  }
  return (
    <div>
      <h1>{data.post.title}</h1>
      <p>{data.post.creator.name}</p>
      <p>{data.post.content}</p>
      <img src={`http://localhost:8080/images/${data.post.imageUrl}`} alt="" />
    </div>
  );
}

export default SinglePost;
