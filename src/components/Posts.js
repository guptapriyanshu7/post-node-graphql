import { gql, useQuery, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Image } from "@chakra-ui/image";
import { Box, Center, Heading, HStack, Link, Text } from "@chakra-ui/layout";
import { useEffect, useRef, useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import Status from "./Status";

const STATUS = gql`
  query {
    user {
      _id
    }
  }
`;

const POST_SUBSCRIPTION = gql`
  subscription {
    postCreated {
      _id
      title
      content
      imageUrl
      creator {
        _id
        name
      }
      createdAt
    }
  }
`;

const POSTS = gql`
  query GetPosts($page: Int) {
    getPosts(page: $page) {
      totalPosts
      posts {
        _id
        title
        content
        imageUrl
        creator {
          _id
          name
        }
        createdAt
      }
    }
  }
`;

const DELETEPOST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

function PostsPage() {
  const { subscribeToMore, ...result } = useQuery(POSTS, {
    variables: { page: 1 },
    fetchPolicy: "network-only",
  });
  return (
    <Box>
      <Status />
      <Posts
        {...result}
        subscribeToNewPosts={() =>
          subscribeToMore({
            document: POST_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              console.log(subscriptionData);
              console.log(prev);
              if (!subscriptionData.data) return prev;
              const newPostItem = subscriptionData.data.postCreated;
              const updatePostsArray = [...prev.getPosts.posts, newPostItem];
              const updateTotalPosts = prev.getPosts.totalPosts + 1;
              return {
                ...prev,
                getPosts: {
                  ...prev.getPosts,
                  posts: updatePostsArray,
                  totalPosts: updateTotalPosts,
                },
              };
            },
          })
        }
      />
    </Box>
  );
}

function Posts(props) {
  const { subscribeToNewPosts } = props;

  let isSubscribed = useRef(false);

  useEffect(() => {
    if (!isSubscribed.current) {
      subscribeToNewPosts();
      isSubscribed.current = true;
    }
  });

  if (props.loading) {
    return <p>Loading...</p>;
  }

  if (props.error) {
    return <p>Error :( {props.error.message}</p>;
  }

  const postsArr = props.data.getPosts.posts;
  console.log(postsArr);

  return <PostsMap posts={postsArr} />;
}

function PostsMap({ posts }) {
  const { data } = useQuery(STATUS);
  const [deletePost, { loading, error }] = useMutation(DELETEPOST);

  const [postsArr, setPostsArr] = useState(posts);
  const bg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    setPostsArr(posts);
  }, [posts]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  const deleteHandler = (id) => {
    deletePost({ variables: { id: id } }).catch((err) => {});
    const updatedPostsArr = postsArr.filter((post) => post._id !== id);
    setPostsArr(updatedPostsArr);
  };

  return postsArr.map((post) => (
    <Center mt={6} key={post._id}>
      <HStack
        width="4xl"
        bg={bg}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Box overflow="hidden" borderStartRadius={8}>
          <Image
            src={`http://localhost:8080/images/${post.imageUrl}`}
            boxSize={40}
            _hover={{ transform: "scale(1.05)" }}
            transitionDuration="0.5s"
            overflow="hidden"
          />
        </Box>
        <Center flex="1" flexDir="column">
          <Heading fontSize="xl">{post.title}</Heading>
          <span style={{ color: "gray" }}>
            - Posted by <b style={{ color: "teal" }}>{post.creator.name}</b> on{" "}
            {new Date(post.createdAt).toLocaleDateString("en-IN")}
          </span>
          <Text>{post.content.substr(0, 200) + "..."}</Text>
          <HStack spacing={8}>
            <Link as={ReactRouterLink} to={`/${post._id}`} color="teal">
              View
            </Link>
            <Link
              as={ReactRouterLink}
              to={
                data != null && post.creator._id === data.user._id
                  ? `/edit/${post._id}`
                  : "#"
              }
              color="teal"
            >
              Edit
            </Link>
            <Button
              color="red.600"
              variant="unstyled"
              onClick={() => deleteHandler(post._id)}
              isDisabled={
                data == null ? true : post.creator._id !== data.user._id
              }
            >
              Delete
            </Button>
          </HStack>
        </Center>
      </HStack>
    </Center>
  ));
}

export default PostsPage;
