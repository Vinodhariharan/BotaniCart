import React, { useState, useEffect, useRef } from 'react';
import { Box, Input, IconButton, List, ListItem, Typography, Chip } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useNavigate } from 'react-router-dom';

const ProductSearch = ({ onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        const uniqueCategories = new Set();
        const uniqueSubCategories = new Set();
        
        snapshot.docs.forEach((doc) => {
          const product = doc.data();
          if (product.category) uniqueCategories.add(product.category);
          if (product.subCategory) uniqueSubCategories.add(product.subCategory);
        });
        
        setCategories(Array.from(uniqueCategories));
        setSubCategories(Array.from(uniqueSubCategories));
      } catch (err) {
        console.error('Error fetching categories and subcategories:', err);
      }
    };
    
    fetchCategoriesAndSubcategories();
  }, []);

  // Optimized search function with better error handling
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    setShowResults(true);
    
    try {
      const productsRef = collection(db, 'products');
      const searchTermLower = searchTerm.toLowerCase();
      
      // First, check if search term matches any category or subcategory exactly
      const categoryMatch = categories.find(
        cat => cat.toLowerCase() === searchTermLower
      );
      
      const subCategoryMatch = subCategories.find(
        subCat => subCat.toLowerCase() === searchTermLower
      );
      
      let results = [];
      
      // If category or subcategory matches, prioritize those results
      if (categoryMatch) {
        const catQuery = query(
          productsRef, 
          where('category', '==', categoryMatch),
          orderBy('price'),
          limit(5)
        );
        const catSnapshot = await getDocs(catQuery);
        results = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'product' }));
      } else if (subCategoryMatch) {
        const subCatQuery = query(
          productsRef, 
          where('subCategory', '==', subCategoryMatch),
          orderBy('price'),
          limit(5)
        );
        const subCatSnapshot = await getDocs(subCatQuery);
        results = subCatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'product' }));
      }
      
      // Add title search with case-insensitive matching
      const titleQuery = query(
        productsRef,
        orderBy('title'),
        limit(10)
      );
      const titleSnapshot = await getDocs(titleQuery);
      const titleResults = titleSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data(), type: 'product' }))
        .filter(product => 
          product.title && 
          product.title.toLowerCase().includes(searchTermLower)
        );
      
      // Add matching categories and subcategories to results
      const matchingCategories = categories
        .filter(cat => cat.toLowerCase().includes(searchTermLower))
        .map(cat => ({ title: cat, type: 'category' }));
      
      const matchingSubCategories = subCategories
        .filter(subCat => subCat.toLowerCase().includes(searchTermLower))
        .map(subCat => ({ title: subCat, type: 'subCategory' }));
      
      // Combine all results, removing duplicates
      const allResults = [
        ...results,
        ...titleResults,
        ...matchingCategories.slice(0, 3),
        ...matchingSubCategories.slice(0, 3)
      ];
      
      // Remove duplicates based on id for products
      const uniqueResults = allResults.filter((item, index, self) => 
        item.type !== 'product' || 
        index === self.findIndex(t => t.id === item.id)
      );
      
      setSearchResults(uniqueResults.slice(0, 10));
    } catch (err) {
      console.error('Error searching products:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Improved debounce search with cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchTerm('');
    
    if (result.type === 'category') {
      navigate(`/products?category=${encodeURIComponent(result.title)}`);
    } else if (result.type === 'subCategory') {
      navigate(`/products?subCategory=${encodeURIComponent(result.title)}`);
    } else if (result.type === 'product') {
      // If onProductSelect prop exists, use it for better integration with other components
      if (onProductSelect && typeof onProductSelect === 'function') {
        onProductSelect(result);
      } else {
        navigate(`/product/${result.id}`);
      }
    }
  };

  const handleClickAway = () => {
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: { xs: '100%', sm: '300px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Input
            fullWidth
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowResults(true);
            }}
            startDecorator={<SearchIcon />}
            endDecorator={
              searchTerm && (
                <IconButton 
                  size="sm" 
                  variant="plain" 
                  color="neutral" 
                  onClick={handleClearSearch}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )
            }
            ref={searchRef}
            sx={{ 
              borderRadius: '20px',
              fontFamily: 'League Spartan, sans-serif'
            }}
          />
        </Box>
        
        {showResults && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              zIndex: 9999,
              mt: 0.5,
              bgcolor: 'background.surface',
              borderRadius: 'md',
              boxShadow: 'md',
              overflow: 'hidden',
              maxHeight: '400px',
              overflowY: 'auto'
            }}
          >
            {isSearching ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography level="body-sm">Searching...</Typography>
              </Box>
            ) : searchResults.length > 0 ? (
              <List size="sm" sx={{ py: 0 }}>
                {searchResults.map((result, index) => (
                  <ListItem 
                    key={result.id || `${result.type}-${index}`}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleResultClick(result)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {result.type === 'product' ? (
                        <>
                          <Box sx={{ mr: 1, width: 40, height: 40, overflow: 'hidden', borderRadius: 'sm' }}>
                            {result.imageURL ? (
                              <img 
                                src={result.imageURL} 
                                alt={result.title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder-image.jpg';
                                }}
                              />
                            ) : (
                              <Box sx={{ width: '100%', height: '100%', bgcolor: 'action.disabled' }} />
                            )}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography level="body-sm">{result.title}</Typography>
                            <Typography level="body-xs" color="text.secondary">
                              ${parseFloat(result.price).toFixed(2)}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Chip 
                            size="sm" 
                            color={result.type === 'category' ? 'primary' : 'success'}
                            sx={{ mr: 1 }}
                          >
                            {result.type === 'category' ? 'Category' : 'SubCategory'}
                          </Chip>
                          <Typography level="body-sm">{result.title}</Typography>
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                ))}
                {searchTerm.length >= 3 && (
                  <ListItem 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      justifyContent: 'center',
                      color: 'primary.main'
                    }}
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                      setShowResults(false);
                      setSearchTerm('');
                    }}
                  >
                    <Typography level="body-sm">See all results for "{searchTerm}"</Typography>
                  </ListItem>
                )}
              </List>
            ) : searchTerm ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography level="body-sm">No results found</Typography>
              </Box>
            ) : null}
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default ProductSearch;