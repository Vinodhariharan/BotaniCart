import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Snackbar from '@mui/joy/Snackbar';
import Alert from '@mui/joy/Alert';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import logo from '/Untitled.png';

const gardeningImage = "https://www.thrive.org.uk/files/images/Gardening-advice/_large/Ad-image-2.jpg";

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
      <path fill="none" d="M1 1h22v22H1z" />
    </svg>
  );
}

export default function Signup() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState(""); // Optional field
  const [error, setError] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
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
      navigate("/login");
    } catch (error) {
      setError(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          minHeight: '100vh',
        }}
      >
        {/* Image Side (Left side) */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '300px', md: '100vh' },
            position: { xs: 'static', md: 'fixed' },
            left: 0,
            top: 0,
            bottom: 0,
            overflow: 'hidden',
            borderRadius: { xs: 0, md: '0 16px 16px 0' },
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {/* Background image with overlay */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: `url(${gardeningImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
              }
            }}
          />          
        </Box>

        {/* Form Side (Right side) */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            ml: { xs: 0, md: '50%' },
            background: 'linear-gradient(135deg, #b2ebf2 0%, #a5d6a7 100%)',
            transition: 'width var(--Transition-duration)',
            transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100dvh',
              width: '100%',
              maxWidth: '600px',
              px: 0,
            }}
          >
            <Box
              component="header"
              sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
            >
              <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
                <img
                  src={logo}
                  alt="BotaniCart Logo"
                  style={{
                    height: '30px',
                    marginBottom: '5px'
                  }}
                />
                <Typography
                  level="h2"
                  fontFamily="League Spartan"
                  sx={{ color: '#136c13' }}
                >
                  <Link to="/" style={{ color: '#136c13', textDecoration: 'none' }}>
                    BotaniCart
                  </Link>
                </Typography>
              </Box>
            </Box>
            <Box
              component="main"
              sx={{
                my: 'auto',
                py: 2,
                pb: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: 400,
                maxWidth: '100%',
                mx: 'auto',
                borderRadius: 'sm',
                '& form': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                },
              }}
            >
              <Stack sx={{ gap: 4, mb: 2 }}>
                <Stack sx={{ gap: 1, alignItems: 'center' }}>
                  <Typography component="h1" level="h3">
                    Create Account
                  </Typography>
                  <Typography level="body-sm">
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#136c13' }}>
                      Login here
                    </Link>
                  </Typography>
                </Stack>
              </Stack>
              
              <form onSubmit={handleSignup}>
                <FormControl required>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{ borderRadius: '20px' }}
                  />
                </FormControl>
                
                <FormControl required>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ borderRadius: '20px' }}
                  />
                </FormControl>
                
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ borderRadius: '20px' }}
                  />
                </FormControl>
                
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ borderRadius: '20px' }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    sx={{ borderRadius: '20px' }}
                  />
                </FormControl>
                
                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    mt: 3,
                    borderRadius: '20px',
                    bgcolor: '#136c13',
                    '&:hover': {
                      bgcolor: '#0e5a0e',
                    }
                  }}
                >
                  Sign Up
                </Button>
              </form>
              
              <Divider sx={{ my: 2 }}>or</Divider>
              
              <Button
                variant="soft"
                color="neutral"
                fullWidth
                startDecorator={<GoogleIcon />}
                sx={{
                  borderRadius: '20px',
                  bgcolor: '#fff',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  }
                }}
              >
                Sign up with Google
              </Button>
            </Box>
            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                © BotaniCart {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          color="danger"
          variant="soft"
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}