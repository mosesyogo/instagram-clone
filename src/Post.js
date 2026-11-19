import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

function Post({ postId, userName, caption, imageUrl, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const emojis = ["❤️", "🔥", "😂", "😍", "👏", "😮"];

  useEffect(() => {
    let unsubscribe;

    if (postId) {
      const commentsQuery = query(
        collection(db, "posts", postId, "comments"),
        orderBy("timestamp", "asc")
      );

      unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    if (!comment.trim()) return;

    if (!user) {
      alert("Please log in to comment.");
      return;
    }

    addDoc(collection(db, "posts", postId, "comments"), {
      text: comment,
      username: user.displayName || "anonymous",
      timestamp: serverTimestamp(),
    }).then(() => {
      setComment("");
    });
  };

  const addEmoji = (emoji) => {
    setComment((prev) => prev + emoji);
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={userName}
          src="/images/profile-pic.jpg"
        />
        <h3>{userName}</h3>
      </div>

      <img
        className="post__image"
        src={imageUrl}
        alt={`Post by ${userName}`}
      />

      <h4 className="post__text">
        <strong>{userName}</strong> {caption}
      </h4>

      <div className="post__commentsList">
        {comments.map((c) => (
          <p key={c.id} className="post__comment">
            <strong>{c.username}</strong> {c.text}
          </p>
        ))}
      </div>

      <div className="post__emojiBar">
        {emojis.map((emoji) => (
          <span
            key={emoji}
            className="post__emoji"
            onClick={() => addEmoji(emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>

      {user && (
        <form className="post__commentBox" onSubmit={postComment}>
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            type="submit"
            disabled={!comment.trim()}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;