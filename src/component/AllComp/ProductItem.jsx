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

export const ProductItem = ({ product }) => {
    return (
      <Box sx={{ display: 'flex', width: '100%', py: 1 }}>
        <AspectRatio ratio="1" sx={{ width: 80, flexShrink: 0, mr: 2, borderRadius: 'sm', overflow: 'hidden' }}>
          <img src={product.imageSrc} alt={product.title} loading="lazy" />
        </AspectRatio>
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography level="title-md">{product.title}</Typography>
            <Typography level="title-md">${(product.price * product.quantity).toFixed(2)}</Typography>
          </Stack>
          <Typography level="body-sm" sx={{ mt: 0.5 }}>
            {product.description?.substring(0, 60)}...
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Typography level="body-sm">Qty: {product.quantity}</Typography>
            <Typography level="body-sm">Price: ${product.price.toFixed(2)}</Typography>
          </Stack>
        </Box>
      </Box>
    );
  };