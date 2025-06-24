import React from "react";
import { useEffect } from "react";

function PostGetList() {
  const [posts, setPosts] = React.useState([]);
  const fetchPosts = async () => {
    const res = await fetch("http://localhost:8000/posts");
    const data = await res.json();
    setPosts(data);
  };
  const toggleLike = async (id) => {
    const res = await fetch(`http://localhost:8000/posts/${id}/like`, {
      method: "POST",
    });
    fetchPosts();
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid gray",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>{post.text}</strong>
          </p>
          {post.image && (
            <img src={post.image} alt="" style={{ width: "100px" }} />
          )}
          <p>👍 {post.likeCount} likes</p>
          <button onClick={() => toggleLike(post.id)}>
            {post.likedByUser ? "Unlike" : "Like"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default PostGetList;
