import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, IconButton, Sheet, Divider, Grid, useTheme} from '@mui/joy';
import { useMediaQuery } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import '../../assets/css/Footer.css';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Sheet
      className="footer"
      sx={{
        background: 'linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%)',
        color: '#333',
        p: { xs: 3, sm: 4 },
        pt: { xs: 4, sm: 6 },
        pb: { xs: 4, sm: 6 },
        mt:2
      }}
    >
      <Grid 
        container 
        spacing={{ xs: 3, md: 4 }}
        justifyContent="space-between"
      >
        {/* Quick Links Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography 
            level="h4" 
            fontWeight="lg" 
            mb={2}
            sx={{ fontSize: { xs: '1.25rem', sm: '1 rem' } }}
          >
            Quick Links
          </Typography>
          
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'column' }} 
            gap={{ xs: 1.5, sm: 2 }}
          >
            <Link 
              to="/terms" 
              style={{ 
                color: 'inherit', 
                textDecoration: 'none',
                display: 'block'
              }}
            >
              <Typography 
                level="body2" 
                sx={{ 
                  fontFamily: 'League Spartan, sans-serif',
                  '&:hover': { textDecoration: 'underline' },
                  fontSize: { xs: '0.9rem', sm: '1rem' } 
                }}
              >
                Terms and Conditions
              </Typography>
            </Link>
            
            <Link 
              to="/privacy" 
              style={{ 
                color: 'inherit', 
                textDecoration: 'none',
                display: 'block' 
              }}
            >
              <Typography 
                level="body2" 
                sx={{ 
                  fontFamily: 'League Spartan, sans-serif',
                  '&:hover': { textDecoration: 'underline' },
                  fontSize: { xs: '0.9rem', sm: '1rem' } 
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
            
            <Link 
              to="/faq" 
              style={{ 
                color: 'inherit', 
                textDecoration: 'none',
                display: 'block' 
              }}
            >
              <Typography 
                level="body2" 
                sx={{ 
                  fontFamily: 'League Spartan, sans-serif',
                  '&:hover': { textDecoration: 'underline' },
                  fontSize: { xs: '0.9rem', sm: '1rem' } 
                }}
              >
                FAQ
              </Typography>
            </Link>
            
            <Link 
              to="/contact" 
              style={{ 
                color: 'inherit', 
                textDecoration: 'none',
                display: 'block' 
              }}
            >
              <Typography 
                level="body2" 
                sx={{ 
                  fontFamily: 'League Spartan, sans-serif',
                  '&:hover': { textDecoration: 'underline' },
                  fontSize: { xs: '0.9rem', sm: '1rem' } 
                }}
              >
                Contact Information
              </Typography>
            </Link>
          </Box>
        </Grid>

        {/* Social Media Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Box>
            <Typography 
              level="h4" 
              fontWeight="lg" 
              mb={2}
            sx={{ fontSize: { xs: '1.25rem', sm: '1 rem' } }}
            >
              Follow Us
            </Typography>
            
            <Box 
              display="flex" 
              gap={2} 
              mb={{ xs: 3, md: 4 }}
              justifyContent={{ xs: 'flex-start', sm: 'flex-start' }}
            >
              <IconButton 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                variant="soft"
                color="primary"
                size={isMobile ? "sm" : "md"}
                sx={{ 
                  borderRadius: '50%',
                  '&:hover': { backgroundColor: 'rgba(24, 119, 242, 0.1)' } 
                }}
              >
                <FacebookIcon />
              </IconButton>
              
              <IconButton 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                variant="soft"
                color="primary"
                size={isMobile ? "sm" : "md"}
                sx={{ 
                  borderRadius: '50%',
                  '&:hover': { backgroundColor: 'rgba(29, 161, 242, 0.1)' } 
                }}
              >
                <TwitterIcon />
              </IconButton>
              
              <IconButton 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                variant="soft"
                color="primary"
                size={isMobile ? "sm" : "md"}
                sx={{ 
                  borderRadius: '50%',
                  '&:hover': { backgroundColor: 'rgba(225, 48, 108, 0.1)' } 
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Contact Info Section */}
          <Box>
            <Typography 
              level="h4" 
              fontWeight="lg" 
              mb={2}
            sx={{ fontSize: { xs: '1.25rem', sm: '1 rem' } }}
            >
              Contact Us
            </Typography>
            
            <Box 
              display="flex" 
              flexDirection="column" 
              gap={1.5}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1 
                }}
              >
                <EmailIcon sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }} />
                <Typography 
                  level="body2" 
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontFamily: 'League Spartan, sans-serif'
                  }}
                >
                  info@botanicart.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider 
        orientation="horizontal" 
        sx={{ 
          my: { xs: 3, sm: 4 } 
        }} 
      />

      {/* Copyright Section */}
      <Box 
        sx={{ 
          textAlign: 'center',
          mt: { xs: 1, sm: 2 } 
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 0
          }}
        >
          <img
            src="/Untitled.png"
            alt="BotaniCart Logo"
            style={{ 
              width: isMobile ? '20px' : '25px',
              height: 'auto'
            }}
          />
          <Typography 
            level="h2"
            sx={{ 
              color:"#333",
              fontSize: { xs: '1rem', sm: '1.5rem' },
              fontFamily: 'League Spartan, sans-serif'
            }}
          >
            BotaniCart
          </Typography>
        </Box>
        
        <Typography 
          level="body2" 
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            color: 'rgba(0, 0, 0, 0.6)'
          }}
        >
          © {new Date().getFullYear()} BotaniCart. All rights reserved.
        </Typography>
      </Box>
    </Sheet>
  );
};

export default Footer;