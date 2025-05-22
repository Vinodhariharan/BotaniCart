// ActiveFilters.js
import React from 'react';
import { Box, Typography, Stack, Chip, ChipDelete, Button } from '@mui/joy';

const ActiveFilters = ({ activeFilters, removeFilter, clearAllFilters }) => (
  activeFilters.length > 0 && (
    <Box sx={{ mb: 2 }}>
      <Typography level="body-sm" sx={{ mb: 1 }}>Active Filters:</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {activeFilters.map((filter, index) => (
          <Chip key={`${filter.type}-${index}`} variant="soft" color="primary" endDecorator={<ChipDelete onDelete={() => removeFilter(filter.type, filter.value)} />}>
            {(filter.type === 'category' ? 'Category: ' :
              filter.type === 'subcategory' ? 'Subcategory: ' :
                filter.type === 'brand' ? 'Brand: ' :
                  filter.type === 'minPrice' ? 'Min: ' :
                    filter.type === 'maxPrice' ? 'Max: ' : '') + filter.value}
          </Chip>
        ))}
        {activeFilters.length > 1 && (
          <Button size="sm" variant="soft" color="neutral" sx={{justifyContent:'center'}} onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </Stack>
    </Box>
  )
);

export default ActiveFilters;