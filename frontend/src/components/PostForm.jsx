import React from "react";

function PostForm() {
  const [text, settext] = React.useState("");
  const [image, setImage] = React.useState(null);
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleSubmit = async () => {
    let imageUrl = null;
    if (image) {
      const uploadResponse = await fetch("http://localhost:8000/upload-url");
      const { uploadUrl, fileUrl } = await uploadResponse.json();
      //upload image to bucket
      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": image.type,
        },
        body: image,
      });
      console.log("Upload Res", res.url);
      imageUrl = fileUrl;
    }
    const res = await fetch("http://localhost:8000/posts", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ text, image: imageUrl }),
    });
    if (res.ok) {
      settext("");
      setImage(null);
      alert("Post has been created");
    }
    if (!res.ok) {
      try {
        const err = await res.json();
        console.error("Error creating post:", err.message || err);
      } catch (e) {
        console.error("Error creating post:", e);
      }
    }
  };
  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        placeholder="Enter post text"
        value={text}
        onChange={(e) => settext(e.target.value)}
        style={{ width: "300px", marginBottom: "10px" }}
      />
      <br />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
}

export default PostForm;
