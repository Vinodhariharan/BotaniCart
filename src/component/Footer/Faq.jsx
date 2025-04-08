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

const FAQSection = () => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Frequently Asked Questions
      </Typography>

      <Accordion >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">What products do you offer?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            We offer a wide range of products including flowers, shrubs, trees, indoor plants, seeds, soil, fertilizers, containers, tools, watering equipment, decor, accessories, landscaping supplies, lighting, seasonal plants, and holiday decorations.
          </Typography>
        </AccordionDetails>
        </Accordion>
        <Accordion>

        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">How can I place an order?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            To place an order, simply browse our website, select the products you want, and proceed to checkout. Follow the on-screen instructions to complete your purchase.
          </Typography>
        </AccordionDetails>

        </Accordion>
        <Accordion>

        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">What payment methods do you accept?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            We accept a variety of payment methods, including credit cards, debit cards, and online payment services. Your payment information is secure and encrypted for your protection.
          </Typography>
        </AccordionDetails>
        </Accordion>

        <Accordion>

        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h3">How can I contact customer support?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            If you have any questions or need assistance, please reach out to our customer support team at{' '}
            <Link href={`mailto:support@example.com`}>support@theplantpalette.com</Link> or{' '}
            <Link href={`tel:+1234567890`}>+91 634-567-8909</Link>.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Typography variant="body2" sx={{ mt: 4 }}>
        If your question isn't answered here, feel free to reach out to us. We're here to help!
      </Typography>
    </Box>
  );
};

export default FAQSection;
