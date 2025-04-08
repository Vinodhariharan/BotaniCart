import React, { useState } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Assuming this is your Firebase config import
import { Button, Typography, Box, Alert, CircularProgress } from '@mui/joy';

const CategoryExtractorTool = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState({ success: false, message: '', categories: [] });
  const [error, setError] = useState(null);

  const extractAndSaveCategories = async () => {
    setIsExtracting(true);
    setResult({ success: false, message: '', categories: [] });
    setError(null);
    
    try {
      // Get all products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Extract unique categories
      const uniqueCategories = new Map();
      
      products.forEach(product => {
        // Check if the product has a category
        if (product.category) {
          // If it's a string, add it directly
          if (typeof product.category === 'string') {
            if (!uniqueCategories.has(product.category)) {
              uniqueCategories.set(product.category, {
                name: product.category,
                count: 1,
                imageUrl: product.imageUrl || '' 
              });
            } else {
              // Increment count for existing category
              const category = uniqueCategories.get(product.category);
              uniqueCategories.set(product.category, {
                ...category,
                count: category.count + 1
              });
            }
          } 
          // If it's an object with an id and name (like a reference), use it
          else if (product.category.id && product.category.name) {
            if (!uniqueCategories.has(product.category.id)) {
              uniqueCategories.set(product.category.id, {
                name: product.category.name,
                count: 1,
                imageUrl: product.imageUrl || ''
              });
            } else {
              // Increment count for existing category
              const category = uniqueCategories.get(product.category.id);
              uniqueCategories.set(product.category.id, {
                ...category,
                count: category.count + 1
              });
            }
          }
        }
      });
      
      // Save categories to Firestore
      const savedCategories = [];
      
      for (const [categoryId, categoryData] of uniqueCategories.entries()) {
        // Use the category name or ID as the document ID
        const docId = categoryId.replace(/\s+/g, '-').toLowerCase();
        
        // Add timestamp and other useful fields
        const categoryDoc = {
          ...categoryData,
          id: docId,
          createdAt: new Date(),
          updatedAt: new Date(),
          slug: docId,
          // Find a product with this category to use as a featured image
          imageUrl: categoryData.imageUrl || findCategoryImage(products, categoryId)
        };
        
        // Save the category document
        await setDoc(doc(db, 'categories', docId), categoryDoc);
        savedCategories.push({
          id: docId,
          name: categoryData.name,
          count: categoryData.count
        });
      }
      
      setResult({
        success: true,
        message: `Successfully extracted and saved ${savedCategories.length} categories!`,
        categories: savedCategories
      });
      
    } catch (error) {
      console.error('Error extracting categories:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  /**
   * Finds an image for a category from products
   */
  function findCategoryImage(products, categoryId) {
    // Find a product in this category that has an image
    const productWithImage = products.find(product => {
      if (typeof product.category === 'string') {
        return product.category === categoryId && product.imageUrl;
      }
      else if (product.category && product.category.id) {
        return product.category.id === categoryId && product.imageUrl;
      }
      return false;
    });
    
    return productWithImage?.imageUrl || 'https://via.placeholder.com/400x300?text=Category';
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
      <Typography level="h3" sx={{ mb: 2 }}>
        Category Extraction Tool
      </Typography>
      
      <Typography sx={{ mb: 3 }}>
        This tool will scan all products in your database, extract unique categories, and save them to the categories collection.
      </Typography>
      
      <Button 
        color="success" 
        size="lg" 
        variant="solid" 
        onClick={extractAndSaveCategories}
        disabled={isExtracting}
        startDecorator={isExtracting ? <CircularProgress size="sm" /> : null}
        sx={{ mb: 3 }}
      >
        {isExtracting ? 'Extracting Categories...' : 'Extract Categories'}
      </Button>
      
      {error && (
        <Alert color="danger" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {result.success && (
        <Box>
          <Alert color="success" sx={{ mb: 3 }}>
            {result.message}
          </Alert>
          
          <Typography level="h4" sx={{ mb: 2, mt: 4 }}>
            Extracted Categories ({result.categories.length})
          </Typography>
          
          <Box sx={{ 
            maxHeight: 300, 
            overflowY: 'auto', 
            border: '1px solid', 
            borderColor: 'neutral.200',
            borderRadius: 'md',
            p: 2
          }}>
            {result.categories.map(category => (
              <Box 
                key={category.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  p: 1,
                  borderBottom: '1px solid',
                  borderColor: 'neutral.100'
                }}
              >
                <Typography>{category.name}</Typography>
                <Typography color="neutral.500">{category.count} products</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CategoryExtractorTool;