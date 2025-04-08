import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@mui/joy"; // Joy UI input
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // Optional field
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const history = useNavigate();

  const handleSignup = async () => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        phone: phone || null, // Optional field
        role: "customer", // Default role
        createdAt: new Date(),
      });

      // Redirect to login
      history("/login");
    } catch (error) {
      setError(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="signup-container">
      <div className="container">
        <form className="signup-form">
          <h2>Sign Up</h2>
          <label>First Name</label>
          <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <label>Last Name</label>
          <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <label>Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label>Phone (Optional)</label>
          <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <Button variant="contained" onClick={handleSignup}>
            Sign Up
          </Button>
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Signup;
