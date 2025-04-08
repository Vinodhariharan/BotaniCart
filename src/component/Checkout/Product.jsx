import React from 'react';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';

const Product = ({ product }) => {
  return (
    <div>
      <Stack direction="row"  justifyContent="space-between">
        <Stack direction='row' spacing={2} alignItems="center" sx={{ mt: 2 }}  >
        <img src={product.imageSrc} alt={product.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', marginTop:'0' }} />
        <Stack direction="column" spacing={1}>
          <Typography variant="h6">{product.title}</Typography>
          <Typography variant="body2">Type: {product.Type}</Typography>
          <Typography variant="body2">Category: {product.category}</Typography>
        </Stack>
        </Stack>
        <Typography variant="body1" sx={{ marginLeft: 'auto', textAlign: 'right' }}>
          ${product.price.toFixed(2)}
        </Typography>
      </Stack>
    </div>
  );
};

export default Product;
