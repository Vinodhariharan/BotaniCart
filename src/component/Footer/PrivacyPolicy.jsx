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
  PrivacyTip,
  Security,
  Cookie,
  Gavel,
  CheckCircle,
  Info,
  ContactSupport,
  ChevronRight,
  Timer,
  Home
} from '@mui/icons-material';

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleSectionChange = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  // Table of contents sections
  const sections = [
    {
      id: "information-collected",
      title: "Information We Collect",
      icon: <Info />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            BotaniCart Ltd. collects several types of information from and about users of our website, including:
          </Typography>
          
          <Sheet variant="soft" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="title-sm" mb={1}>Personal Information</Typography>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>Name, email address, mailing address, phone number</ListItem>
              <ListItem>Billing information and payment details (we do not store full credit card numbers)</ListItem>
              <ListItem>Order history and product preferences</ListItem>
              <ListItem>Communications with our customer service team</ListItem>
            </List>
          </Sheet>
          
          <Sheet variant="soft" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="title-sm" mb={1}>Automatically Collected Information</Typography>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>IP address and device information</ListItem>
              <ListItem>Browser type and version</ListItem>
              <ListItem>Time spent on pages and navigation patterns</ListItem>
              <ListItem>Referral sources and exit pages</ListItem>
            </List>
          </Sheet>
          
          <Typography level="body-md">
            We collect this information when you create an account, place an order, sign up for our newsletter, 
            participate in surveys or promotions, or interact with our website in other ways.
          </Typography>
        </>
      )
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: <Security />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            BotaniCart uses the information we collect for various business purposes, including:
          </Typography>
          
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Order Processing and Fulfillment</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                To process and deliver your orders, send order confirmations, and provide shipping updates
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Customer Service</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                To respond to your inquiries, provide support, and resolve issues with your orders or account
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Personalization</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                To remember your preferences, recommend products you might like, and provide a customized experience
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Marketing Communications</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                To send promotional emails, special offers, and newsletters (with your consent)
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Website Improvement</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                To analyze usage patterns, troubleshoot issues, and enhance our website functionality
              </Typography>
            </ListItem>
          </List>
          
          <Typography level="body-md">
            We process your information based on contract fulfillment (for orders), legitimate interests 
            (for website improvement), and your consent (for marketing communications).
          </Typography>
        </>
      )
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      icon: <Cookie />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            BotaniCart uses cookies and similar tracking technologies to enhance your browsing experience 
            and collect information about how you use our website.
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography level="title-sm" mb={1}>Types of Cookies We Use:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip variant="soft" color="primary">Essential Cookies</Chip>
              <Chip variant="soft" color="neutral">Functional Cookies</Chip>
              <Chip variant="soft" color="neutral">Analytics Cookies</Chip>
              <Chip variant="soft" color="neutral">Marketing Cookies</Chip>
            </Box>
            
            <Typography level="body-sm">
              <strong>Essential cookies</strong> are necessary for the website to function properly and cannot be disabled.
              Other cookie types can be managed through your browser settings or our cookie preference center.
            </Typography>
          </Box>
          
          <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 2 }}>
            <Typography level="body-md" fontWeight="md" mb={1}>Cookie Control</Typography>
            <Typography level="body-sm">
              You can manage your cookie preferences by:
            </Typography>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>Adjusting your browser settings to block or delete cookies</ListItem>
              <ListItem>Using our cookie preference center accessible from the footer of our website</ListItem>
              <ListItem>Clicking "Manage Cookies" in the cookie banner that appears when you first visit our site</ListItem>
            </List>
          </Sheet>
          
          <Typography level="body-sm">
            Please note that disabling certain cookies may impact your experience on our website and 
            limit the functionality of some features.
          </Typography>
        </>
      )
    },
    {
      id: "data-sharing",
      title: "Data Sharing and Third Parties",
      icon: <Gavel />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            BotaniCart values your privacy and limits sharing your personal information. 
            We may share data with the following categories of third parties:
          </Typography>
          
          <Sheet variant="soft" sx={{ p: 2, mb: 2, borderRadius: 'md' }}>
            <Typography level="title-sm" mb={1}>Service Providers</Typography>
            <Typography level="body-sm">
              We work with trusted service providers who perform services on our behalf, such as:
            </Typography>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>Payment processors to securely handle transactions</ListItem>
              <ListItem>Shipping and fulfillment partners to deliver your orders</ListItem>
              <ListItem>Customer support services to assist with inquiries</ListItem>
              <ListItem>Cloud hosting and data storage providers</ListItem>
            </List>
            <Typography level="body-xs" mt={1}>
              All service providers are bound by contracts that require them to protect your data.
            </Typography>
          </Sheet>
          
          <Typography level="body-sm" mb={2}>
            <strong>Business Transfers:</strong> If BotaniCart is involved in a merger, acquisition, or sale of all or part of its assets, 
            your personal information may be transferred as part of that transaction.
          </Typography>
          
          <Typography level="body-sm" mb={2}>
            <strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, 
            or governmental regulations, or if we believe disclosure is necessary to protect our rights or the safety of others.
          </Typography>
          
          <Typography level="body-sm" fontWeight="md">
            We do not sell or rent your personal information to third parties for their marketing purposes 
            without your explicit consent.
          </Typography>
        </>
      )
    },
    {
      id: "data-security",
      title: "Data Security and Protection",
      icon: <Security />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            Protecting your personal information is a priority at BotaniCart. We implement appropriate 
            technical and organizational measures to secure your data, including:
          </Typography>
          
          <List sx={{ mb: 2 }}>
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Encryption</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                We use SSL/TLS encryption to protect data transmitted between your browser and our website
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Access Controls</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                Employee access to personal data is restricted on a need-to-know basis
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Security Assessments</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                Regular security assessments and vulnerability testing of our systems
              </Typography>
            </ListItem>
            
            <ListItem>
              <ListItemDecorator><CheckCircle color="success" /></ListItemDecorator>
              <Typography fontWeight="md">Data Minimization</Typography>
              <Typography level="body-sm" sx={{ pl: 3 }}>
                We collect only the information necessary for the specified purposes
              </Typography>
            </ListItem>
          </List>
          
          <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', mb: 2, bgcolor: 'background.level1' }}>
            <Typography level="body-md" fontWeight="md" mb={1}>Data Breach Procedures</Typography>
            <Typography level="body-sm">
              In the unlikely event of a data breach that compromises your personal information, we will:
            </Typography>
            <List marker="disc" sx={{ pl: 2 }}>
              <ListItem>Notify affected users promptly as required by applicable laws</ListItem>
              <ListItem>Work with security experts to mitigate the impact and prevent future incidents</ListItem>
              <ListItem>Cooperate with regulatory authorities as necessary</ListItem>
            </List>
          </Sheet>
          
          <Typography level="body-sm">
            While we implement these safeguards, no method of internet transmission or electronic storage 
            is 100% secure. We encourage you to help protect your personal information by maintaining 
            strong passwords and signing out of your account when using shared devices.
          </Typography>
        </>
      )
    },
    {
      id: "user-rights",
      title: "Your Privacy Rights",
      icon: <PrivacyTip />,
      content: (
        <>
          <Typography level="body-md" mb={2}>
            Depending on your location, you may have certain rights regarding your personal information:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" mb={0.5}>Access and Portability</Typography>
              <Typography level="body-sm">
                You have the right to request a copy of the personal information we hold about you 
                and to receive it in a structured, commonly used format.
              </Typography>
            </Sheet>
            
            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" mb={0.5}>Correction and Deletion</Typography>
              <Typography level="body-sm">
                You can request corrections to inaccurate information or ask us to delete your personal 
                data when it's no longer needed for legitimate purposes.
              </Typography>
            </Sheet>
            
            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" mb={0.5}>Objection and Restriction</Typography>
              <Typography level="body-sm">
                You can object to certain types of processing and request restrictions on how we use your data.
              </Typography>
            </Sheet>
            
            <Sheet variant="soft" sx={{ p: 2, borderRadius: 'md' }}>
              <Typography level="title-sm" mb={0.5}>Consent Withdrawal</Typography>
              <Typography level="body-sm">
                Where processing is based on consent, you can withdraw that consent at any time.
              </Typography>
            </Sheet>
          </Box>
          
          <Typography level="body-sm" mb={2}>
            To exercise these rights, please contact our Privacy Team at <Link href="mailto:privacy@botanicart.com">privacy@botanicart.com</Link>. 
            We will respond to your request within 30 days.
          </Typography>
          
          <Typography level="body-sm">
            If you are not satisfied with our response, you have the right to lodge a complaint with 
            your local data protection authority.
          </Typography>
        </>
      )
    },
    {
      id: "contact-us",
      title: "Contact Us",
      icon: <ContactSupport />,
      content: (
        <>
          <Typography level="body-md" mb={3}>
            If you have any questions, concerns, or requests regarding this Privacy Policy or the handling 
            of your personal information, please contact us using one of the following methods:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
            <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md', flex: 1 }}>
              <Typography level="title-md" mb={1}>Privacy Team</Typography>
              <Typography level="body-md" mb={0.5}>Email: <Link href="mailto:privacy@botanicart.com">privacy@botanicart.com</Link></Typography>
              <Typography level="body-md">Phone: +1 (212) 555-7890 ext. 123</Typography>
            </Sheet>
            
            <Sheet variant="outlined" sx={{ p: 3, borderRadius: 'md', flex: 1 }}>
              <Typography level="title-md" mb={1}>Postal Address</Typography>
              <Typography level="body-md">
                Data Protection Officer<br />
                BotaniCart Ltd.<br />
                420 Park Avenue, 10th Floor<br />
                New York, NY 10022<br />
                United States
              </Typography>
            </Sheet>
          </Box>
          
          <Typography level="body-sm">
            For general inquiries unrelated to privacy matters, please visit our <Link href="/contact">Contact Page</Link>.
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
          Privacy Policy
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
            This Privacy Policy explains how BotaniCart Ltd. collects, uses, and protects your 
            personal information when you use our website, mobile applications, and services.
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
            Need a copy of this policy?
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
          Print Policy
        </Button>
      </Card>
      
      <Typography level="body-sm" textAlign="center" sx={{ mt: 4, color: 'neutral.500' }}>
        BotaniCart Ltd. © {new Date().getFullYear()} | All Rights Reserved
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;