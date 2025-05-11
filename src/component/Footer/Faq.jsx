import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Container,
  List,
  ListItem,
  ListItemDecorator,
  Divider,
  Card,
  CardContent,
  Button,
  Sheet
} from '@mui/joy';
import {
  ExpandMore,
  QuestionAnswer,
  LocalShipping,
  Payment,
  EnergySavingsLeaf,
  Inventory,
  Spa,
  Help,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleAccordionChange = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What plants and gardening products do you offer?",
      answer: (
        <>
          <Typography level="body-md" mb={2}>
            BotaniCart offers a comprehensive selection of plants and gardening essentials:
          </Typography>
          <List marker="disc" sx={{ pl: 2 }}>
            <ListItem>
              <ListItemDecorator>
                <Spa fontSize="sm" color="success" />
              </ListItemDecorator>
              Indoor plants, outdoor plants, succulents, and rare plant varieties
            </ListItem>
            <ListItem>
              <ListItemDecorator>
                <EnergySavingsLeaf fontSize="sm" color="success" />
              </ListItemDecorator>
              Seeds, seedlings, bulbs, and seasonal plant collections
            </ListItem>
            <ListItem>
              <ListItemDecorator>
                <Inventory fontSize="sm" color="success" />
              </ListItemDecorator>
              Premium gardening tools, watering equipment, and plant accessories
            </ListItem>
            <ListItem>
              <ListItemDecorator>
                <Spa fontSize="sm" color="success" />
              </ListItemDecorator>
              Soil, fertilizers, plant food, and organic gardening supplies
            </ListItem>
          </List>
          <Typography level="body-md" mt={2}>
            Our catalog is regularly updated with new varieties and seasonal specialties.
          </Typography>
        </>
      ),
      icon: <Spa />
    },
    {
      question: "How does shipping and delivery work?",
      answer: (
        <>
          <Typography level="body-md" mb={2}>
            We take special care to ensure your plants arrive fresh and healthy:
          </Typography>
          <List size="sm">
            <ListItem>
              <ListItemDecorator>
                <CheckCircle color="success" />
              </ListItemDecorator>
              <strong>Standard Shipping:</strong> 3-5 business days (free on orders over $75)
            </ListItem>
            <ListItem>
              <ListItemDecorator>
                <CheckCircle color="success" />
              </ListItemDecorator>
              <strong>Express Shipping:</strong> 1-2 business days (additional fee applies)
            </ListItem>
            <ListItem>
              <ListItemDecorator>
                <CheckCircle color="success" />
              </ListItemDecorator>
              <strong>Local Delivery:</strong> Next-day delivery available in select areas
            </ListItem>
          </List>
          <Typography level="body-sm" mt={2}>
            All plants are carefully packaged in eco-friendly, temperature-regulated packaging to ensure they arrive in perfect condition. We currently ship to the contiguous United States and select international locations.
          </Typography>
        </>
      ),
      icon: <LocalShipping />
    },
    {
      question: "What payment methods do you accept?",
      answer: (
        <>
          <Typography level="body-md">
            We accept a variety of secure payment methods for your convenience:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, my: 2, justifyContent: 'center' }}>
            {['Visa', 'Mastercard', 'American Express', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
              <Sheet 
                key={method}
                variant="soft" 
                color="neutral"
                sx={{ 
                  px: 2, 
                  py: 1, 
                  borderRadius: 'md',
                  fontSize: 'sm'
                }}
              >
                {method}
              </Sheet>
            ))}
          </Box>
          <Typography level="body-sm">
            All transactions are processed securely using industry-standard encryption. We never store your complete credit card information on our servers.
          </Typography>
        </>
      ),
      icon: <Payment />
    },
    {
      question: "What is your return and refund policy?",
      answer: (
        <>
          <Typography level="body-md" mb={2}>
            We stand behind the quality of our products:
          </Typography>
          <List marker="circle">
            <ListItem>
              <strong>Plants:</strong> 30-day guarantee on all plants. If your plant arrives damaged or dies within 30 days, we'll replace it free of charge.
            </ListItem>
            <ListItem>
              <strong>Garden Tools & Accessories:</strong> 60-day return window for unused items in original packaging.
            </ListItem>
            <ListItem>
              <strong>Seeds & Bulbs:</strong> Quality guaranteed, but due to their nature, we cannot accept returns once the package is opened.
            </ListItem>
          </List>
          <Typography level="body-sm" mt={2}>
            To initiate a return or replacement, please contact our customer service team with your order number and photos of the affected items.
          </Typography>
        </>
      ),
      icon: <Inventory />
    },
    {
      question: "How do I care for my new plants?",
      answer: (
        <>
          <Typography level="body-md" mb={2}>
            Every plant comes with specific care instructions, but here are some general tips:
          </Typography>
          <List>
            <ListItem>
              <strong>Light:</strong> Understand your plant's light requirements (low, medium, bright indirect, or direct sunlight).
            </ListItem>
            <ListItem>
              <strong>Watering:</strong> Most indoor plants prefer to dry out slightly between waterings. Overwatering is the most common cause of plant problems.
            </ListItem>
            <ListItem>
              <strong>Humidity:</strong> Many tropical plants appreciate higher humidity. Consider a humidifier or pebble tray for these varieties.
            </ListItem>
            <ListItem>
              <strong>Fertilizing:</strong> Most plants benefit from fertilizer during the growing season (spring/summer).
            </ListItem>
          </List>
          <Typography level="body-md" mt={2}>
            We also offer a <Link href="/plant-care-guides">comprehensive plant care library</Link> with detailed guides for all the plants we sell.
          </Typography>
        </>
      ),
      icon: <EnergySavingsLeaf />
    },
    {
      question: "How can I contact customer support?",
      answer: (
        <>
          <Typography level="body-md" mb={2}>
            Our dedicated support team is available to assist you:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>Email Support</Typography>
              <Link href="mailto:support@botanicart.com" level="body-md">support@botanicart.com</Link>
              <Typography level="body-sm" sx={{ mt: 1, color: 'neutral.500' }}>
                Response within 24 hours
              </Typography>
            </Sheet>
            
            <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>Phone Support</Typography>
              <Link href="tel:+12125557890" level="body-md">+1 (212) 555-7890</Link>
              <Typography level="body-sm" sx={{ mt: 1, color: 'neutral.500' }}>
                Monday-Friday: 9am-6pm EST
              </Typography>
            </Sheet>
            
            <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>Live Chat</Typography>
              <Typography level="body-md">Available on our website</Typography>
              <Typography level="body-sm" sx={{ mt: 1, color: 'neutral.500' }}>
                7 days a week: 8am-8pm EST
              </Typography>
            </Sheet>
          </Box>
        </>
      ),
      icon: <Help />
    }
  ];

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          level="h1"
          fontSize={{ xs: 'xl3', md: 'xl4' }}
          fontWeight="lg"
          textAlign="center"
          sx={{ mb: 2 }}
        >
          Frequently Asked Questions
        </Typography>
        
        <Typography 
          level="body-lg" 
          textAlign="center" 
          sx={{ mb: 5, maxWidth: 700, mx: 'auto' }}
        >
          Find answers to commonly asked questions about our products, shipping, plant care, and more.
        </Typography>
      </Box>

      <Box sx={{ mb: 5 }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expandedIndex === index}
            onChange={() => handleAccordionChange(index)}
            sx={{ 
              mb: 1.5,
              borderRadius: 'md',
              '&:first-of-type': { mt: 0 },
              boxShadow: expandedIndex === index ? 'sm' : 'none',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <AccordionSummary
              indicator={<ExpandMore />}
              sx={{ 
                minHeight: 56,
                fontWeight: 'lg',
                '&:hover': { bgcolor: 'neutral.softBg' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ color: 'success.500' }}>
                  {faq.icon}
                </Box>
                <Typography level="title-lg">{faq.question}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2, px: 4.5 }}>
              <Box sx={{ ml: 1 }}>
                {faq.answer}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Card 
        variant="soft" 
        color="success" 
        invertedColors 
        sx={{ 
          mt: 6,
          mb: 2,
          borderRadius: 'lg',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          p: 3
        }}
      >
        <CardContent sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography level="title-lg" sx={{ mb: 1 }}>
            Still have questions?
          </Typography>
          <Typography level="body-md">
            Our plant experts are ready to help you with personalized advice.
          </Typography>
        </CardContent>
        <Button 
          variant="solid" 
          color="primary" 
          endDecorator={<ArrowForward />}
          sx={{ 
            alignSelf: { xs: 'center', sm: 'flex-end' },
            borderRadius: 'md',
            px: 3
          }}
        >
          Contact Us
        </Button>
      </Card>
      
      <Typography level="body-sm" textAlign="center" sx={{ mt: 4, color: 'neutral.500' }}>
        We're constantly updating our FAQ based on customer questions. Last updated: May 2025
      </Typography>
    </Container>
  );
};

export default FAQSection;