// PaginationControls.js
import React from 'react';
import { Box, Button, Typography, } from '@mui/joy';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const PaginationControls = ({ currentPage, hasMore, loading, loadPrevPage, loadNextPage }) => (
  !loading && (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
      <Button disabled={currentPage <= 1 || loading} onClick={loadPrevPage} variant="outlined" color="neutral" startDecorator={<ChevronLeft />}>
        Previous
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
        <Typography>Page {currentPage}</Typography>
      </Box>
      <Button disabled={!hasMore || loading} onClick={loadNextPage} variant="outlined" color="neutral" endDecorator={<ChevronRight />}>
        Next
      </Button>
    </Box>
  )
);

export default PaginationControls;