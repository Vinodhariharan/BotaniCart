// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, IconButton, Sheet, Divider } from '@mui/joy';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import '../../assets/css/Footer.css';

const Footer = () => {
  return (
    <Sheet
      className="footer"
      sx={{
        background: 'linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%)',
        color: '#333',
        p: 4,
        pt: 6, // Increased top padding for better spacing
        pb: 6, // Increased bottom padding for better spacing
      }}
    >
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} gap={4}>

        <Box>
          <Typography level="h4" fontWeight="lg" mb={2}>
            Quick Links
          </Typography>
          <Typography level="body2" sx={{ fontFamily: 'League Spartan, sans-serif' }}>
            <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>
              Terms and Conditions
            </Link>
            {/* <Divider orientation="horizontal" sx={{ my: 1 }} /> */}
            <br />
            <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            {/* <Divider orientation="horizontal" sx={{ my: 1 }} /> */}
            <br />
            <Link to="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>
              FAQ
            </Link>
            <br />
            {/* <Divider orientation="horizontal" sx={{ my: 1 }} /> */}
            <Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
              Contact Information
            </Link>
          </Typography>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'row', md: 'column' }}  >
          <Box>
            <Typography level="h4" fontWeight="lg" mb={2}>
              Follow Us
            </Typography>
            <Box display="flex" gap={2}>
              <IconButton href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
              </IconButton>
              <IconButton href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Box>
          <Typography level="h4" fontWeight="lg" mb={2}>
            Contact Us
          </Typography>
          <Typography level="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {/* <LocationOnIcon sx={{ mr: 1 }} /> 123 Main Street, City, Country */}
          </Typography>
          <Typography level="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon sx={{ mr: 1 }} /> info@example.com
          </Typography>
          {/* <Typography level="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 1 }} /> +1 123 456 7890
          </Typography> */}
        </Box>
      </Box>

      <Divider orientation="horizontal" sx={{ my: 4 }} />

      <Typography level="body2" textAlign="center" sx={{ mt: 2 }}>
        © {new Date().getFullYear()} BotaniCart. All rights reserved.
      </Typography>
    </Sheet>
  );
};

export default Footer;