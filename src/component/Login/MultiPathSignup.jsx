import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Checkbox from '@mui/joy/Checkbox';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import StepButton from '@mui/joy/StepButton';
import Check from '@mui/icons-material/Check';
import LinearProgress from '@mui/joy/LinearProgress';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, googleProvider, signInWithPopup } from '../../firebaseConfig';
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

export default function EnhancedSignup() {
  const navigate = useNavigate();
  
  // State for stepper
  const [activeStep, setActiveStep] = React.useState(0);
  
  // Basic account information
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  
  // Gardening preferences
  const [gardeningExperience, setGardeningExperience] = React.useState("beginner");
  const [gardenType, setGardenType] = React.useState([]);
  const [plantPreferences, setPlantPreferences] = React.useState([]);
  const [climate, setClimate] = React.useState("");
  
  // Communications preferences
  const [receiveNewsletter, setReceiveNewsletter] = React.useState(true);
  const [receiveCareReminders, setReceiveCareReminders] = React.useState(false);
  const [receiveSeasonalTips, setReceiveSeasonalTips] = React.useState(true);
  const [communicationFrequency, setCommunicationFrequency] = React.useState("weekly");
  
  // Alert management
  const [error, setError] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const steps = [
    'Account Details',
    'Gardening Profile',
    'Communication Preferences'
  ];
  
  const handleGardenTypeChange = (type) => {
    if (gardenType.includes(type)) {
      setGardenType(gardenType.filter(item => item !== type));
    } else {
      setGardenType([...gardenType, type]);
    }
  };
  
  const handlePlantPreferencesChange = (preference) => {
    if (plantPreferences.includes(preference)) {
      setPlantPreferences(plantPreferences.filter(item => item !== preference));
    } else {
      setPlantPreferences([...plantPreferences, preference]);
    }
  };
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const isStepValid = () => {
    if (activeStep === 0) {
      return firstName !== "" && lastName !== "" && email !== "" && password !== "";
    }
    if (activeStep === 1) {
      return climate !== "";
    }
    return true;
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      await setDoc(doc(db, "users", user.uid), {
        firstName: user.displayName ? user.displayName.split(' ')[0] : "",
        lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : "",
        email: user.email,
        phone: user.phoneNumber || null,
        gardeningExperience: "beginner",
        gardenType: [],
        plantPreferences: [],
        climate: "",
        communications: {
          newsletter: true,
          careReminders: false,
          seasonalTips: true,
          frequency: "weekly"
        },
        role: "customer",
        createdAt: new Date(),
      });
      
      navigate("/login");
    } catch (error) {
      setError(error.message);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!isStepValid()) {
      setError("Please complete all required fields");
      setSnackbarOpen(true);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        phone: phone || null,
        gardeningExperience,
        gardenType,
        plantPreferences,
        climate,
        communications: {
          newsletter: receiveNewsletter,
          careReminders: receiveCareReminders,
          seasonalTips: receiveSeasonalTips,
          frequency: communicationFrequency
        },
        role: "customer",
        createdAt: new Date(),
      });
      
      // Show success message and redirect
      navigate("/login");
    } catch (error) {
      setError(error.message);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <Typography level="h4" sx={{ mb: 1 }}>
              Account Details
            </Typography>
            
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
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <Typography level="h4" sx={{ mb: 1 }}>
              Gardening Profile
            </Typography>
            
            <FormControl>
              <FormLabel>Your Gardening Experience</FormLabel>
              <RadioGroup
                value={gardeningExperience}
                onChange={(e) => setGardeningExperience(e.target.value)}
              >
                <Radio value="beginner" label="Beginner - Just getting started" />
                <Radio value="intermediate" label="Intermediate - Some experience" />
                <Radio value="advanced" label="Advanced - Experienced gardener" />
                <Radio value="expert" label="Expert - Professional or master gardener" />
              </RadioGroup>
            </FormControl>
            
            <FormControl required>
              <FormLabel>Your Climate Zone</FormLabel>
              <Select
                value={climate}
                onChange={(_, value) => setClimate(value)}
                sx={{ borderRadius: '20px' }}
                placeholder="Select your climate zone"
              >
                <Option value="tropical">Tropical (USDA Zone 10-13)</Option>
                <Option value="subtropical">Subtropical (USDA Zone 9-10)</Option>
                <Option value="mediterranean">Mediterranean (USDA Zone 8-10)</Option>
                <Option value="temperate">Temperate (USDA Zone 5-8)</Option>
                <Option value="continental">Continental (USDA Zone 3-7)</Option>
                <Option value="polar">Polar/Subpolar (USDA Zone 1-3)</Option>
                <Option value="arid">Arid/Desert (Various zones)</Option>
                <Option value="notSure">Not sure</Option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Garden Type (Select all that apply)</FormLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Checkbox
                  label="Indoor Plants"
                  checked={gardenType.includes('indoor')}
                  onChange={() => handleGardenTypeChange('indoor')}
                />
                <Checkbox
                  label="Outdoor Garden Beds"
                  checked={gardenType.includes('outdoor')}
                  onChange={() => handleGardenTypeChange('outdoor')}
                />
                <Checkbox
                  label="Container Gardening"
                  checked={gardenType.includes('container')}
                  onChange={() => handleGardenTypeChange('container')}
                />
                <Checkbox
                  label="Balcony Garden"
                  checked={gardenType.includes('balcony')}
                  onChange={() => handleGardenTypeChange('balcony')}
                />
                <Checkbox
                  label="Vegetable Garden"
                  checked={gardenType.includes('vegetable')}
                  onChange={() => handleGardenTypeChange('vegetable')}
                />
                <Checkbox
                  label="Herb Garden"
                  checked={gardenType.includes('herb')}
                  onChange={() => handleGardenTypeChange('herb')}
                />
              </Box>
            </FormControl>
            
            <FormControl>
              <FormLabel>Plant Preferences (Select all that apply)</FormLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Checkbox
                  label="Flowering Plants"
                  checked={plantPreferences.includes('flowering')}
                  onChange={() => handlePlantPreferencesChange('flowering')}
                />
                <Checkbox
                  label="Foliage Plants"
                  checked={plantPreferences.includes('foliage')}
                  onChange={() => handlePlantPreferencesChange('foliage')}
                />
                <Checkbox
                  label="Succulents & Cacti"
                  checked={plantPreferences.includes('succulents')}
                  onChange={() => handlePlantPreferencesChange('succulents')}
                />
                <Checkbox
                  label="Vegetables & Edibles"
                  checked={plantPreferences.includes('vegetables')}
                  onChange={() => handlePlantPreferencesChange('vegetables')}
                />
                <Checkbox
                  label="Herbs"
                  checked={plantPreferences.includes('herbs')}
                  onChange={() => handlePlantPreferencesChange('herbs')}
                />
                <Checkbox
                  label="Trees & Shrubs"
                  checked={plantPreferences.includes('trees')}
                  onChange={() => handlePlantPreferencesChange('trees')}
                />
                <Checkbox
                  label="Air Plants & Tillandsias"
                  checked={plantPreferences.includes('airPlants')}
                  onChange={() => handlePlantPreferencesChange('airPlants')}
                />
                <Checkbox
                  label="Rare & Exotic Plants"
                  checked={plantPreferences.includes('exotic')}
                  onChange={() => handlePlantPreferencesChange('exotic')}
                />
              </Box>
            </FormControl>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2}>
            <Typography level="h4" sx={{ mb: 1 }}>
              Communication Preferences
            </Typography>
            
            <FormControl>
              <FormLabel>How would you like us to keep in touch?</FormLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Checkbox
                  label="Plant care newsletters with seasonal tips"
                  checked={receiveNewsletter}
                  onChange={(e) => setReceiveNewsletter(e.target.checked)}
                />
                <Checkbox
                  label="Plant care reminders for your purchases"
                  checked={receiveCareReminders}
                  onChange={(e) => setReceiveCareReminders(e.target.checked)}
                />
                <Checkbox
                  label="Seasonal gardening tips and new plant alerts"
                  checked={receiveSeasonalTips}
                  onChange={(e) => setReceiveSeasonalTips(e.target.checked)}
                />
              </Box>
            </FormControl>
            
            <FormControl>
              <FormLabel>Communication Frequency</FormLabel>
              <RadioGroup
                value={communicationFrequency}
                onChange={(e) => setCommunicationFrequency(e.target.value)}
              >
                <Radio value="weekly" label="Weekly" />
                <Radio value="biweekly" label="Bi-Weekly" />
                <Radio value="monthly" label="Monthly" />
                <Radio value="quarterly" label="Quarterly" />
              </RadioGroup>
            </FormControl>
            
            <Typography level="body-sm" sx={{ mt: 2 }}>
              By creating an account, you agree to our <Link to="/terms" style={{ color: '#136c13' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: '#136c13' }}>Privacy Policy</Link>.
            </Typography>
          </Stack>
        );
      default:
        return 'Unknown step';
    }
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
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              px: 4,
              color: 'white'
            }}
          >
            <Typography
              level="h2"
              sx={{
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                mb: 2
              }}
            >
              Join the BotaniCart Community
            </Typography>
            <Typography
              level="body-lg"
              sx={{
                textAlign: 'center',
                maxWidth: '600px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              }}
            >
              Create an account to get personalized plant recommendations, care tips, and exclusive offers based on your gardening experience and preferences.
            </Typography>
          </Box>
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
              sx={{ py: 3, display: 'flex', justifyContent: 'space-between', px: 3 }}
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
            
            {/* Main Content */}
            <Box
              component="main"
              sx={{
                p: 3,
                pb: 5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
              }}
            >
              {/* Stepper */}
              <Stepper
                sx={{ width: '100%', my: 3 }}
                activeStep={activeStep}
              >
                {steps.map((label, index) => (
                  <Step
                    key={label}
                    indicator={
                      <StepIndicator
                        variant={activeStep >= index ? 'solid' : 'soft'}
                        color={activeStep >= index ? 'success' : 'neutral'}
                      >
                        {activeStep > index ? (
                          <Check />
                        ) : (
                          index + 1
                        )}
                      </StepIndicator>
                    }
                    completed={activeStep > index}
                  >
                    <StepButton>{label}</StepButton>
                  </Step>
                ))}
              </Stepper>
              
              {/* Step Content */}
              <Box sx={{ mt: 2 }}>
                <form onSubmit={handleSignUp}>
                  {getStepContent(activeStep)}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      variant="outlined"
                      color="neutral"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ borderRadius: '20px' }}
                    >
                      Back
                    </Button>
                    
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        disabled={isLoading || !isStepValid()}
                        sx={{
                          borderRadius: '20px',
                          bgcolor: '#136c13',
                          '&:hover': {
                            bgcolor: '#0e5a0e',
                          }
                        }}
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        sx={{
                          borderRadius: '20px',
                          bgcolor: '#136c13',
                          '&:hover': {
                            bgcolor: '#0e5a0e',
                          }
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </form>
              </Box>
              
              {activeStep === 0 && (
                <>
                  <Divider sx={{ my: 3 }}>or</Divider>
                  
                  <Button
                    variant="soft"
                    color="neutral"
                    fullWidth
                    startDecorator={<GoogleIcon />}
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
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
                  
                  <Typography level="body-sm" sx={{ mt: 2, textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#136c13' }}>
                      Login here
                    </Link>
                  </Typography>
                </>
              )}
            </Box>
            
            {isLoading && (
              <LinearProgress
                determinate={false}
                sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
              />
            )}
            
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