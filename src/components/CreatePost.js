import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Redirect } from "react-router-dom";
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

const CREATEPOST = gql`
  mutation CreatePost($postInput: PostInputData!) {
    createPost(postInput: $postInput) {
      title
      content
      imageUrl
      createdAt
    }
  }
`;

function CreatePost() {
  let titleEl, contentEl;

  const [createPost, { loading, error, data }] = useMutation(CREATEPOST);

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const bg = useColorModeValue("gray.50", "gray.700");

  const generateBase64FromImage = (imageFile) => {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
    });

    reader.readAsDataURL(imageFile);
    return promise;
  };

  if (data) {
    return <Redirect to="/" />;
  }
  const onSubmitHandler = (e) => {
    e.preventDefault();
    createPost({
      variables: {
        postInput: {
          title: titleEl.value,
          content: contentEl.value,
          imageFile: imageFile,
        },
      },
    }).catch((err) => {});
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
          <Heading>Create Post</Heading>
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
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Content</FormLabel>
              <Textarea
                placeholder="Write your content..."
                size="lg"
                ref={(node) => (contentEl = node)}
              />
            </FormControl>
            <FormControl isRequired mt={6}>
              <FormLabel>Image</FormLabel>
              <Input
                p={2}
                type="file"
                size="lg"
                onChange={(e) => imagePreview(e.target.files[0])}
              />
              {imageUrl && (
                <Center>
                  <Image src={imageUrl} boxSize="sm" mt={6} />
                </Center>
              )}
            </FormControl>
            <Button
              isLoading={loading}
              colorScheme="teal"
              variant="outline"
              type="submit"
              width="full"
              mt={6}
            >
              Create
            </Button>
          </form>
        </Box>
      </Box>
    </Center>
  );
}

export default CreatePost;
