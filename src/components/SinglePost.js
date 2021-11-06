import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import {
  Center,
  Container,
  Heading,
  Box,
  Text,
  VStack,
  Stack,
} from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";

const SINGLEPOST = gql`
  query SinglePost($id: ID!) {
    post(id: $id) {
      title
      content
      imageUrl
      creator {
        name
      }
      createdAt
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
    <Stack spacing={12}>
      <Box>
        <Heading>{data.post.title}</Heading>- Created by{" "}
        <b style={{ color: "teal" }}>{data.post.creator.name}</b> on{" "}
        {new Date(data.post.createdAt).toLocaleDateString("en-IN")}
      </Box>
      <Image
        src={`http://localhost:8080/images/${data.post.imageUrl}`}
        boxSize="md"
        alignSelf="center"
      />
      <Box px={12} pb={8}>
        <Text as="pre" align="start" whiteSpace="pre-line">
          {data.post.content}
        </Text>
      </Box>
    </Stack>
  );
}

export default SinglePost;
