import React from "react";
import PostForm from "./components/PostForm";
import PostGetList from "./components/PosrGetList";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Create a Post</h2>
      <PostForm />
      <h2>All Posts</h2>
      <PostGetList />
    </div>
  );
}

export default App;
