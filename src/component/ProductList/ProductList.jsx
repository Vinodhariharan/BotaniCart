// ProductList.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, Breadcrumbs, Button, Card, CircularProgress, Grid, Link, Typography, Stack } from '@mui/joy';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ProductCard from '../AllComp/CardComponent';
import FilterSidebar from './FilterSidebar';
import MobileFilterDrawer from './MobileFilterDrawer';
import ProductControls from './ProductControls';
import ActiveFilters from './ActiveFilters';
import ProductGrid from './ProductGrid';
import PaginationControls from './PaginationControls';

export default function ProductList({ initialCategory = 'All' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        const uniqueCategories = new Set();
        const uniqueBrands = new Set();

        snapshot.docs.forEach((doc) => {
          const product = doc.data();
          if (product.category) uniqueCategories.add(product.category);
          if (product.brand) uniqueBrands.add(product.brand);
        });

        setCategories(['All', ...Array.from(uniqueCategories)]);
        setBrands(Array.from(uniqueBrands));
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

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

        setSubCategories(['All', ...Array.from(uniqueSubCategories)]);
        setSelectedSubCategory('All');
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  useEffect(() => {
    resetPagination();
    updateActiveFilters();
  }, [selectedCategory, selectedSubCategory, selectedBrands, priceRange, sortOrder]);

  const updateActiveFilters = () => {
    const filters = [];

    if (selectedCategory !== 'All') filters.push({ type: 'category', value: selectedCategory });
    if (selectedSubCategory !== 'All') filters.push({ type: 'subcategory', value: selectedSubCategory });
    selectedBrands.forEach((brand) => filters.push({ type: 'brand', value: brand }));
    if (priceRange[0] > 0) filters.push({ type: 'minPrice', value: `$${priceRange[0]}` });
    if (priceRange[1] < 10000) filters.push({ type: 'maxPrice', value: `$${priceRange[1]}` });

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
      let q;
      const [field, direction] = sortOrder.split('-');
      const sortDirection = direction === 'asc' ? 'asc' : 'desc';

      if (selectedCategory === 'All') {
        q = query(productsRef, orderBy(field, sortDirection), limit(productsPerPage));
      } else if (selectedSubCategory === 'All') {
        q = query(productsRef, where('category', '==', selectedCategory), orderBy(field, sortDirection), limit(productsPerPage));
      } else {
        q = query(productsRef, where('category', '==', selectedCategory), where('subCategory', '==', selectedSubCategory), orderBy(field, sortDirection), limit(productsPerPage));
      }

      if (selectedBrands.length > 0) {
        if (selectedBrands.length === 1) {
          q = query(q, where('brand', '==', selectedBrands[0]));
        }
      }

      if (startDoc) q = query(q, startAfter(startDoc));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setHasMore(false);
        if (isFirstPage) setProducts([]);
        setLoading(false);
        return;
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      paginationRef.current.currentCursor = lastDoc;
      const fetchedProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setProducts(fetchedProducts);

      if (fetchedProducts.length < productsPerPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (!isFirstPage) {
        if (currentPage >= paginationRef.current.snapshots.length) {
          paginationRef.current.snapshots.push(lastDoc);
        }
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

  const handleCategoryChange = (category) => setSelectedCategory(category);
  const handleSubCategoryChange = (subCategory) => setSelectedSubCategory(subCategory);
  const handlePriceRangeChange = (event, newValue) => setPriceRange(newValue);
  const handleSortChange = (event, newValue) => newValue && setSortOrder(newValue);
  const handleViewModeChange = (mode) => setViewMode(mode);
  const toggleBrandSelection = (brand) => setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
  const removeFilter = (filterType, filterValue) => {
    if (filterType === 'category') setSelectedCategory('All');
    else if (filterType === 'subcategory') setSelectedSubCategory('All');
    else if (filterType === 'brand') setSelectedBrands((prev) => prev.filter((brand) => brand !== filterValue));
    else if (filterType === 'minPrice') setPriceRange([0, priceRange[1]]);
    else if (filterType === 'maxPrice') setPriceRange([priceRange[0], 10000]);
  };
  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setSortOrder('price-asc');
  };

  const filteredProducts = products.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

  return (
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
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
      />

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
      />

      <Box sx={{ flexGrow: 1, p: 2, flexBasis: 0 }}>
        <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} sx={{ mb: 2 }}>
          <Link underline="hover" color="neutral" href="/">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
              Home
            </Box>
          </Link>
          <Link underline="hover" color="neutral" href="/products">
            Products
          </Link>
          {selectedCategory !== 'All' && (
            <Link underline="hover" color="neutral" href={`/products/category/${selectedCategory}`}>
              {selectedCategory}
            </Link>
          )}
          {selectedSubCategory !== 'All' && <Typography color="primary">{selectedSubCategory}</Typography>}
        </Breadcrumbs>
        <ProductControls sortOrder={sortOrder} handleSortChange={handleSortChange} viewMode={viewMode} handleViewModeChange={handleViewModeChange} setShowFilters={setShowFilters} />
        <ActiveFilters activeFilters={activeFilters} removeFilter={removeFilter} clearAllFilters={clearAllFilters} />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography color="danger">{error}</Typography>
          </Box>
        )}

        {!loading && filteredProducts.length === 0 && (
          <Card variant="outlined" sx={{ textAlign: 'center', p: 4, my: 4 }}>
            <Typography level="h4">No products found</Typography>
            <Typography sx={{ mt: 1 }}>Try adjusting your filters to find what you're looking for.</Typography>
            <Button variant="solid" color="primary" onClick={clearAllFilters} sx={{ mt: 2 }}>
              Clear All Filters
            </Button>
          </Card>
        )}

        <ProductGrid products={filteredProducts} viewMode={viewMode} />
        <PaginationControls currentPage={currentPage} hasMore={hasMore} loading={loading} loadPrevPage={loadPrevPage} loadNextPage={loadNextPage} />
      </Box>
    </Stack>
  );
}