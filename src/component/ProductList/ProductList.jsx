import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Card, CircularProgress, Link, Typography, Stack } from '@mui/joy';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import FilterSidebar from './FilterSidebar';
import MobileFilterDrawer from './MobileFilterDrawer';
import ProductControls from './ProductControls';
import ActiveFilters from './ActiveFilters';
import ProductGrid from './ProductGrid';
import PaginationControls from './PaginationControls';

export default function ProductList({ initialCategory = 'All', specialFilter = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  // Extract search parameters
  const urlCategory = searchParams.get('category');
  const urlSubCategory = searchParams.get('subCategory');
  const urlSearch = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState(urlSubCategory || 'All');
  const [searchTerm, setSearchTerm] = useState(urlSearch || '');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  const productsPerPage = 20;
  const paginationRef = useRef({ snapshots: [null], currentCursor: null });

  // Update URL when filters change (skip for special filter views)
  const updateURL = useCallback(() => {
    // Don't update URL for special filter views
    if (specialFilter) return;
    
    const params = new URLSearchParams();
    
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedSubCategory !== 'All') params.set('subCategory', selectedSubCategory);
    if (searchTerm) params.set('search', searchTerm);
    
    const queryString = params.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ''}`, { replace: true });
  }, [selectedCategory, selectedSubCategory, searchTerm, navigate, location.pathname, specialFilter]);

  // Update state when URL parameters change (skip for special filter views)
  useEffect(() => {
    // Don't update from URL for special filter views
    if (specialFilter) return;
    
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSubCategory) setSelectedSubCategory(urlSubCategory);
    if (urlSearch) setSearchTerm(urlSearch);
    
    // Reset pagination when URL changes
    if (urlCategory || urlSubCategory || urlSearch) {
      resetPagination();
    }
  }, [urlCategory, urlSubCategory, urlSearch, specialFilter]);

  // Fetch categories and brands on initial load
  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        setLoading(true);
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        const uniqueCategories = new Set();
        const uniqueBrands = new Set();

        snapshot.docs.forEach((doc) => {
          const product = doc.data();
          if (product.category) uniqueCategories.add(product.category);
          if (product.brand) uniqueBrands.add(product.brand);
        });

        setCategories(['All', ...Array.from(uniqueCategories).sort()]);
        setBrands(Array.from(uniqueBrands).sort());
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
        setLoading(false);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  // Add special filter to active filters if applicable
  useEffect(() => {
    if (specialFilter) {
      const specialFilterName = {
        'newArrival': 'New Arrivals',
        'bestSelling': 'Bestsellers',
        'featured': 'Featured'
      }[specialFilter.field] || specialFilter.field;
      
      setActiveFilters(prev => {
        // Check if the special filter is already in the active filters
        if (!prev.find(filter => filter.type === 'special')) {
          return [...prev, { type: 'special', value: specialFilterName }];
        }
        return prev;
      });
    }
  }, [specialFilter]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategory === 'All') {
        setSubCategories(['All']);
        return;
      }

      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('category', '==', selectedCategory));
        const snapshot = await getDocs(q);
        const uniqueSubCategories = new Set();

        snapshot.docs.forEach((doc) => {
          const product = doc.data();
          if (product.subCategory) uniqueSubCategories.add(product.subCategory);
        });

        setSubCategories(['All', ...Array.from(uniqueSubCategories).sort()]);
        if (!urlSubCategory) setSelectedSubCategory('All');
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      }
    };

    fetchSubCategories();
  }, [selectedCategory, urlSubCategory]);

  // Reset pagination and update filters when filter criteria change
  useEffect(() => {
    const handler = setTimeout(() => {
      resetPagination();
      updateActiveFilters();
      updateURL();
    }, 500); // Debounce updates
    
    return () => clearTimeout(handler);
  }, [selectedCategory, selectedSubCategory, selectedBrands, priceRange, sortOrder, searchTerm, updateURL]);

  const updateActiveFilters = () => {
    const filters = [];

    if (selectedCategory !== 'All') filters.push({ type: 'category', value: selectedCategory });
    if (selectedSubCategory !== 'All') filters.push({ type: 'subcategory', value: selectedSubCategory });
    selectedBrands.forEach((brand) => filters.push({ type: 'brand', value: brand }));
    if (priceRange[0] > 0) filters.push({ type: 'minPrice', value: `$${priceRange[0]}` });
    if (priceRange[1] < 10000) filters.push({ type: 'maxPrice', value: `$${priceRange[1]}` });
    if (searchTerm) filters.push({ type: 'search', value: searchTerm });
    
    // Add special filter if applicable
    if (specialFilter) {
      const specialFilterName = {
        'newArrival': 'New Arrivals',
        'bestSelling': 'Bestsellers',
        'featured': 'Featured'
      }[specialFilter.field] || specialFilter.field;
      
      filters.push({ type: 'special', value: specialFilterName });
    }

    setActiveFilters(filters);
  };

  const resetPagination = () => {
    setCurrentPage(1);
    paginationRef.current = { snapshots: [null], currentCursor: null };
    setHasMore(true);
    setProducts([]);
    fetchProducts(null, true);
  };

  const fetchProducts = async (startDoc = null, isFirstPage = false) => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'products');
      
      // Determine sort field and direction
      const [field, direction] = sortOrder.split('-');
      const sortDirection = direction === 'asc' ? 'asc' : 'desc';
      
      // Build query constraints array
      let queryConstraints = [
        orderBy(field, sortDirection),
        limit(productsPerPage)
      ];
      
      // Add category and subcategory filters
      if (selectedCategory !== 'All') {
        queryConstraints.unshift(where('category', '==', selectedCategory));
        
        if (selectedSubCategory !== 'All') {
          queryConstraints.unshift(where('subCategory', '==', selectedSubCategory));
        }
      }
      
      // Add brand filter if only one brand is selected
      if (selectedBrands.length === 1) {
        queryConstraints.unshift(where('brand', '==', selectedBrands[0]));
      }
      
      // Add special filter if provided
      // Add special filter if provided
if (specialFilter) {
  queryConstraints.push(where(specialFilter.field, '==', specialFilter.value));
}
      
      // Add pagination
      if (startDoc) {
        queryConstraints.push(startAfter(startDoc));
      }
      
      // Create and execute query
      const q = query(productsRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setHasMore(false);
        if (isFirstPage) setProducts([]);
        setLoading(false);
        return;
      }

      // Store last document for pagination
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      paginationRef.current.currentCursor = lastDoc;
      
      // Map documents to products
      let fetchedProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Apply in-memory filters for search, multiple brands, and price range
      fetchedProducts = fetchedProducts.filter(product => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = (product.title && product.title.toLowerCase().includes(searchLower)) ||
                               (product.description && product.description.toLowerCase().includes(searchLower));
          if (!matchesSearch) return false;
        }
        
        // Multiple brands filter
        if (selectedBrands.length > 1 && !selectedBrands.includes(product.brand)) {
          return false;
        }
        
        // Price range filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }
        
        return true;
      });

      setProducts(fetchedProducts);
      console.log(fetchedProducts);
      setHasMore(fetchedProducts.length >= productsPerPage);

      // Update pagination snapshots
      if (!isFirstPage && currentPage >= paginationRef.current.snapshots.length) {
        paginationRef.current.snapshots.push(lastDoc);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadNextPage = () => {
    if (!hasMore || loading) return;
    const lastDoc = paginationRef.current.currentCursor;
    if (lastDoc) {
      setCurrentPage((prevPage) => prevPage + 1);
      fetchProducts(lastDoc, false);
    } else {
      console.error('Cannot load next page: No cursor available');
    }
  };

  const loadPrevPage = () => {
    if (currentPage <= 1 || loading) return;
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    const targetDoc = paginationRef.current.snapshots[newPage - 1];
    fetchProducts(targetDoc, newPage === 1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory('All'); // Reset subcategory when category changes
  };
  
  const handleSubCategoryChange = (subCategory) => setSelectedSubCategory(subCategory);
  const handlePriceRangeChange = (event, newValue) => setPriceRange(newValue);
  const handleSortChange = (event, newValue) => newValue && setSortOrder(newValue);
  const handleViewModeChange = (mode) => setViewMode(mode);
  
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    // Reset to first page when search changes
    setCurrentPage(1);
  };
  
  const toggleBrandSelection = (brand) => {
    setSelectedBrands((prev) => 
      prev.includes(brand) 
        ? prev.filter((b) => b !== brand) 
        : [...prev, brand]
    );
  };
  
  const removeFilter = (filterType, filterValue) => {
    if (filterType === 'category') setSelectedCategory('All');
    else if (filterType === 'subcategory') setSelectedSubCategory('All');
    else if (filterType === 'brand') setSelectedBrands((prev) => prev.filter((brand) => brand !== filterValue));
    else if (filterType === 'minPrice') setPriceRange([0, priceRange[1]]);
    else if (filterType === 'maxPrice') setPriceRange([priceRange[0], 10000]);
    else if (filterType === 'search') setSearchTerm('');
    // Special filters can't be removed individually as they're inherent to the page
  };
  
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setSortOrder('price-asc');
    setSearchTerm('');
    // We don't clear the specialFilter as it's inherent to the page
  };

  // Modify breadcrumbs to show the special filter type if applicable
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      <Link key="home" underline="hover" color="neutral" href="/">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
          Home
        </Box>
      </Link>,
      <Link key="products" underline="hover" color="neutral" href="/products">
        Products
      </Link>
    ];

    // Add special filter breadcrumb if applicable
    if (specialFilter) {
      const specialFilterName = {
        'newArrival': 'New Arrivals',
        'bestSelling': 'Bestsellers',
        'featured': 'Featured Products'
      }[specialFilter.field] || specialFilter.field;
      
      breadcrumbs.push(
        <Typography key="special" color="primary">{specialFilterName}</Typography>
      );
    }

    // Add category breadcrumb if selected
    if (selectedCategory !== 'All') {
      breadcrumbs.push(
        <Link 
          key="category"
          underline="hover" 
          color="neutral" 
          href={`/products?category=${selectedCategory}`}
        >
          {selectedCategory}
        </Link>
      );
    }

    // Add subcategory breadcrumb if selected
    if (selectedSubCategory !== 'All') {
      breadcrumbs.push(
        <Typography key="subcategory" color="primary">{selectedSubCategory}</Typography>
      );
    }

    // Add search breadcrumb if applicable
    if (searchTerm) {
      breadcrumbs.push(
        <React.Fragment key="search">
          <SearchIcon fontSize="small" />
          <Typography color="primary">"{searchTerm}"</Typography>
        </React.Fragment>
      );
    }

    return breadcrumbs;
  };

  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      {/* Desktop Sidebar Filter */}
      <FilterSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        subCategories={subCategories}
        selectedSubCategory={selectedSubCategory}
        handleSubCategoryChange={handleSubCategoryChange}
        priceRange={priceRange}
        handlePriceRangeChange={handlePriceRangeChange}
        brands={brands}
        selectedBrands={selectedBrands}
        toggleBrandSelection={toggleBrandSelection}
        clearAllFilters={clearAllFilters}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
      />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        subCategories={subCategories}
        selectedSubCategory={selectedSubCategory}
        handleSubCategoryChange={handleSubCategoryChange}
        priceRange={priceRange}
        handlePriceRangeChange={handlePriceRangeChange}
        brands={brands}
        selectedBrands={selectedBrands}
        toggleBrandSelection={toggleBrandSelection}
        clearAllFilters={clearAllFilters}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
      />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 2, flexBasis: 0 }}>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} sx={{ mb: 2 }}>
          {generateBreadcrumbs()}
        </Breadcrumbs>
        
        {/* Sort Controls */}
        <ProductControls 
          sortOrder={sortOrder} 
          handleSortChange={handleSortChange} 
          viewMode={viewMode} 
          handleViewModeChange={handleViewModeChange} 
          setShowFilters={setShowFilters} 
          totalProducts={products.length}
        />
        
        {/* Active Filters Chips */}
        <ActiveFilters 
          activeFilters={activeFilters} 
          removeFilter={removeFilter} 
          clearAllFilters={clearAllFilters} 
        />

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography color="danger">{error}</Typography>
            <Button 
              variant="soft" 
              color="primary" 
              onClick={() => {
                setError(null);
                resetPagination();
              }}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        )}

        {/* Search Results Header */}
        {searchTerm && !loading && !error && (
          <Box sx={{ mb: 2 }}>
            <Typography level="h5">
              Search results for: "{searchTerm}"
            </Typography>
          </Box>
        )}

        {/* No Results State */}
        {!loading && !error && products.length === 0 && (
          <Card variant="outlined" sx={{ textAlign: 'center', p: 4, my: 4 }}>
            <Typography level="h4">No products found</Typography>
            <Typography sx={{ mt: 1 }}>
              {searchTerm 
                ? `We couldn't find any products matching "${searchTerm}".` 
                : `Try adjusting your filters to find what you're looking for.`}
            </Typography>
            <Button variant="solid" color="primary" onClick={clearAllFilters} sx={{ mt: 2 }}>
              Clear All Filters
            </Button>
          </Card>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <ProductGrid products={products} viewMode={viewMode} />
        )}
        
        {/* Pagination Controls */}
        {!loading && !error && products.length > 0 && (
          <PaginationControls 
            currentPage={currentPage} 
            hasMore={hasMore} 
            loading={loading} 
            loadPrevPage={loadPrevPage} 
            loadNextPage={loadNextPage} 
          />
        )}
      </Box>
    </Stack>
  );
}