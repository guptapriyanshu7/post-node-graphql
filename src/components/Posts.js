import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useRef } from 'react';

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
  {
    getPosts(page: 1) {
      totalPosts
      posts {
        _id
        title
        content
      }
    }
  }
`;

function PostsPage() {
  const { subscribeToMore, ...result } = useQuery(POSTS);
  return (
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
    return <p>Error :(</p>;
  }
  const postsArr = props.data.getPosts.posts;
  return postsArr.map((post) => (
    <div key={post._id}>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
    </div>
  ));
}

export default PostsPage;
