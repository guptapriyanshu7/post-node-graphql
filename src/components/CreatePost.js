import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Redirect } from "react-router-dom";

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
  let titleEl, contentEl, imageFileEl;
  const [createPost, { loading, error, data }] = useMutation(CREATEPOST);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
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
          imageFile: imageFileEl.files[0],
        },
      },
    }).catch((err) => {});
  };
  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <input ref={(node) => (titleEl = node)} />
        <input ref={(node) => (contentEl = node)} />
        <input type="file" ref={(node) => (imageFileEl = node)} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreatePost;
