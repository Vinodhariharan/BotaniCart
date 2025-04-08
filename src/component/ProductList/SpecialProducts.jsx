import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust the path as needed
import ProductList from './ProductList'; // Your existing ProductList component
import { Typography, Box, CircularProgress } from '@mui/joy';

function SpecialProducts({ type }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const title = {
    newArrival: 'New Arrivals',
    bestSelling: 'Bestselling',
    featured: 'Featured',
  }[type];

  const field = {
    newArrival: 'newArrival',
    bestSelling: 'bestSelling',
    featured: 'featured',
  }[type];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsQuery = query(
          collection(db, 'products'),
          where(field, '==', true)
        );
        const productsSnapshot = await getDocs(productsQuery);
        const productsData = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
      } catch (err) {
        console.error(`Error fetching ${type} products:`, err);
        setError(`Failed to load ${type} products. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, field]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography color="danger">{error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Typography level="h2" sx={{ textAlign: 'center', mb: 4 }}>{title}</Typography>
      <ProductList products={products} />
    </div>
  );
}

export default SpecialProducts;