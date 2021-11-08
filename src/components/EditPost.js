import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  useColorModeValue,
  Textarea,
  Image,
} from "@chakra-ui/react";
import { domain, httpSecure } from "..";

const UPDATEPOST = gql`
  mutation UpdatePost($id: ID!, $postInput: PostUpdateData!) {
    updatePost(id: $id, postInput: $postInput) {
      title
      content
      imageUrl
      createdAt
    }
  }
`;

const SINGLEPOST = gql`
  query SinglePost($id: ID!) {
    post(id: $id) {
      title
      content
      imageUrl
    }
  }
`;

function EditPost() {
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
    return <p>Error: {error.message}</p>;
  }
  return (
    <EditForm
      id={id}
      title={data.post.title}
      content={data.post.content}
      previousimageUrl={data.post.imageUrl}
    />
  );
}

function EditForm({ id, title, content, previousimageUrl }) {
  let titleEl, contentEl;

  const [updatePost, { loading, error, data }] = useMutation(UPDATEPOST);

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const bg = useColorModeValue("gray.50", "gray.700");

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error.message}</p>;
  // }

  if (data) {
    return <Redirect to="/" />;
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    updatePost({
      variables: {
        id: id,
        postInput: {
          title: titleEl.value,
          content: contentEl.value,
          imageFile: imageFile,
        },
      },
    }).catch((err) => {});
  };

  const generateBase64FromImage = (imageFile) => {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
    });

    reader.readAsDataURL(imageFile);
    return promise;
  };

  const imagePreview = async (imageFile) => {
    setImageFile(imageFile);
    const imageUrl = await generateBase64FromImage(imageFile);
    setImageUrl(imageUrl);
  };

  return (
    <Center>
      <Box
        bg={bg}
        p={8}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        width="2xl"
      >
        <Box>
          <Heading>Edit Post</Heading>
        </Box>
        <Box my={4}>
          <form onSubmit={onSubmitHandler}>
            {error && (
              <Alert status="error" borderRadius={8} mt={6}>
                <AlertIcon />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <FormControl isRequired mt={6}>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Lorem Ipsum"
                size="lg"
                ref={(node) => (titleEl = node)}
                defaultValue={title}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Content</FormLabel>
              <Textarea
                placeholder="Write your content..."
                size="lg"
                ref={(node) => (contentEl = node)}
                defaultValue={content}
              />
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Image</FormLabel>
              <Input
                p={2}
                type="file"
                size="lg"
                onChange={(e) => imagePreview(e.target.files[0])}
              />
              <Center>
                <Image
                  src={
                    imageUrl
                      ? imageUrl
                      : `${httpSecure}://${domain}/images/${previousimageUrl}`
                  }
                  fallbackSrc="https://i.pinimg.com/originals/1c/aa/c5/1caac55143e3e11461c6ae5962403deb.jpg"
                  ignoreFallback={imageUrl !== null}
                  boxSize="sm"
                  mt={6}
                />
              </Center>
            </FormControl>
            <Button
              isLoading={loading}
              colorScheme="teal"
              variant="outline"
              type="submit"
              width="full"
              mt={6}
            >
              Save
            </Button>
          </form>
        </Box>
      </Box>
    </Center>
  );
}

export default EditPost;
