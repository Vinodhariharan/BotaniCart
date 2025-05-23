import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Drawer,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalClose,
  ModalDialog,
  Radio,
  RadioGroup,
  Sheet,
  Slider,
  Stack,
  Typography,
  useTheme,
} from '@mui/joy';
import { Search, Filter, X } from 'lucide-react';

const FilterSidebar = ({
  categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books'],
  selectedCategory = 'All',
  handleCategoryChange = () => {},
  subCategories = ['Laptops', 'Phones', 'Tablets'],
  selectedSubCategory = 'All',
  handleSubCategoryChange = () => {},
  priceRange = [0, 5000],
  handlePriceRangeChange = () => {},
  // brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'],
  // selectedBrands = [],
  // toggleBrandSelection = () => {},
  clearAllFilters = () => {},
  searchTerm = '',
  setSearchTerm = () => {},
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const theme = useTheme();

  
    function toTitle(str) {
      // Handle edge cases - return empty string if input is falsy
      if (!str) return '';
  
      // Split the string into an array of words, map over each word
      return str
        .toLowerCase()
        .split(' ')
        .map(word => {
          // Skip empty strings
          if (word.length === 0) return '';
          // Capitalize the first letter and join with the rest of the word
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    }

  const FilterContent = () => (
    <Stack spacing={3}  sx={{p:2, height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography level="h3" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          onClick={() => setIsMobileFilterOpen(false)}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <X size={22} />
        </IconButton>
      </Box>
      
      {/* Search Filter */}
      {/* <FormControl>
        <FormLabel sx={{ fontWeight: 500, mb: 1 }}>Search Products</FormLabel>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startDecorator={<Search size={18} />}
          variant="outlined"
          sx={{
            '--Input-focusedThickness': '2px',
            '--Input-focusedHighlight': theme.palette.primary[500],
          }}
        />
      </FormControl> */}
      
      {/* <Divider /> */}
      
      {/* Category Filter */}
      <FormControl>
        <FormLabel sx={{ fontWeight: 500, mb: 2 }}>Category</FormLabel>
        <RadioGroup 
          value={selectedCategory} 
          onChange={(e) => handleCategoryChange(e.target.value)}
          sx={{ gap: 1.5 }}
        >
          {categories.map((category) => (
            <Radio
              key={category}
              value={category}
              label={toTitle(category)}
              variant="outlined"
              sx={{
                flexDirection: 'row',
                gap: 1,
                '--Radio-actionRadius': '8px',
                '&:hover': {
                  backgroundColor: 'background.level1',
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
      
      {/* Subcategory Filter */}
      {selectedCategory !== 'All' && subCategories.length > 0 && (
        <>
          <Divider />
          <FormControl>
            <FormLabel sx={{ fontWeight: 500, mb: 2 }}>Subcategory</FormLabel>
            <RadioGroup 
              value={selectedSubCategory} 
              onChange={(e) => handleSubCategoryChange(e.target.value)}
              sx={{ gap: 1.5 }}
            >
              {subCategories.map((subCategory) => (
                <Radio
                  key={subCategory}
                  value={subCategory}
                  label={subCategory}
                  variant="outlined"
                  sx={{
                    flexDirection: 'row',
                    gap: 1,
                    '--Radio-actionRadius': '8px',
                    '&:hover': {
                      backgroundColor: 'background.level1',
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </>
      )}
      
      <Divider />
      
      {/* Price Range Filter */}
      <FormControl>
        <FormLabel sx={{ fontWeight: 500, mb: 2 }}>Price Range</FormLabel>
        <Box sx={{ px: 1 }}>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => handlePriceRangeChange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            step={100}
            marks={[
              { value: 0, label: '$0' },
              { value: 5000, label: '$5k' },
              { value: 10000, label: '$10k' },
            ]}
            sx={{
              '--Slider-trackSize': '6px',
              '--Slider-thumbSize': '20px',
              '--Slider-thumbWidth': '20px',
              py: 2,
            }}
          />
        </Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, px: 1 }}>
          <Typography level="body-sm" sx={{ fontWeight: 500 }}>
            ${priceRange[0]?.toLocaleString() || 0}
          </Typography>
          <Typography level="body-sm" sx={{ fontWeight: 500 }}>
            ${priceRange[1]?.toLocaleString() || 0}
          </Typography>
        </Stack>
      </FormControl>
      
      {/* <Divider /> */}
      
      {/* Brand Filter */}
      {/* <FormControl>
        <FormLabel sx={{ fontWeight: 500, mb: 2 }}>Brand</FormLabel>
        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
          <List 
            size="sm" 
            sx={{ 
              gap: 1,
              '--ListItem-paddingY': '4px',
              '--ListItem-paddingX': '0px',
            }}
          >
            {brands.map((brand) => (
              <ListItem key={brand}>
                <Checkbox
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrandSelection(brand)}
                  variant="outlined"
                  sx={{
                    '--Checkbox-actionRadius': '8px',
                    '&:hover': {
                      backgroundColor: 'background.level1',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </FormControl> */}
      
      <Divider />
      
      {/* Clear Filters Button */}
      <Button
        variant="outlined"
        color="neutral"
        fullWidth
        onClick={clearAllFilters}
        sx={{
          py: 1.5,
          mb:2,
          fontWeight: 500,
          borderRadius: 'md',
          '&:hover': {
            backgroundColor: 'background.level1',
            borderColor: 'neutral.outlinedHoverBorder',
          },
        }}
      >
        Clear All Filters
      </Button>
    </Stack>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <IconButton
        variant="solid"
        color="primary"
        size="lg"
        onClick={() => setIsMobileFilterOpen(true)}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 56,
          height: 56,
          borderRadius: '50%',
          boxShadow: 'lg',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Filter size={24} />
      </IconButton>

      {/* Mobile Filter Modal */}
      <Modal
        open={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        sx={{ display: { xs: 'flex', md: 'none' } }}
      >
        <ModalDialog
          variant="outlined"
          sx={{
            width: '90vw',
            maxWidth: '400px',
            height: '90vh',
            maxHeight: '650px',
            p: 0,
            gap: 0,
            borderRadius: 'lg',
            boxShadow: 'lg',
          }}
        >
          <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            <FilterContent />
          </Box>
        </ModalDialog>
      </Modal>

      {/* Desktop Sidebar */}
      <Card
        variant="outlined"
        sx={{
          width: 320,
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          position: 'sticky',
          top: 24,
          maxHeight: 'calc(100vh - 75px)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{height: '100%', overflow: 'auto' }}>
          <FilterContent />
        </Box>
      </Card>
    </>
  );
};

export default FilterSidebar;