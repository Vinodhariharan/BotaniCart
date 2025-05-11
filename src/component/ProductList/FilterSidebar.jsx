import React from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography,
} from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';

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
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        width: 280,
        p: 2,
        display: { xs: 'none', md: 'block' },
        flexShrink: 0,
      }}
    >
      <Typography level="h4" sx={{ mb: 2 }}>
        Filters
      </Typography>
      
      {/* Search Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl>
          <FormLabel>Search</FormLabel>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startDecorator={<SearchIcon />}
            sx={{ mt: 1 }}
          />
        </FormControl>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <RadioGroup value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)}>
            {categories.map((category) => (
              <Radio
                key={category}
                value={category}
                label={category}
                checked={selectedCategory === category}
                sx={{ mt: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Subcategory Filter */}
      {selectedCategory !== 'All' && (
        <>
          <Box sx={{ mb: 3 }}>
            <FormControl>
              <FormLabel>Subcategory</FormLabel>
              <RadioGroup value={selectedSubCategory} onChange={(e) => handleSubCategoryChange(e.target.value)}>
                {subCategories.map((subCategory) => (
                  <Radio
                    key={subCategory}
                    value={subCategory}
                    label={subCategory}
                    checked={selectedSubCategory === subCategory}
                    sx={{ mt: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <Divider sx={{ my: 2 }} />
        </>
      )}
      
      {/* Price Range Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl>
          <FormLabel>Price Range</FormLabel>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              marks={[
                { value: 0, label: '$0' },
                { value: 5000, label: '$5k' },
                { value: 10000, label: '$10k' },
              ]}
            />
          </Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography level="body-sm">${priceRange[0]}</Typography>
            <Typography level="body-sm">${priceRange[1]}</Typography>
          </Stack>
        </FormControl>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Brand Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl>
          <FormLabel>Brand</FormLabel>
          <List size="sm" sx={{ '--ListItem-paddingY': '0px' }}>
            {brands.map((brand) => (
              <ListItem key={brand}>
                <Checkbox
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrandSelection(brand)}
                />
              </ListItem>
            ))}
          </List>
        </FormControl>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Clear Filters Button */}
      <Button
        variant="outlined"
        color="neutral"
        fullWidth
        onClick={clearAllFilters}
        sx={{ mt: 2 }}
      >
        Clear All Filters
      </Button>
    </Card>
  );
};

export default FilterSidebar;