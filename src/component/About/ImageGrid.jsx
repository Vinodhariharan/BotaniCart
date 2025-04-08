import React from 'react';
import { Box, Grid, AspectRatio } from '@mui/joy';

// Assuming you have a list of image file names in the plants directory.
// If not, you need to provide the image file names array.
// Example:
const imageFileNames = [
  'plant1.jpg',
  'plant2.jpg',
  'plant3.jpg',
  // ... more image file names
];

export default function MasonryImageList() {
  return (
    <Box sx={{ width: '100%', height: 450, overflowY: 'auto' }}>
      <Grid container spacing={2}>
        {imageFileNames.map((fileName) => (
          <Grid xs={12} sm={6} md={4} key={fileName} item>
            <AspectRatio ratio="1">
              <img
                src={`${import.meta.env.BASE_URL}assets/images/plants/${fileName}`}
                alt={fileName}
                loading="lazy"
                style={{ objectFit: 'cover' }}
              />
            </AspectRatio>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}