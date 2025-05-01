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

  // Comprehensive search function that covers title, description, and categories
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
      
      // Check for direct category/subcategory matches
      const categoryMatch = categories.find(
        cat => cat.toLowerCase() === searchTermLower
      );
      
      const subCategoryMatch = subCategories.find(
        subCat => subCat.toLowerCase() === searchTermLower
      );
      
      let results = [];
      
      // If direct category match exists, get those products first
      if (categoryMatch) {
        const catQuery = query(
          productsRef, 
          where('category', '==', categoryMatch),
          orderBy('price'),
          limit(5)
        );
        const catSnapshot = await getDocs(catQuery);
        results = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'product', matchType: 'category' }));
      } 
      
      // If direct subcategory match exists, get those products
      if (subCategoryMatch) {
        const subCatQuery = query(
          productsRef, 
          where('subCategory', '==', subCategoryMatch),
          orderBy('price'),
          limit(5)
        );
        const subCatSnapshot = await getDocs(subCatQuery);
        const subCatResults = subCatSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(), 
          type: 'product',
          matchType: 'subCategory'
        }));
        
        results = [...results, ...subCatResults];
      }
      
      // Get all products to search through (using limit to prevent performance issues)
      // In a production environment, you'd implement server-side text search
      const allProductsQuery = query(
        productsRef,
        orderBy('createdAt', 'desc'), // Assuming you have a createdAt field
        limit(100) // Limiting to prevent performance issues
      );
      
      const allProductsSnapshot = await getDocs(allProductsQuery);
      const allProducts = allProductsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Search through titles
      const titleResults = allProducts
        .filter(product => 
          product.title && 
          product.title.toLowerCase().includes(searchTermLower)
        )
        .map(product => ({
          ...product,
          type: 'product',
          matchType: 'title'
        }));
      
      // Search through descriptions
      const descriptionResults = allProducts
        .filter(product => 
          product.description && 
          product.description.toLowerCase().includes(searchTermLower)
        )
        .map(product => ({
          ...product,
          type: 'product',
          matchType: 'description'
        }));
      
      // Add matching categories and subcategories to results
      const matchingCategories = categories
        .filter(cat => cat.toLowerCase().includes(searchTermLower))
        .map(cat => ({ title: cat, type: 'category' }));
      
      const matchingSubCategories = subCategories
        .filter(subCat => subCat.toLowerCase().includes(searchTermLower))
        .map(subCat => ({ title: subCat, type: 'subCategory' }));
      
      // Combine all results in a prioritized order
      const allResults = [
        ...results,                         // Exact category/subcategory matches
        ...titleResults,                    // Title matches
        ...descriptionResults,              // Description matches
        ...matchingCategories.slice(0, 3),  // Category name matches
        ...matchingSubCategories.slice(0, 3) // Subcategory name matches
      ];
      
      // Remove duplicates based on id for products
      const uniqueResults = allResults.filter((item, index, self) => {
        if (item.type !== 'product') return true;
        return index === self.findIndex(t => t.type === 'product' && t.id === item.id);
      });
      
      // Sort products to prioritize title matches over description matches
      const sortedResults = uniqueResults.sort((a, b) => {
        // First prioritize product types
        if (a.type === 'product' && b.type !== 'product') return -1;
        if (a.type !== 'product' && b.type === 'product') return 1;
        
        // For products, prioritize by match type
        if (a.type === 'product' && b.type === 'product') {
          const matchPriority = {
            'title': 1,
            'category': 2,
            'subCategory': 3,
            'description': 4
          };
          return (matchPriority[a.matchType] || 5) - (matchPriority[b.matchType] || 5);
        }
        
        // For non-products, prioritize categories over subcategories
        if (a.type === 'category' && b.type === 'subCategory') return -1;
        if (a.type === 'subCategory' && b.type === 'category') return 1;
        
        return 0;
      });
      
      setSearchResults(sortedResults.slice(0, 10));
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

  // Helper function to highlight matching text
  const highlightMatch = (text, searchTerm) => {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, index) => 
          regex.test(part) ? 
            <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }} key={index}>
              {part}
            </Box> : 
            part
        )}
      </>
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: { xs: '100%', sm: '300px' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Input
            fullWidth
            placeholder="Search products, descriptions, categories..."
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
                            <Typography level="body-sm">
                              {highlightMatch(result.title, searchTerm)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography level="body-xs" color="text.secondary">
                                ${parseFloat(result.price).toFixed(2)}
                              </Typography>
                              
                              {result.matchType && (
                                <Chip 
                                  size="sm" 
                                  variant="soft"
                                  color={
                                    result.matchType === 'title' ? 'primary' : 
                                    result.matchType === 'description' ? 'warning' : 
                                    'success'
                                  }
                                  sx={{ 
                                    height: '16px', 
                                    fontSize: '0.6rem', 
                                    px: 0.5 
                                  }}
                                >
                                  {result.matchType}
                                </Chip>
                              )}
                            </Box>
                            
                            {result.matchType === 'description' && result.description && (
                              <Typography 
                                level="body-xs" 
                                color="text.tertiary"
                                sx={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {highlightMatch(result.description.substring(0, 50) + '...', searchTerm)}
                              </Typography>
                            )}
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
                          <Typography level="body-sm">
                            {highlightMatch(result.title, searchTerm)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                ))}
                {searchTerm.length >= 2 && (
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