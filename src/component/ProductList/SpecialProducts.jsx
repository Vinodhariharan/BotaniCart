import React from 'react';
import { Typography, Box } from '@mui/joy';
import ProductList from './ProductList'; // Your existing ProductList component

/**
 * SpecialProducts component that displays filtered product lists based on type
 * (newArrival, bestSelling, or featured)
 * 
 * @param {Object} props
 * @param {string} props.type - The type of special products to display ('newArrival', 'bestSelling', or 'featured')
 */
function SpecialProducts({ type }) {
  const title = {
    newArrival: 'New Arrivals',
    bestSelling: 'Bestselling',
    featured: 'Featured Products',
  }[type] || 'Products';

  const field = {
    newArrival: 'newArrival',
    bestSelling: 'bestSelling',
    featured: 'featured',
  }[type];

  // Instead of fetching products directly, we'll pass a filter configuration
  // to the ProductList component
  return (
    <Box sx={{ width: '100%' }}>
      <Typography level="h2" sx={{ textAlign: 'center', mb: 4 }}>
        {title}
      </Typography>
      
      {/* Pass specialFilter prop to ProductList to handle the specific filtering */}
      <ProductList 
        initialCategory="All"
        specialFilter={{
          field,
          value: true
        }}
      />
    </Box>
  );
}

export default SpecialProducts;