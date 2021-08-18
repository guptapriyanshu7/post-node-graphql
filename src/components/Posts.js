import { gql, useQuery, useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { Redirect, Link, useLocation } from "react-router-dom";
import Status from "./Status";

const POST_SUBSCRIPTION = gql`
  subscription {
    postCreated {
      _id
      title
      content
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
  const query = new URLSearchParams(useLocation().search);
  let page = query.get("page");
  page = parseInt(page);
  if (!page || page < 1) {
    page = 1;
  }
  const { subscribeToMore, ...result } = useQuery(POSTS, {
    variables: { page: page },
  });
  return (
    <div>
      <Status />
      <Posts
        {...result}
        subscribeToNewPosts={() =>
          subscribeToMore({
            document: POST_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
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
      <Link to={`/?page=${page - 1}`}>Previous Page</Link>{" "}
      <Link to={`/?page=${page + 1}`}>Next Page</Link>
    </div>
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
  }, [subscribeToNewPosts]);
  if (props.loading) {
    return <p>Loading...</p>;
  }
  if (props.error) {
    if (props.error.message === "Not authenticated!")
      return <Redirect to="/login" />;
    return <p>Error :( {props.error.message}</p>;
  }
  const postsArr = props.data.getPosts.posts;
  return <PostsMap posts={postsArr} />;
}

function PostsMap({ posts }) {
  const [deletePost, { loading, error }] = useMutation(DELETEPOST);
  const [postsArr, setPostsArr] = useState(posts);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error :(</p>;
  }
  const deleteHandler = (id) => {
    deletePost({ variables: { id: id } }).catch((err) => {});
    const updatedPostsArr = postsArr.filter((post) => post._id !== id);
    setPostsArr(updatedPostsArr);
  };
  return postsArr.map((post) => (
    <div key={post._id}>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <Link to={`/${post._id}`}>View</Link>{" "}
      <button onClick={() => deleteHandler(post._id)}>Delete</button>{" "}
      <Link to={`/edit/${post._id}`}>Edit</Link>
    </div>
  ));
}

export default PostsPage;
