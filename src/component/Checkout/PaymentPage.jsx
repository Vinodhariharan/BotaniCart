import React, { useState } from 'react';
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  Box,
  Stack,
  Divider,
  Card,
  FormControl,
  FormLabel,
  Input,
  Alert,
  CircularProgress
} from '@mui/joy';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const PaymentPage = ({ open, onClose, onPaymentSuccess, orderTotal, userData, products }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: userData.billingInfo.cardNumber,
    cardHolder: userData.billingInfo.cardholderName,
    expiryDate: userData.billingInfo.expiryDate,
    cvv: userData.billingInfo.cvv
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Basic validation
    if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
      setError("Please fill in all card details");
      setLoading(false);
      return;
    }
    
    try {
      // In a real app, you would process payment with Stripe or another provider here
      // For this demo, we'll simulate a successful payment
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create payment details object that would normally come from payment processor
      const paymentDetails = {
        paymentId: `pi_${Math.random().toString(36).substr(2, 10)}`,
        paymentMethod: "credit_card",
        paymentProvider: "stripe",
        transactionReference: `txn_${Math.random().toString(36).substr(2, 10)}`,
        cardLast4: cardDetails.cardNumber.slice(-4),
        status: "succeeded"
      };
      
      // Call the onPaymentSuccess callback with payment details
      onPaymentSuccess(paymentDetails);
    } catch (err) {
      console.error("Payment processing error:", err);
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal open={open} onClose={loading ? null : onClose}>
      <ModalDialog size="lg" aria-labelledby="payment-dialog-title">
        <Typography id="payment-dialog-title" level="h4" startDecorator={<CreditCardIcon />}>
          Payment Details
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <Typography level="h6" sx={{ mb: 2 }}>Order Summary</Typography>
            <Typography>Total Amount: ${orderTotal}</Typography>
            <Typography>Items: {products.length}</Typography>
            <Typography>Shipping to: {userData?.billingInfo?.addressLine1}, {userData?.billingInfo?.city}</Typography>
          </Card>
          
          <Stack spacing={2}>
            <FormControl required>
              <FormLabel>Card Number</FormLabel>
              <Input
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                disabled={loading}
                slotProps={{
                  input: {
                    maxLength: 19,
                  },
                }}
              />
            </FormControl>
            
            <FormControl required>
              <FormLabel>Card Holder Name</FormLabel>
              <Input
                name="cardHolder"
                value={cardDetails.cardHolder}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={loading}
              />
            </FormControl>
            
            <Stack direction="row" spacing={2}>
              <FormControl required sx={{ flex: 1 }}>
                <FormLabel>Expiry Date</FormLabel>
                <Input
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  disabled={loading}
                  slotProps={{
                    input: {
                      maxLength: 5,
                    },
                  }}
                />
              </FormControl>
              
              <FormControl required sx={{ flex: 1 }}>
                <FormLabel>CVV</FormLabel>
                <Input
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  disabled={loading}
                  type="password"
                  slotProps={{
                    input: {
                      maxLength: 4,
                    },
                  }}
                />
              </FormControl>
            </Stack>
          </Stack>
          
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              color="success"
              loading={loading}
              loadingPosition="start"
              startDecorator={loading ? <CircularProgress size="sm" /> : null}
            >
              {loading ? 'Processing...' : 'Complete Payment'}
            </Button>
          </Stack>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default PaymentPage;