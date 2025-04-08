import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Last Updated: 17/5/2023
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">1. Information We Collect</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            We collect personal information such as your name, email address, and shipping address when you place an order on our website. Additionally, we may collect non-personal information such as your IP address and browsing behavior on our site.
          </Typography>
        </AccordionDetails>
        </Accordion>
        <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">2. How We Use Your Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            We use the information collected to process your orders, communicate with you, and improve our website and services. Your personal information is handled securely, and we do not share it with third parties without your consent.
          </Typography>
        </AccordionDetails>
        </Accordion>
        <Accordion>

        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">3. Cookies and Tracking Technologies</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            We use cookies and similar technologies to enhance your browsing experience on our website. These technologies help us analyze site traffic, customize content, and provide targeted advertising. You can control cookie preferences through your browser settings.
          </Typography>
        </AccordionDetails>
        </Accordion>

        <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">8. Contact Us</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            If you have any questions about our Privacy Policy, please contact us at{' '}
            <Link href={`mailto:privacy@example.com`}>privacy@theplantpalette.com</Link>.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Typography variant="body2" sx={{ mt: 4 }}>
        Thank you for trusting The Plant Palette with your information.
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;
