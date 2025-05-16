import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, limit, documentId } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../../firebaseConfig';
import { Box, Typography, CircularProgress } from '@mui/joy';
import CardSlider from './CardSlider';

const RelatedProducts = ({ category, currentProductId, limit: productLimit = 6 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = auth.currentUser;
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!category || !currentProductId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Create a query to get products in the same category, excluding the current one
        const productsRef = collection(db, 'products');
        const q = query(
  productsRef, 
  where('category', '==', category),
  where(documentId(), '!=', currentProductId),
  limit(productLimit)
);


        const querySnapshot = await getDocs(q);
        const relatedProductsData = [];
        
        querySnapshot.forEach((doc) => {
          relatedProductsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setProducts(relatedProductsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching related products:", err);
        setError("Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, currentProductId, productLimit, db]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography level="body-md" color="danger">
          {error}
        </Typography>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography level="body-md">
          No related products found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <CardSlider products={products} user={user} />
    </Box>
  );
};

export default RelatedProducts;