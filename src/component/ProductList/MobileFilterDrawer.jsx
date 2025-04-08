// MobileFilterDrawer.js
import React from 'react';
import { Box, Drawer, Typography, IconButton } from '@mui/joy';
import FilterSidebar from './FilterSidebar';
import { ChevronRight } from '@mui/icons-material';

const MobileFilterDrawer = ({
  open,
  onClose,
  categories,
  selectedCategory,
  handleCategoryChange,
  subCategories,
  selectedSubCategory,
  handleSubCategoryChange,
  priceRange,
  handlePriceRangeChange,
  brands,
  selectedBrands,
  toggleBrandSelection,
  clearAllFilters,
}) => (
  <Drawer anchor="left" open={open} onClose={onClose}>
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="h4">Filters</Typography>
        <IconButton onClick={onClose}>
          <ChevronRight />
        </IconButton>
      </Box>

      <FilterSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={(category) => {
          handleCategoryChange(category);
          onClose();
        }}
        subCategories={subCategories}
        selectedSubCategory={selectedSubCategory}
        handleSubCategoryChange={(subCategory) => {
          handleSubCategoryChange(subCategory);
          onClose();
        }}
        priceRange={priceRange}
        handlePriceRangeChange={handlePriceRangeChange}
        brands={brands}
        selectedBrands={selectedBrands}
        toggleBrandSelection={toggleBrandSelection}
        clearAllFilters={() => {
          clearAllFilters();
          onClose();
        }}
      />
    </Box>
  </Drawer>
);

export default MobileFilterDrawer;