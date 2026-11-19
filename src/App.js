import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import { db, auth } from "./firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { Modal, Box, Button, TextField } from "@mui/material";
import { InstagramEmbed } from "react-social-media-embed";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  padding: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenSignIn = () => setOpenSignIn(true);
  const handleCloseSignIn = () => setOpenSignIn(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      },
      (error) => {
        console.error("Error fetching posts:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return updateProfile(userCredential.user, {
          displayName: username,
        });
      })
      .then(() => {
        setOpen(false);
        setUsername("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const signIn = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setOpenSignIn(false);
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="app">
      {/* Sign Up modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <center>
            <img
              className="app__headerImage"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1920px-Instagram_logo.svg.png"
              alt="Instagram"
            />

            <form onSubmit={signUp}>
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit">Sign Up</Button>
            </form>
          </center>
        </Box>
      </Modal>

      {/* Sign In modal */}
      <Modal open={openSignIn} onClose={handleCloseSignIn}>
        <Box sx={modalStyle}>
          <center>
            <img
              className="app__headerImage"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1920px-Instagram_logo.svg.png"
              alt="Instagram"
            />

            <form onSubmit={signIn}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit">Sign In</Button>
            </form>
          </center>
        </Box>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1920px-Instagram_logo.svg.png"
          alt="Instagram"
        />

        <div className="app__headerActions">
          {user ? (
            <Button onClick={() => signOut(auth)}>Logout</Button>
          ) : (
            <div>
              <Button onClick={handleOpen}>Sign Up</Button>
              <Button onClick={handleOpenSignIn}>Sign In</Button>
            </div>
          )}
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        user && <h3>Sorry you need to login to upload</h3>
      )}

      {/* Posts */}
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              userName={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              user={user}
            />
          ))}
        </div>

        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B_uf9dmAGPw/"
            width={328}
          />
        </div>
      </div>
    </div>
  );
}

export default App;