import React from 'react';
import { Grid, Typography, Box, Paper, Divider } from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

const ContactInformation = () => {
  return (
    <Box mt={4}>
      <Typography variant="h2" component="h1" gutterBottom>
        Contact Information
      </Typography>

      <Grid container spacing={3}>
        {/* Location */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 , borderRadius:'20px'}}>
            <LocationOnIcon fontSize="large" color="primary" />
            <Typography variant="h5" sx={{ mt: 1 }}>
              Our Location
            </Typography>
            <Typography>
              123 Garden Street,
              <br />
              Coimbatore City,
              <br />
              TamilNadu
            </Typography>
          </Paper>
        </Grid>

        {/* Email */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 , borderRadius:'20px'}}>
            <EmailIcon fontSize="large" color="primary" />
            <Typography variant="h5" sx={{ mt: 1 }}>
              Email Us
            </Typography>
            <Typography>
              <a href="mailto:info@theplantpalette.com" style={{color:'#000'}}>info@theplantpalette.com</a>
            </Typography>
          </Paper>
        </Grid>

        {/* Phone */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, borderRadius:'20px' }}>
            <PhoneIcon fontSize="large" color="primary" />
            <Typography variant="h5" sx={{ mt: 1 }}>
              Call Us
            </Typography>
            <Typography>
              <a href="tel:+123456789" style={{color:'#000'}}>+1 (234) 567-89</a>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      <Typography variant="body2" color="textSecondary">
        We're here to assist you with all your gardening needs. Feel free to reach out to us!
      </Typography>
    </Box>
  );
};

export default ContactInformation;
