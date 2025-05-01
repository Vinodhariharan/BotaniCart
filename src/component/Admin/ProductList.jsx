import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../auth'; // Adjust the path to your firebase config file
import { 
  Sheet,
  Table,
  Typography,
  Button,
  Input,
  Box,
  Checkbox,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Select,
  Option,
  Slider
} from '@mui/joy';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import { Filter } from '@mui/icons-material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productFlags, setProductFlags] = useState({
    featured: false,
    popular: false,
    newArrival: false
  });
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read all filters from URL params
  const getFiltersFromParams = () => {
    return {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : maxPrice,
      featured: searchParams.get('featured') === 'true',
      popular: searchParams.get('popular') === 'true',
      newArrival: searchParams.get('newArrival') === 'true',
    };
  };

  // Set initial filter states from URL
  const currentFilters = getFiltersFromParams();
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category);
  const [statusFilters, setStatusFilters] = useState({
    featured: currentFilters.featured,
    popular: currentFilters.popular,
    newArrival: currentFilters.newArrival
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setAllProducts(productsData || []);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        // Find max price for slider
        const highestPrice = Math.max(...productsData.map(p => parseFloat(p.price) || 0), 1000);
        setMaxPrice(Math.ceil(highestPrice / 100) * 100); // Round up to nearest 100
        
        // Set initial price range from URL or defaults
        setPriceRange([
          currentFilters.minPrice, 
          currentFilters.maxPrice > highestPrice ? highestPrice : currentFilters.maxPrice
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Update URL params when filters change
  const updateUrlParams = (newFilters) => {
    const updatedParams = new URLSearchParams();
    
    if (newFilters.search) updatedParams.set('search', newFilters.search);
    if (newFilters.category) updatedParams.set('category', newFilters.category);
    if (newFilters.minPrice > 0) updatedParams.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice < maxPrice) updatedParams.set('maxPrice', newFilters.maxPrice);
    if (newFilters.featured) updatedParams.set('featured', 'true');
    if (newFilters.popular) updatedParams.set('popular', 'true');
    if (newFilters.newArrival) updatedParams.set('newArrival', 'true');
    
    setSearchParams(updatedParams);
  };

  // Apply all filters
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    const filters = getFiltersFromParams();
    
    const filtered = allProducts.filter(product => {
      // Text search filter
      const matchesSearch = !filters.search || 
        product.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category?.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      // Category filter
      const matchesCategory = !filters.category || product.category === filters.category;
      
      // Price range filter
      const price = parseFloat(product.price) || 0;
      const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
      
      // Status filters
      const matchesFeatured = !filters.featured || product.featured;
      const matchesPopular = !filters.popular || product.popular;
      const matchesNewArrival = !filters.newArrival || product.newArrival;
      
      return matchesSearch && matchesCategory && matchesPrice && 
             matchesFeatured && matchesPopular && matchesNewArrival;
    });
    
    setProducts(filtered);
  }, [allProducts, searchParams]);

  const handleApplyFilters = () => {
    updateUrlParams({
      search: searchTerm,
      category: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      featured: statusFilters.featured,
      popular: statusFilters.popular,
      newArrival: statusFilters.newArrival
    });
    
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange([0, maxPrice]);
    setStatusFilters({
      featured: false,
      popular: false,
      newArrival: false
    });
    
    setSearchParams(new URLSearchParams());
  };

  const handleEdit = (id) => {
    navigate(`/admin/update-product/${id}`);
  };

  const openFlagsModal = (product) => {
    setSelectedProduct(product);
    setProductFlags({
      featured: product.featured || false,
      popular: product.popular || false,
      newArrival: product.newArrival || false
    });
    setShowModal(true);
  };

  const handleSaveFlags = async () => {
    if (!selectedProduct) return;
    
    try {
      const productRef = doc(db, 'products', selectedProduct.id);
      await updateDoc(productRef, {
        featured: productFlags.featured,
        popular: productFlags.popular,
        newArrival: productFlags.newArrival,
      });
      
      // Update local state to reflect changes
      const updatedProducts = allProducts.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...productFlags } 
          : p
      );
      
      setAllProducts(updatedProducts);
      
      // Re-apply filters to updated product list
      const filters = getFiltersFromParams();
      setProducts(updatedProducts.filter(product => {
        // Reapply all the filters
        // Text search filter
        const matchesSearch = !filters.search || 
          product.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.category?.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.description?.toLowerCase().includes(filters.search.toLowerCase());
        
        // Category filter
        const matchesCategory = !filters.category || product.category === filters.category;
        
        // Price range filter
        const price = parseFloat(product.price) || 0;
        const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
        
        // Status filters
        const matchesFeatured = !filters.featured || product.featured;
        const matchesPopular = !filters.popular || product.popular;
        const matchesNewArrival = !filters.newArrival || product.newArrival;
        
        return matchesSearch && matchesCategory && matchesPrice && 
              matchesFeatured && matchesPopular && matchesNewArrival;
      }));
      
      setShowModal(false);
    } catch (error) {
      console.error("Error updating product flags:", error);
    }
  };

  // Handle search input with URL params
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const currentParams = getFiltersFromParams();
    if (value) {
      currentParams.search = value;
    } else {
      delete currentParams.search;
    }
    
    updateUrlParams(currentParams);
  };

  // Get active filter count (excluding search)
  const getActiveFilterCount = () => {
    const filters = getFiltersFromParams();
    let count = 0;
    
    if (filters.category) count++;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice < maxPrice) count++;
    if (filters.featured) count++;
    if (filters.popular) count++;
    if (filters.newArrival) count++;
    
    return count;
  };

  return (
    <Sheet 
      variant="outlined" 
      sx={{ 
        width: '100%', 
        p: 4,
        borderRadius: 'md',
        boxShadow: 'sm'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography level="h4">Product List</Typography>
        <Button 
          onClick={() => navigate('/admin/add-product')} 
          size="md"
          color="primary"
        >
          Add New Product
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          <Input
            placeholder="Search products by title, category or description..."
            value={searchTerm}
            onChange={handleSearch}
            startDecorator={<SearchIcon />}
            size="lg"
            sx={{ width: '100%' }}
          />
        </Box>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<FilterAltIcon />}
          onClick={() => setShowFilters(!showFilters)}
          endDecorator={getActiveFilterCount() > 0 && (
            <Chip size="sm" variant="solid" color="primary">
              {getActiveFilterCount()}
            </Chip>
          )}
        >
          Filters
        </Button>
      </Box>
      
      {/* Advanced Filters Panel */}
      {showFilters && (
        <Sheet 
          variant="outlined" 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 'md',
            bgcolor: 'background.level1' 
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography level="title-md">Advanced Filters</Typography>
            <IconButton size="sm" variant="plain" onClick={() => setShowFilters(false)}>
              <ClearIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Category Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <FormLabel>Category</FormLabel>
              <Select 
                placeholder="All Categories" 
                value={selectedCategory}
                onChange={(_, val) => setSelectedCategory(val)}
                sx={{ width: '100%' }}
              >
                <Option value="">All Categories</Option>
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </FormControl>
            
            {/* Price Range Filter */}
            <FormControl sx={{ minWidth: 300, flexGrow: 1 }}>
              <FormLabel>Price Range (${priceRange[0]} - ${priceRange[1]})</FormLabel>
              <Slider
                value={priceRange}
                onChange={(_, val) => setPriceRange(val)}
                min={0}
                max={maxPrice}
                step={10}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
              />
            </FormControl>
          </Box>
          
          {/* Status Filters */}
          <Typography level="title-sm" sx={{ mt: 3, mb: 2 }}>Product Status</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              variant={statusFilters.featured ? "solid" : "soft"}
              color={statusFilters.featured ? "warning" : "neutral"}
              startDecorator={<StarIcon fontSize="small" />}
              onClick={() => setStatusFilters({...statusFilters, featured: !statusFilters.featured})}
            >
              Featured
            </Chip>
            <Chip
              variant={statusFilters.popular ? "solid" : "soft"}
              color={statusFilters.popular ? "success" : "neutral"}
              startDecorator={<TrendingUpIcon fontSize="small" />}
              onClick={() => setStatusFilters({...statusFilters, popular: !statusFilters.popular})}
            >
              Popular
            </Chip>
            <Chip
              variant={statusFilters.newArrival ? "solid" : "soft"}
              color={statusFilters.newArrival ? "primary" : "neutral"}
              startDecorator={<NewReleasesIcon fontSize="small" />}
              onClick={() => setStatusFilters({...statusFilters, newArrival: !statusFilters.newArrival})}
            >
              New Arrival
            </Chip>
          </Box>
          
          {/* Filter Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="plain" 
              color="neutral" 
              onClick={handleClearFilters}
            >
              Clear All
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </Box>
        </Sheet>
      )}
      
      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {currentFilters.category && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="primary"
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setSelectedCategory('');
                const params = new URLSearchParams(searchParams);
                params.delete('category');
                setSearchParams(params);
              }}
            >
              Category: {currentFilters.category}
            </Chip>
          )}
          
          {(currentFilters.minPrice > 0 || currentFilters.maxPrice < maxPrice) && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="primary"
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setPriceRange([0, maxPrice]);
                const params = new URLSearchParams(searchParams);
                params.delete('minPrice');
                params.delete('maxPrice');
                setSearchParams(params);
              }}
            >
              Price: ${currentFilters.minPrice} - ${currentFilters.maxPrice}
            </Chip>
          )}
          
          {currentFilters.featured && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="warning"
              startDecorator={<StarIcon fontSize="small" />}
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setStatusFilters({...statusFilters, featured: false});
                const params = new URLSearchParams(searchParams);
                params.delete('featured');
                setSearchParams(params);
              }}
            >
              Featured
            </Chip>
          )}
          
          {currentFilters.popular && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="success"
              startDecorator={<TrendingUpIcon fontSize="small" />}
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setStatusFilters({...statusFilters, popular: false});
                const params = new URLSearchParams(searchParams);
                params.delete('popular');
                setSearchParams(params);
              }}
            >
              Popular
            </Chip>
          )}
          
          {currentFilters.newArrival && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="primary"
              startDecorator={<NewReleasesIcon fontSize="small" />}
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setStatusFilters({...statusFilters, newArrival: false});
                const params = new URLSearchParams(searchParams);
                params.delete('newArrival');
                setSearchParams(params);
              }}
            >
              New Arrival
            </Chip>
          )}
          
          {getActiveFilterCount() > 0 && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="danger"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Chip>
          )}
        </Box>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading products...</Typography>
        </Box>
      ) : products.length > 0 ? (
        <Table 
          borderAxis="both"
          stickyHeader
          hoverRow
          sx={{ 
            '& thead th': { 
              bgcolor: 'background.level1',
              fontWeight: 'bold' 
            } 
          }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <Typography fontWeight="md">{product.title}</Typography>
                </td>
                <td>{product.category}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.featured && (
                      <Chip 
                        color="warning" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<StarIcon fontSize="small" />}
                      >
                        Featured
                      </Chip>
                    )}
                    {product.popular && (
                      <Chip 
                        color="success" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<TrendingUpIcon fontSize="small" />}
                      >
                        Popular
                      </Chip>
                    )}
                    {product.newArrival && (
                      <Chip 
                        color="primary" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<NewReleasesIcon fontSize="small" />}
                      >
                        New
                      </Chip>
                    )}
                    {!product.featured && !product.popular && !product.newArrival && (
                      <Chip 
                        color="neutral" 
                        variant="soft" 
                        size="sm"
                      >
                        Standard
                      </Chip>
                    )}
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit product details">
                      <IconButton 
                        variant="outlined" 
                        color="neutral" 
                        onClick={() => handleEdit(product.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Set product status flags">
                      <IconButton 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => openFlagsModal(product)}
                      >
                        <Filter />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>No products found matching your criteria. Try adjusting your filters.</Typography>
        </Box>
      )}
      
      {/* Product Flags Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalDialog
          aria-labelledby="product-flags-modal"
          size="md"
        >
          <ModalClose />
          <Typography id="product-flags-modal" level="h4">
            Product Visibility Settings
          </Typography>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            {selectedProduct?.title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ my: 2 }}>
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={productFlags.featured} 
                label="Featured"
                onChange={(e) => setProductFlags({...productFlags, featured: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  Featured products appear in featured section on home page
                </Typography>
              </FormLabel>
            </FormControl>
            
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={productFlags.popular} 
                label="Popular"
                onChange={(e) => setProductFlags({...productFlags, popular: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  Popular products appear in trending section and get priority in search
                </Typography>
              </FormLabel>
            </FormControl>
            
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={productFlags.newArrival} 
                label="New Arrival"
                onChange={(e) => setProductFlags({...productFlags, newArrival: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  New arrivals appear in the new arrivals section
                </Typography>
              </FormLabel>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFlags}>
              Save Changes
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
};

export default ProductList;