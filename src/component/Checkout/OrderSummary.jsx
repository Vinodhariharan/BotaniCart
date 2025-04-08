import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Divider, 
  Button, 
  Stack
} from '@mui/joy';
import PaymentIcon from '@mui/icons-material/Payment';

const OrderSummary = ({ subtotal, shipping, tax, total, onPlaceOrder, disabled }) => {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <PaymentIcon sx={{ mr: 1 }} />
        <Typography level="h5">Order Summary</Typography>
      </Stack>
      <Divider />
      
      <Stack spacing={1.5} sx={{ my: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Subtotal</Typography>
          <Typography>${subtotal}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Shipping</Typography>
          <Typography>${shipping.toFixed(2)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Tax</Typography>
          <Typography>${tax}</Typography>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Typography level="h6">Total</Typography>
          <Typography level="h6">${total}</Typography>
        </Stack>
      </Stack>
      
      <Button
        fullWidth
        size="lg"
        color="success"
        onClick={onPlaceOrder}
        disabled={disabled}
      >
        Place Order
      </Button>
    </Card>
  );
};

export default OrderSummary;