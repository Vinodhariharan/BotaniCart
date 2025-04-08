import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  Typography,
  Button,
  FormControl,
  FormLabel,
  Input,
  Snackbar,
  Alert,
  Box,
  Grid,
} from "@mui/joy";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../../auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
// import "../../assets/css/Login.css";
import pic from "../../assets/images/gardeningpic1.gif";

function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const history = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
      history("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "customer",
        });
      }

      setLoggedIn(true);
      history("/");
    } catch (err) {
      setError("Google Sign-In failed. Try again.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Sheet
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#0A4938",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Sheet
        sx={{
          p: 3,
          borderRadius: "md",
          boxShadow: "md",
          backgroundColor: "background.surface",
          maxWidth: "800px",
          width: "90%",
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={pic} alt="Gardening" style={{ maxWidth: "100%", maxHeight: "300px" }} />
          </Grid>
          <Grid xs={12} md={6}>
            <form className="login-form">
              <Typography
                          variant="plain"
                          level='h1'
                          component="div"
                          fontFamily="League Spartan"
                          sx={{ color: '#136c13' }}
                        >
                          <Link to="/" style={{ color: '#136c13', textDecoration: 'none' }}>
                            <div>BotaniCart</div>
                          </Link>
                        </Typography>
              <Typography level="h2" textAlign="center" mb={2}>
                Login
              </Typography>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ borderRadius: "20px" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ borderRadius: "20px" }}
                />
              </FormControl>

              <Box textAlign="center" mt={1} mb={2}>
                <Link to="/" style={{ color: "blue" }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{ width: "100%", mt: 1, borderRadius: "20px" }}
              >
                Login
              </Button>

              <Button
                variant="contained"
                onClick={handleGoogleSignIn}
                sx={{
                  width: "100%",
                  mt: 2,
                  borderRadius: "20px",
                  backgroundColor: "#DB4437",
                  color: "#fff",
                }}
              >
                Sign in with Google
              </Button>

              <Typography level="body2" textAlign="center" mt={2}>
                New customer?{" "}
                <Link to="/register" style={{ color: "blue" }}>
                  Create your account
                </Link>
              </Typography>
            </form>
          </Grid>
        </Grid>
      </Sheet>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Sheet>
  );
}

export default Login;