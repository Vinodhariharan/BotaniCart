import React from 'react';
import { Grid, Card, AspectRatio, Box, Typography, Button } from '@mui/joy';
import ProductCard from '../AllComp/CardComponent';

const ProductGrid = ({ products, viewMode }) => (
  <Grid container spacing={2} sx={{ mt: 1, display: viewMode === 'list' ? 'block' : 'flex' }}>
    {products.map((product, index) => (
      viewMode === 'grid' ? (
        <Grid item xs={12} sm={6} md={3} key={product.id || index}> {/* Modified md to 3 */}
          <ProductCard product={{ ...product, imageSrc: product.imageSrc, title: product.title, price: product.price, description: product.description, link: product.link, stock: 100 }} />
        </Grid>
      ) : (
        <Card key={product.id || index} variant="outlined" orientation="horizontal" sx={{ mb: 2, overflow: 'hidden' }}>
          <AspectRatio ratio="1" sx={{ width: 120 }}>
            <img src={product.imageSrc || '/api/placeholder/150/150'} alt={product.title} loading="lazy" />
          </AspectRatio>
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Typography level="title-md">{product.title}</Typography>
            <Typography level="body-sm" noWrap sx={{ mt: 0.5 }}>{product.description}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, alignItems: 'center' }}>
              <Typography level="title-lg">${product.price}</Typography>
              <Button size="sm" variant="solid" color="primary">
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Card>
      )
    ))}
  </Grid>
);

export default ProductGrid;