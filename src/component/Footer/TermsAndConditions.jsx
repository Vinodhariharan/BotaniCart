import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Divider,
  Container,
  Button,
  Card,
  Sheet,
  Chip,
  List,
  ListItem,
  ListItemDecorator
} from '@mui/joy';
import {
  ExpandMore,
  Gavel,
  Description,
  ShoppingCart,
  LocalShipping,
  Payment,
  Security,
  Delete,
  ContactSupport,
  Timer,
  Home,
  Article,
  Info,
  Warning
} from '@mui/icons-material';

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleSectionChange = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  // Table of contents sections
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <Description />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            Welcome to BotaniCart, a website and online store dedicated to helping you create your dream garden. 
            These Terms and Conditions ("Terms") govern your use of our website and any related services we offer 
            (collectively, the "Services"). Please read these Terms carefully before accessing or using the Services.
          </Typography>
          
          <Sheet variant="soft" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="body-md">
              By accessing or using the Services, you agree to be bound by these Terms. If you do not agree to these Terms, 
              you may not access or use the Services. These Terms constitute a legally binding agreement between you and 
              BotaniCart Ltd., a company registered in the United States with its principal office located at 
              150 Green Avenue, Portland, OR 97204.
            </Typography>
          </Sheet>
          
          <Typography level="body-md">
            We may modify these Terms at any time in our sole discretion. Any changes will be effective immediately upon 
            posting on this page, with an updated "Last Updated" date. Your continued use of the Services after any such 
            changes constitutes your acceptance of the new Terms.
          </Typography>
        </>
      )
    },
    {
      id: "account",
      title: "Account Registration and Use",
      icon: <Security />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            To access certain features of the Services, you may be required to register for an account. When you register, 
            you will be asked to provide certain information about yourself, such as your name, email address, and password.
          </Typography>
          
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemDecorator><Info color="primary" /></ListItemDecorator>
              <Typography fontWeight="md">Age Requirement</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                You must be at least 18 years old or the age of majority in your jurisdiction to use the Services.
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><Info color="primary" /></ListItemDecorator>
              <Typography fontWeight="md">Account Security</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account.
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><Info color="primary" /></ListItemDecorator>
              <Typography fontWeight="md">Accurate Information</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                You are responsible for ensuring that all information you provide to us is accurate, complete, and up-to-date.
              </Typography>
            </ListItem>
          </List>
          
          <Typography level="body-md">
            We reserve the right to suspend or terminate your account if you violate these Terms or if we believe that your 
            account has been compromised. You may cancel your account at any time by following the instructions on our website 
            or contacting our customer service team.
          </Typography>
        </>
      )
    },
    {
      id: "prohibited",
      title: "Prohibited Activities",
      icon: <Warning />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            You are prohibited from using the Services for any unlawful purpose or in violation of these Terms. 
            Specifically, you agree not to:
          </Typography>
          
          <Sheet variant="soft" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>Use the Services in any manner that could disable, overburden, damage, or impair the Services</ListItem>
              <ListItem>Attempt to gain unauthorized access to any portion of the Services or any systems or networks connected to the Services</ListItem>
              <ListItem>Upload, transmit, or distribute any content that is harmful, offensive, obscene, or otherwise violates any applicable laws or regulations</ListItem>
              <ListItem>Use any automated means, including bots, scrapers, or spiders, to access or interact with the Services</ListItem>
              <ListItem>Impersonate another person or entity or misrepresent your affiliation with a person or entity</ListItem>
              <ListItem>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services</ListItem>
              <ListItem>Attempt to reverse engineer or decompile any software contained on the Services</ListItem>
            </List>
          </Sheet>
          
          <Typography level="body-md">
            We reserve the right to monitor and investigate violations of these Terms and to take appropriate legal action, 
            including reporting suspected unlawful activity to law enforcement authorities.
          </Typography>
        </>
      )
    },
    {
      id: "products",
      title: "Products and Services",
      icon: <ShoppingCart />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            BotaniCart offers a variety of plants, gardening tools, and related products for sale through our website. 
            We strive to provide accurate descriptions and images of our products, but we do not guarantee that product 
            descriptions or other content on the Services are accurate, complete, reliable, current, or error-free.
          </Typography>
          
          <Sheet variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="title-sm" mb={1}>Product Availability and Pricing</Typography>
            <Typography level="body-sm">
              All products are subject to availability. Prices for products are subject to change without notice. 
              We reserve the right to discontinue any product at any time and to limit quantities of any product that we offer.
            </Typography>
          </Sheet>
          
          <Sheet variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="title-sm" mb={1}>Plant Care Information</Typography>
            <Typography level="body-sm">
              Any plant care information provided on our website is for general reference only. The actual care requirements 
              for your plants may vary based on your specific environment, climate, and other factors. We are not responsible 
              for plant health after delivery.
            </Typography>
          </Sheet>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip variant="soft" color="primary">Seasonal Availability</Chip>
            <Chip variant="soft" color="neutral">Regional Restrictions</Chip>
            <Chip variant="soft" color="neutral">Size Variations</Chip>
            <Chip variant="soft" color="neutral">Color Differences</Chip>
          </Box>
          
          <Typography level="body-sm">
            Please note that actual plants may vary in appearance from the photos shown on our website due to natural 
            variations in plants, seasonal changes, and growing conditions.
          </Typography>
        </>
      )
    },
    {
      id: "orders",
      title: "Orders and Payment",
      icon: <Payment />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            By placing an order through the Services, you are making an offer to purchase products. We reserve the right 
            to accept or decline your order at our sole discretion.
          </Typography>
          
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemDecorator><Info color="primary" /></ListItemDecorator>
              <Typography fontWeight="md">Order Confirmation</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                An order confirmation does not constitute acceptance of your order. We will send you a separate email 
                to confirm that your order has been accepted and is being processed.
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><Info color="primary" /></ListItemDecorator>
              <Typography fontWeight="md">Payment Methods</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                We accept various payment methods as indicated on our checkout page. All payments must be made in full 
                before your order will be processed.
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><Info color="primary" /></ListItemDecorator>
              <Typography fontWeight="md">Price Errors</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                If a product is listed at an incorrect price due to typographical error or pricing error, we reserve the 
                right to refuse or cancel orders placed for the product listed at the incorrect price.
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><Info color="primary" /></ListItemDecorator>
              <Typography fontWeight="md">Taxes</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                You are responsible for paying all taxes associated with your purchase. Applicable sales tax will be 
                calculated and added to your order at checkout.
              </Typography>
            </ListItem>
          </List>
          
          <Typography level="body-md">
            By providing your payment information, you represent and warrant that you have the legal right to use any 
            payment method you provide in connection with any purchase.
          </Typography>
        </>
      )
    },
    {
      id: "shipping",
      title: "Shipping and Delivery",
      icon: <LocalShipping />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            We ship to the locations listed on our website. Shipping times and costs vary based on your location, the 
            products ordered, and the shipping method selected at checkout.
          </Typography>
          
          <Sheet variant="soft" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="title-sm" mb={1}>Shipping Policies</Typography>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>We aim to process orders within 1-2 business days after payment confirmation</ListItem>
              <ListItem>Delivery timeframes are estimates only and are not guaranteed</ListItem>
              <ListItem>Additional shipping fees may apply for oversized items or expedited delivery</ListItem>
              <ListItem>We are not responsible for delays caused by customs, weather conditions, or other factors outside our control</ListItem>
            </List>
          </Sheet>
          
          <Sheet variant="soft" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="title-sm" mb={1}>Plant Shipping Considerations</Typography>
            <Typography level="body-sm" mb={1}>
              Live plants are shipped with care but may experience stress during transit. Upon receipt:
            </Typography>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>Unpack your plants immediately</ListItem>
              <ListItem>Water as needed according to the care instructions provided</ListItem>
              <ListItem>Allow plants time to acclimate to their new environment</ListItem>
              <ListItem>Report any shipping damage within 48 hours of delivery</ListItem>
            </List>
          </Sheet>
          
          <Typography level="body-md">
            You are responsible for providing accurate shipping information. We are not responsible for delays or 
            non-delivery resulting from incorrect shipping information.
          </Typography>
        </>
      )
    },
    {
      id: "returns",
      title: "Returns and Refunds",
      icon: <Delete />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            We want you to be completely satisfied with your purchase. Please review our Return Policy below:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" mb={0.5}>Non-Plant Products</Typography>
              <Typography level="body-sm">
                Non-plant products may be returned within 30 days of delivery if they are unused and in their original packaging. 
                A 15% restocking fee may apply.
              </Typography>
            </Sheet>
            
            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" mb={0.5}>Live Plants</Typography>
              <Typography level="body-sm">
                Due to the perishable nature of plants, we have a specialized return policy for live plants. Plants that arrive 
                damaged or dead upon arrival may be eligible for replacement or refund if reported within 48 hours of delivery 
                with photographic evidence.
              </Typography>
            </Sheet>
            
            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" mb={0.5}>Return Process</Typography>
              <Typography level="body-sm">
                To initiate a return, please contact our customer service team with your order number and reason for return. 
                You will receive specific instructions on how to proceed with your return.
              </Typography>
            </Sheet>
            
            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" mb={0.5}>Refund Processing</Typography>
              <Typography level="body-sm">
                Refunds will be issued to the original payment method once we have received and inspected the returned items. 
                Processing times for refunds may vary depending on your payment method.
              </Typography>
            </Sheet>
          </Box>
          
          <Typography level="body-sm">
            We reserve the right to refuse returns that do not comply with our Return Policy. Shipping costs are 
            non-refundable unless the return is due to our error.
          </Typography>
        </>
      )
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <Article />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            The Services and all content, features, and functionality thereof, including but not limited to text, graphics, 
            logos, button icons, images, audio clips, data compilations, and software, are the property of BotaniCart 
            or its licensors and are protected by United States and international copyright, trademark, patent, trade secret, 
            and other intellectual property or proprietary rights laws.
          </Typography>
          
          <Sheet variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="title-sm" mb={1}>Limited License</Typography>
            <Typography level="body-sm">
              Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to 
              access and use the Services for your personal, non-commercial use. This license does not include the right to:
            </Typography>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>Modify or copy any materials from the Services</ListItem>
              <ListItem>Use any materials for any commercial purpose</ListItem>
              <ListItem>Transfer the materials to another person or "mirror" the materials on any other server</ListItem>
              <ListItem>Use data mining, robots, or similar data gathering and extraction methods</ListItem>
            </List>
          </Sheet>
          
          <Typography level="body-md" mb={2}>
            Any use of the Services not expressly permitted by these Terms is a breach of these Terms and may violate 
            copyright, trademark, and other laws.
          </Typography>
          
          <Typography level="body-sm">
            If you believe that any content on the Services violates your copyright, please contact us with information 
            supporting your claim, and we will take appropriate action.
          </Typography>
        </>
      )
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitation of Liability",
      icon: <Gavel />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            THE SERVICES AND ALL PRODUCTS OFFERED THROUGH THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. 
            BotaniCart MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION 
            OF THE SERVICES OR THE INFORMATION, CONTENT, MATERIALS, OR PRODUCTS INCLUDED ON THE SERVICES.
          </Typography>
          
          <Sheet variant="soft" color="warning" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="body-md" fontWeight="md" mb={1}>Disclaimer of Warranties</Typography>
            <Typography level="body-sm">
              TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, BotaniCart DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, 
              INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </Typography>
          </Sheet>
          
          <Sheet variant="soft" color="warning" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="body-md" fontWeight="md" mb={1}>Limitation of Liability</Typography>
            <Typography level="body-sm">
              BotaniCart WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM THE USE OF THE SERVICES, 
              INCLUDING, BUT NOT LIMITED TO, DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, AND CONSEQUENTIAL DAMAGES.
            </Typography>
          </Sheet>
          
          <Typography level="body-md">
            Some jurisdictions do not allow limitations on implied warranties or the exclusion or limitation of certain damages. 
            If these laws apply to you, some or all of the above disclaimers, exclusions, or limitations may not apply to you, 
            and you might have additional rights.
          </Typography>
        </>
      )
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <ContactSupport />,
      content: (
        <>
          <Typography level="body-md" mb={3}>
            If you have any questions about these Terms and Conditions, please contact us using one of the following methods:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
            <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md', flex: 1 }}>
              <Typography level="title-md" mb={1}>Customer Service</Typography>
              <Typography level="body-md" mb={0.5}>Email: <Link href="mailto:support@theplantpalette.com">support@theplantpalette.com</Link></Typography>
              <Typography level="body-md">Phone: +1 (503) 555-1234</Typography>
            </Sheet>
            
            <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md', flex: 1 }}>
              <Typography level="title-md" mb={1}>Postal Address</Typography>
              <Typography level="body-md">
                Legal Department<br />
                BotaniCart Ltd.<br />
                150 Green Avenue<br />
                Portland, OR 97204<br />
                United States
              </Typography>
            </Sheet>
          </Box>
          
          <Typography level="body-sm">
            Thank you for using BotaniCart!
          </Typography>
        </>
      )
    }
  ];

  return (
    <Container sx={{ py: 5 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          level="h1"
          fontSize={{ xs: 'xl3', md: 'xl4' }}
          fontWeight="lg"
          sx={{ mb: 1 }}
        >
          Terms and Conditions
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Timer fontSize="small" />
          <Typography level="body-sm" color="neutral.600">
            Last Updated: May 9, 2025
          </Typography>
        </Box>
        
        <Sheet 
          variant="soft" 
          color="primary" 
          sx={{ 
            p: 2, 
            borderRadius: 'md',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Info />
          <Typography level="body-md">
            These Terms and Conditions govern your use of BotaniCart website and services. By using our 
            website, you agree to these terms. Please read them carefully.
          </Typography>
        </Sheet>
      </Box>
      
      {/* Table of Contents */}
      <Card variant="outlined" sx={{ mb: 4, borderRadius: 'md' }}>
        <Typography level="title-lg" sx={{ p: 2 }}>
          Table of Contents
        </Typography>
        <Divider />
        <Box sx={{ p: 2 }}>
          <List>
            {sections.map((section, index) => (
              <ListItem key={index}>
                <ListItemDecorator>
                  {section.icon}
                </ListItemDecorator>
                <Link
                  level="body-md"
                  href={`#${section.id}`}
                  underline="none"
                  sx={{ 
                    color: 'neutral.800', 
                    '&:hover': { color: 'primary.600' } 
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setExpandedSection(index);
                    document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {section.title}
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Card>
      
      {/* Policy Sections */}
      <Box sx={{ mb: 4 }}>
        {sections.map((section, index) => (
          <Accordion
            key={index}
            expanded={expandedSection === index}
            onChange={() => handleSectionChange(index)}
            sx={{ 
              mb: 2,
              borderRadius: 'lg',
              boxShadow: expandedSection === index ? 'sm' : 'none',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <AccordionSummary
              id={section.id}
              indicator={<ExpandMore />}
              sx={{ 
                minHeight: 56,
                '&:hover': { bgcolor: 'neutral.softBg' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ color: 'primary.500' }}>
                  {section.icon}
                </Box>
                <Typography level="title-lg">{`${index + 1}. ${section.title}`}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 1, pb: 3, px: 4 }}>
              {section.content}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      
      {/* Footer and Print */}
      <Card 
        variant="soft" 
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
        <Box>
          <Typography level="title-md" sx={{ mb: 1 }}>
            Need a copy of these terms?
          </Typography>
          <Typography level="body-sm">
            You can save or print this page for your records.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="neutral"
          onClick={() => window.print()}
          sx={{ 
            alignSelf: { xs: 'center', sm: 'flex-end' }
          }}
        >
          Print Terms
        </Button>
      </Card>
      
      <Typography level="body-sm" textAlign="center" sx={{ mt: 4, color: 'neutral.500' }}>
        BotaniCart Ltd. © {new Date().getFullYear()} | All Rights Reserved
      </Typography>
    </Container>
  );
};

export default TermsAndConditions;