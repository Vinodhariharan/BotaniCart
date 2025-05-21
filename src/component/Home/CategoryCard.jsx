import { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { CardCover, Grid } from '@mui/joy';

export default function CategoryCard({ category }) {
  const [isFavorite, setIsFavorite] = useState(false);
  console.log(category)
  return (
    <Grid key={category.id} xs={12} sm={6} md={4} lg={3}>
      <Card
        component={Link}
        to={`/category/${category.id}`}
        variant="outlined"
        sx={{
          height: { xs: 160, sm: 200, md: 220 },
          textDecoration: 'none',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'neutral.200',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 'lg',
            borderColor: 'transparent',
            '& .category-image': {
              transform: 'scale(1.1)'
            },
            '& .category-overlay': {
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.2) 60%)'
            },
            '& .category-details': {
              transform: 'translateY(-5px)'
            },
            '& .category-count': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}
      >
        {/* Product count chip */}
        {category.count && (
          <Chip
            size="sm"
            variant="soft"
            color="primary"
            startDecorator={<LocalMallOutlinedIcon fontSize="small" />}
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 2,
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
              color: 'text.primary',
              fontSize: '0.75rem'
            }}
          >
            {category.count}
          </Chip>
        )}

        <CardCover>
          <img
            src={category.imageUrl}
            alt={category.name}
            loading="lazy"
            className="category-image"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease'
            }}
          />
        </CardCover>

        <CardCover
          className="category-overlay"
          sx={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15) 50%, rgba(0,0,0,0))',
            transition: 'background 0.3s ease'
          }}
        />

        <CardContent
          sx={{
            justifyContent: 'flex-end',
            textAlign: 'center',
            gap: 0.5,
            p: { xs: 1.5, sm: 2 }
          }}
        >
          <Box
            className="category-details"
            sx={{
              transition: 'transform 0.3s ease',
            }}
          >
            <Typography
              level="title-lg"
              sx={{
                color: 'white',
                fontWeight: 600,
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                mb: 0.5,
                lineHeight: 1.2
              }}
            >
              {category.name}
            </Typography>

            {category.description && (
              <Typography
                level="body-sm"
                className="category-count"
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  maxWidth: '85%',
                  mx: 'auto',
                  opacity: 0,
                  transform: 'translateY(8px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {category.description}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
