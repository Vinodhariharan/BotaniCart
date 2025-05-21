import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Box, Typography, Card, Button, Divider, Sheet, AspectRatio } from '@mui/joy';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

const ThankYou = () => {
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  
  useEffect(() => {
    // Get order data from navigation state
    if (location.state && location.state.orderId && location.state.orderNumber) {
      setOrderData({
        orderId: location.state.orderId,
        orderNumber: location.state.orderNumber
      });
    }
  }, [location]);

  if (!orderData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography level="h4">Order information not found. Please check your orders in your account.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 800, 
      mx: 'auto', 
      py: 6, 
      px: 3,
      display: 'flex', 
      flexDirection: 'column', 
      gap: 4 
    }}>
      {/* Success Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <CheckCircleRoundedIcon sx={{ fontSize: 60, color: 'success.500', mb: 2 }} />
        <Typography level="h2" sx={{ mb: 1 }}>Thank You for Your Order!</Typography>
        <Typography level="body-lg" sx={{ color: 'neutral.600' }}>
          Order #{orderData.orderNumber} has been successfully placed.
        </Typography>
      </Box>

      {/* Order Card */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="h4" sx={{ mb: 2 }}>Order Confirmation</Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
          <Sheet variant="soft" color="success" sx={{ 
            p: 2, 
            borderRadius: 'sm',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <LocalShippingRoundedIcon />
            <Typography level="title-md">Shipping Soon</Typography>
            <Typography level="body-sm" textAlign="center">
              We're preparing your plants with care
            </Typography>
          </Sheet>
          
          <Sheet variant="soft" color="primary" sx={{ 
            p: 2, 
            borderRadius: 'sm',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}>
            <HomeRoundedIcon />
            <Typography level="title-md">Tracking Details</Typography>
            <Typography level="body-sm" textAlign="center">
              You'll receive an email with tracking information
            </Typography>
          </Sheet>
        </Box>

        <Typography level="body-md" sx={{ mb: 2 }}>
          We've sent a confirmation email to your registered address with all order details.
        </Typography>
        
        <Typography level="body-sm" sx={{ color: 'neutral.600', mb: 3 }}>
          Order ID: {orderData.orderId}
        </Typography>
      </Card>

      {/* Plant Care Tips */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography level="h4" sx={{ mb: 2 }}>Plant Care Tips</Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <AspectRatio ratio="1" sx={{ minWidth: { xs: '100%', md: 150 } }}>
            <img 
              src="https://images.stockcake.com/public/4/9/c/49cfcb77-32a7-4199-9291-0ebc76c97388_medium/fertilizing-young-plant-stockcake.jpg"
              alt="Plant care"
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          </AspectRatio>
          
          <Box>
            <Typography level="title-md" sx={{ mb: 1 }}>Welcome to the Plant Family!</Typography>
            <Typography level="body-md" sx={{ mb: 2 }}>
              Your new green friends will arrive soon. In the meantime, here are some quick tips:
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>Check soil moisture before watering</li>
              <li>Find the perfect spot with appropriate light</li>
              <li>Allow time for your plants to acclimate to their new home</li>
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} component={Link} to='/care-guides'>
              View Plant Care Guides
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
        <Button 
          component={Link} 
          to="/account/orders" 
          variant="outlined" 
          color="neutral"
        >
          View My Orders
        </Button>
        <Button 
          component={Link} 
          to="/" 
          variant="solid" 
          color="primary"
        >
          Continue Shopping
        </Button>
      </Box>
    </Box>
  );
};

export default ThankYou;