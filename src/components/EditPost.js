import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { Redirect } from "react-router-dom";
import { useParams } from "react-router";

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
    <EditForm id={id} title={data.post.title} content={data.post.content} />
  );
}

function EditForm({ id, title, content }) {
  let titleEl, contentEl, imageFileEl;
  const [updatePost, { loading, error, data }] = useMutation(UPDATEPOST);
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
    updatePost({
      variables: {
        id: id,
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
        <input defaultValue={title} ref={(node) => (titleEl = node)} />
        <input defaultValue={content} ref={(node) => (contentEl = node)} />
        <input type="file" ref={(node) => (imageFileEl = node)} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditPost;
