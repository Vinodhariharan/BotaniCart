import * as React from 'react';
import {
  AspectRatio,
  Box,
  Card,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  Link,
  Typography,
  Snackbar,
} from '@mui/joy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button } from '@mui/joy'; // Add Button import
import { useCart } from '../AllComp/CardContext'; // Import your CartContext
import useUser from '../../AuthProtectedRoute/useUser'; // Import your useUser hook

export default function RecommendedProductCard({ product, setaddtoCartSnack }) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);
  const { isUser } = useUser();
  let addSound = new Audio('/addtocart.mp3');
  let alertSound = new Audio('/alert.mp3');

  const handleAddToCart = () => {
    if (isUser) {
      addSound.play();
      addToCart(product);
      setAdded(true); // Change button state to "Added"
      setaddtoCartSnack("Added to Cart!");
      setTimeout(() => setAdded(false), 1000); // Reset after a short delay
    } else {
      alertSound.play();
      setaddtoCartSnack("Sign in to add plants to your garden collection");
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: 180, // Smaller width for recommendations within chat
        minHeight: '280px',
        maxHeight: '320px',
        maxWidth: '100%',
        boxShadow: 'sm',
        borderRadius: 'md',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 'md',
        },
        overflow: 'hidden',
        flexShrink: 0, // Prevent shrinking in flex container
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="1" sx={{ minWidth: 120 }}>
          <img
            src={product.imageSrc || "https://via.placeholder.com/120"}
            loading="lazy"
            alt={product.title || "Product image"}
            style={{ objectFit: 'cover' }}
          />
          {product.stock && product.stock.quantity < 10 && (
            <Chip
              variant="solid"
              size="sm"
              color={product.stock.quantity <= 5 ? 'danger' : 'warning'}
              sx={{
                position: 'absolute',
                top: 4,
                left: 4,
                zIndex: 2,
                fontSize: '10px',
                height: '20px',
              }}
            >
              {product.stock.quantity <= 5 ? 'Low Stock' : `${product.stock.quantity} left`}
            </Chip>
          )}
        </AspectRatio>
      </CardOverflow>

      <CardContent sx={{ p: 1 }}>
        <Link
          href={`/products/${product.id || ''}`}
          overlay
          underline="none"
          sx={{ color: 'text.primary' }}
        >
          <Typography
            level="title-sm"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              minHeight: '20px',
              fontSize: '13px',
            }}
          >
            {product.title || "Product Name"}
          </Typography>
        </Link>

        <Typography level="body-xs" sx={{ color: 'text.tertiary', mt: 0.2, fontSize: '9px' }}>
          {product.details?.sunlight ? `${product.details.sunlight} • ` : ''}
          {product.details?.watering || product.details?.specialFeatures}
        </Typography>

        <Divider sx={{ my: 0.5 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography level="title-md" sx={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>
            ${product.price || "—"}
          </Typography>
          <Button
            startDecorator={<ShoppingCartIcon fontSize="small" />}
            variant={added ? 'soft' : 'solid'}
            color="success"
            size="sm"
            disabled={added}
            sx={{
              borderRadius: 'xl',
              fontWeight: 600,
              fontSize: '10px',
              py: 0.2,
              px: 1,
              transition: 'all 0.5s ease-in-out',
              minWidth: 80,
            }}
            onClick={handleAddToCart}
          >
            {added ? 'Added' : 'Add'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}