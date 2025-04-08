import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Divider, 
  Stack, 
  List, 
  ListItem, 
  CircularProgress,
  AspectRatio
} from '@mui/joy';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { ProductItem } from '../AllComp/ProductItem';
// Product Item Component


const CartItems = ({ products, loading }) => {
  return (
    <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
        <ShoppingBagIcon sx={{ mr: 1 }} />
        <Typography level="h5">Your Cart ({products.length} items)</Typography>
      </Stack>
      <Divider />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size="sm" />
          <Typography sx={{ ml: 2 }}>Loading products...</Typography>
        </Box>
      ) : (
        <List>
          {products.map((product) => (
            <ListItem key={product.id}>
              <ProductItem product={product} />
            </ListItem>
          ))}
          {products.length === 0 && (
            <Typography sx={{ py: 2, textAlign: 'center' }}>Your cart is empty</Typography>
          )}
        </List>
      )}
    </Card>
  );
};

export default CartItems; 