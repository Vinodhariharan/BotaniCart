import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Snackbar from '@mui/joy/Snackbar';
import Alert from '@mui/joy/Alert';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// import pic from '../../assets/images/gardeningpic1.gif';
import logo from '/Untitled.png';

const gardeningImage = "/login-signup.jpg";

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

const customTheme = extendTheme({
  defaultColorScheme: 'light',
  palette: {
    primary: {
      main: '#136c13',
    },
  },
});

export default function Login({ setLoggedIn }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'customer',
        });
      }

      setLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError('Google Sign-In failed. Try again.');
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
        {/* Form Side (Right side now) */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            // background: 'linear-gradient(135deg, #b2ebf2 0%, #a5d6a7 100%)',
            background: '#fff',
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
                  <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>
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
                    Login
                  </Typography>
                  <Typography level="body-sm">
                    New customer?{' '}
                    <Link to="/register" style={{ color: '#136c13' }}>
                      Create your account
                    </Link>
                  </Typography>
                </Stack>
                <Button
                  variant="soft"
                  color="neutral"
                  fullWidth
                  startDecorator={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  sx={{
                    borderRadius: '20px', background:'#F0F0F0',
                    bgcolor: '#fff',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    }
                  }}
                >
                  Sign in with Google
                </Button>
              </Stack>
              <Divider>or</Divider>
              <Stack sx={{ gap: 4, mt: 2 }}>
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{ borderRadius: '20px', background:'#F0F0F0' }}
                    />
                  </FormControl>
                  <FormControl sx={{ mt: 2 }}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{ borderRadius: '20px', background:'#F0F0F0' }}
                    />
                  </FormControl>
                  <Stack sx={{ gap: 4, mt: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Checkbox size="sm" label="Remember me" name="persistent" />
                      <Link to="/" style={{ color: '#136c13', textDecoration: 'none' }}>
                        Forgot Password?
                      </Link>
                    </Box>
                    <Button
                      type="submit"
                      fullWidth
                      sx={{
                        borderRadius: '20px', background:'#F0F0F0',
                        bgcolor: '#136c13',
                        '&:hover': {
                          bgcolor: '#0e5a0e',
                        }
                      }}
                    >
                      Login
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                © BotaniCart {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Image Side (Left side now) */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            height: { xs: '300px', md: '100vh' },
            position: { xs: 'static', md: 'fixed' },
            left: 0,
            top: 0,
            bottom: 0,
            overflow: 'hidden',
                        ml: { xs: 0, md: '50%' },

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