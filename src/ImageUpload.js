import React, { useState } from "react";
import "./ImageUpload.css";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button, LinearProgress } from "@mui/material";

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setUploading(true);

    try {
      const compressedBase64 = await compressImage(image);

      const approxSizeInBytes = compressedBase64.length * 0.75;
      if (approxSizeInBytes > 900000) {
        alert("Image is still too large after compression. Try a smaller photo.");
        setUploading(false);
        return;
      }

      await addDoc(collection(db, "posts"), {
        timestamp: serverTimestamp(),
        caption: caption,
        imageUrl: compressedBase64,
        username: username,
      });

      setCaption("");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="imageUpload">
      {uploading && <LinearProgress className="imageUpload__progress" />}

      <input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <input type="file" accept="image/*" onChange={handleChange} />

      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}

export default ImageUpload;