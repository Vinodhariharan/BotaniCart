import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
import { Expand, ExpandMore } from '@mui/icons-material';
// import { ExpandMoreIcon } from '@mui/icons-material';

const TermsAndConditions = () => {
  return (
    <Box sx={{ my: 4 , fontFamily:'League Spartan, sans-serif'}}>
      <Typography variant="h2" component="h1" gutterBottom>
        Terms and Conditions for The Plant Palette
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Last Updated: 19/2/2023
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">Welcome</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Welcome to The Plant Palette, a website and online store dedicated to helping you create your dream garden. These Terms and Conditions ("Terms") govern your use of our website and any related services we offer (collectively, the "Services"). Please read these Terms carefully before accessing or using the Services. By accessing or using the Services, you agree to be bound by these Terms.
          </Typography>
        </AccordionDetails>
        </Accordion>
        <Accordion>

        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">1. General Use of the Services</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            You must be at least 18 years old or the age of majority in your jurisdiction to use the Services. You are responsible for ensuring that all information you provide to us is accurate, complete, and up-to-date. You are prohibited from using the Services for any unlawful purpose or in violation of these Terms. You agree not to upload, transmit, or distribute any content that is harmful, offensive, obscene, or otherwise violates any applicable laws or regulations.
          </Typography>
        </AccordionDetails>
        </Accordion>

        <Accordion>

        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">9. Contact Us</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            If you have any questions about these Terms, please contact us at{' '}
            {/* <Link href={`mailto:[email address]`}>{[email address]}</Link> or{' '} */}
            {/* <Link href={`tel:[phone number]`}>{[phone number]}</Link>. */}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Typography variant="body2" sx={{ mt: 4 }}>
        Thank you for using The Plant Palette!
      </Typography>
    </Box>
  );
};

export default TermsAndConditions;
