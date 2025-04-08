import React from 'react';
import { Box, Divider, List, ListItem, ListItemButton, ListItemContent, Sheet, Slider, Typography, FormControl, Input, Checkbox, Button } from '@mui/joy';

const FilterSidebar = ({
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
  <Sheet
    sx={{
      width: 250, // Fixed width
      p: 2,
      borderRight: '1px solid',
      borderColor: 'divider',
      overflow: 'auto',
    }}
  >
    <Typography level="h4" sx={{ mb: 2 }}>Filters</Typography>

    <Box sx={{ mb: 3 }}>
      <Typography level="title-md" sx={{ mb: 1 }}>Categories</Typography>
      <List size="sm">
        {categories.map((category) => (
          <ListItem key={category}>
            <ListItemButton selected={selectedCategory === category} onClick={() => handleCategoryChange(category)}>
              <ListItemContent>{category}</ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>

    <Divider />

    {selectedCategory !== 'All' && (
      <Box sx={{ mb: 3, mt: 2 }}>
        <Typography level="title-md" sx={{ mb: 1 }}>Sub-Categories</Typography>
        <List size="sm">
          {subCategories.map((subCategory) => (
            <ListItem key={subCategory}>
              <ListItemButton selected={selectedSubCategory === subCategory} onClick={() => handleSubCategoryChange(subCategory)}>
                <ListItemContent>{subCategory}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 2 }} />
      </Box>
    )}

    <Box sx={{ mb: 3, mt: 2 }}>
      <Typography level="title-md" sx={{ mb: 1 }}>Price Range</Typography>
      <Box sx={{ px: 1 }}>
        <Slider value={priceRange} onChange={handlePriceRangeChange} valueLabelDisplay="auto" min={0} max={10000} sx={{ mt: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <FormControl size="sm">
            <Input value={priceRange[0]} width="50px" onChange={(e) => handlePriceRangeChange(null, [Number(e.target.value), priceRange[1]])} startDecorator="$" />
          </FormControl>
          <FormControl size="sm">
            <Input value={priceRange[1]} onChange={(e) => handlePriceRangeChange(null, [priceRange[0], Number(e.target.value)])} startDecorator="$" />
          </FormControl>
        </Box>
      </Box>
    </Box>

    <Divider />

    <Box sx={{ mb: 3, mt: 2 }}>
      <Typography level="title-md" sx={{ mb: 1 }}>Brands</Typography>
      <List size="sm">
        {brands.map((brand) => (
          <ListItem key={brand}>
            <ListItemButton onClick={() => toggleBrandSelection(brand)}>
              <Checkbox checked={selectedBrands.includes(brand)} onChange={() => toggleBrandSelection(brand)} sx={{ mr: 1 }} />
              <ListItemContent>{brand}</ListItemContent>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>

    <Divider />

    <Button variant="outlined" color="neutral" onClick={clearAllFilters} fullWidth sx={{ mt: 2 }}>
      Clear All Filters
    </Button>
  </Sheet>
);

export default FilterSidebar;