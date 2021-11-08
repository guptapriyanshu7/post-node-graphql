import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { Heading, Box, Text, Stack } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { domain, httpSecure } from "..";

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
        <Heading>{data.post.title}</Heading>
        <span>
          - Created by <b style={{ color: "teal" }}>{data.post.creator.name}</b>{" "}
          on {new Date(data.post.createdAt).toLocaleDateString("en-IN")}
        </span>
      </Box>
      <Image
        src={`${httpSecure}://${domain}/images/${data.post.imageUrl}`}
        fallbackSrc="https://i.pinimg.com/originals/1c/aa/c5/1caac55143e3e11461c6ae5962403deb.jpg"
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
