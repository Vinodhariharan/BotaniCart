// ProductControls.js
import React from 'react';
import { Box, FormControl, Select, Option, IconButton, Button } from '@mui/joy';
import SortIcon from '@mui/icons-material/Sort';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

const ProductControls = ({ sortOrder, handleSortChange, viewMode, handleViewModeChange, setShowFilters }) => (
//  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 1 }}>
//     <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
//       <Button variant="outlined" color="neutral" startDecorator={<FilterAltOutlinedIcon />} onClick={() => setShowFilters(true)} sx={{ flexGrow: 1 }}>
//         Filters
//       </Button> 
//     </Box> 
//     <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' } }}>
//       <FormControl size="sm" sx={{ minWidth: 120 }}>
//         <Select value={sortOrder} onChange={handleSortChange} startDecorator={<SortIcon />}>
//           <Option value="price-asc">Price: Low to High</Option>
//           <Option value="price-desc">Price: High to Low</Option>
//           <Option value="name-asc">Name: A to Z</Option>
//           <Option value="name-desc">Name: Z to A</Option>
//           <Option value="date-desc">Newest First</Option>
//         </Select>
//       </FormControl>
//       <Box sx={{ display: 'flex', gap: 0.5 }}>
//         <IconButton variant={viewMode === 'grid' ? 'solid' : 'plain'} color={viewMode === 'grid' ? 'primary' : 'neutral'} onClick={() => handleViewModeChange('grid')} size="sm">
//           <ViewModuleIcon />
//         </IconButton>
//         <IconButton variant={viewMode === 'list' ? 'solid' : 'plain'} color={viewMode === 'list' ? 'primary' : 'neutral'} onClick={() => handleViewModeChange('list')} size="sm">
//           <ViewListIcon />
//         </IconButton>
//       </Box> 
//     </Box> 
//   </Box>
  <></>
);

export default ProductControls;