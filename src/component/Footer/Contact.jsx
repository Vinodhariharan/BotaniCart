import React from 'react';
import { 
  AspectRatio,
  Box, 
  Card, 
  CardContent, 
  Container, 
  Divider, 
  Grid, 
  Link, 
  Typography, 
  useTheme 
} from '@mui/joy';
import {
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  BusinessCenter as BusinessCenterIcon,
  Support as SupportIcon,
  AccessTime as AccessTimeIcon,
  Language as LanguageIcon,
  BrandingWatermark,
  BrandingWatermarkOutlined
} from '@mui/icons-material';

const ContactCard = ({ icon, title, children, color = "primary" }) => (
  <Card 
    variant="outlined" 
    sx={{ 
      height: '100%',
      borderRadius: 'md',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 'md'
      }
    }}
  >
    <CardContent sx={{ textAlign: 'center' }}>
      <Box sx={{ color, fontSize: 40, mb: 1 }}>
        {icon}
      </Box>
      <Typography level="title-lg" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Typography level="body-md">
        {children}
      </Typography>
    </CardContent>
  </Card>
);

const ContactInformation = () => {
  const theme = useTheme();

  return (
    <Container sx={{ py: 5 }}>
      <Typography 
        level="h1" 
        fontSize={{ xs: 'xl3', md: 'xl4' }}
        fontWeight="lg"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        Contact BotaniCart Ltd.
      </Typography>
      
      <Typography 
        level="body-lg" 
        textAlign="center" 
        sx={{ mb: 5, maxWidth: 700, mx: 'auto' }}
      >
        Connect with our team to discover premium gardening products, plants, and tools. We're dedicated to bringing nature to your doorstep.
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Grid container spacing={3}>
          {/* Headquarters - New York */}
          <Grid xs={12} md={4}>
            <ContactCard icon={<BusinessCenterIcon />} title="Headquarters" color="success.500">
              <Typography level="body-md" fontWeight="md" mb={1}>New York Office - </Typography>
              <Typography level="body-sm">
                420 Park Avenue, 10th Floor<br />
                New York, NY 10022<br />
                United States
              </Typography>
            </ContactCard>
          </Grid>

          {/* Operations Center - Bangalore */}
          <Grid xs={12} md={4}>
            <ContactCard icon={<SupportIcon />} title="Operations Center" color="success.500">
              <Typography level="body-md" fontWeight="md" mb={1}>Bangalore Office - </Typography>
              <Typography level="body-sm">
                Prestige Tech Park, Tower C<br />
                Outer Ring Road, Marathahalli<br />
                Bangalore 560103, India
              </Typography>
            </ContactCard>
          </Grid>

          {/* Office Hours */}
          <Grid xs={12} md={4}>
            <ContactCard icon={<AccessTimeIcon />} title="Business Hours" color="success.500">
              <Typography level="body-sm">
                <strong>Monday - Friday:</strong><br />
                9:00 AM - 6:00 PM (EST)<br />
                <strong>Customer Support:</strong><br />
                24/7 Online Support
              </Typography>
            </ContactCard>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 5 }} />

      <Typography level="title-lg" textAlign="center" sx={{ mb: 4 }}>
        Get In Touch
      </Typography>

      <Grid container spacing={3}>
        {/* Email */}
        <Grid xs={12} md={4}>
          <ContactCard icon={<EmailIcon />} title="Email Us">
            <Link
              href="mailto:info@botanicart.com"
              underline="none"
              sx={{ color: 'neutral.800', '&:hover': { color: 'primary.600' } }}
            >
              info@botanicart.com
            </Link>
            <Box>
            <Typography level="body-sm" mt={1}>
              For general inquiries
            </Typography>
            </Box>
            <Link
              href="mailto:support@botanicart.com"
              underline="none"
              sx={{ color: 'neutral.800', '&:hover': { color: 'primary.600' } }}
              display="block"
              mt={1}
            >
              support@botanicart.com
            </Link>
            <Typography level="body-sm" mt={1}>
              For customer support
            </Typography>
          </ContactCard>
        </Grid>

        {/* Phone */}
        <Grid xs={12} md={4}>
          <ContactCard icon={<PhoneIcon />} title="Call Us">
            <Link
              href="tel:+12125557890"
              underline="none"
              sx={{ color: 'neutral.800', '&:hover': { color: 'primary.600' } }}
            >
              +1 (212) 555-7890
            </Link>
            <Box>
            <Typography level="body-sm" mt={1}>
              US Headquarters
            </Typography>
            </Box>
            <Link
              href="tel:+918041234567"
              underline="none"
              sx={{ color: 'neutral.800', '&:hover': { color: 'primary.600' } }}
              display="block"
              mt={1}
            >
              +91 (80) 4123-4567
            </Link>
            <Typography level="body-sm" mt={1}>
              India Operations Center
            </Typography>
          </ContactCard>
        </Grid>

        {/* Website */}
        <Grid xs={12} md={4}>
          <ContactCard icon={<LanguageIcon />} title="Online">
            <Link
              href="https://www.botanicart.com"
              target="_blank"
              underline="none"
              sx={{ color: 'neutral.800', '&:hover': { color: 'primary.600' } }}
            >
              www.botanicart.com
            </Link>
            <Box>
            <Typography level="body-sm" mt={2}>
              Follow us on:
            </Typography>
            </Box>
            <Box sx={{ mt: 1, display: 'flex', gap: 2, justifyContent: 'center' }}>
              {['instagram', 'facebook', 'twitter', 'pinterest'].map((social) => (
                <Link
                  key={social}
                  href={`https://www.${social}.com/botanicart`}
                  target="_blank"
                  underline="none"
                  sx={{ 
                    color: 'neutral.600', 
                    '&:hover': { color: 'primary.600' },
                    textTransform: 'capitalize'
                  }}
                >
                  {social}
                </Link>
              ))}
            </Box>
          </ContactCard>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <AspectRatio
          ratio="21/9"
          maxHeight={700}
          objectFit="cover"
          sx={{ 
            borderRadius: 'md',
            overflow: 'hidden',
            boxShadow: 'sm',
            mb: 2
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1472224371017-08207f84aaae?q=80&w=2070" 
            alt="BotaniCart Global Presence" 
          />
        </AspectRatio>
        <Typography level="body-sm" color="neutral.500">
          BotaniCart Ltd. © {new Date().getFullYear()} | All Rights Reserved
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactInformation;