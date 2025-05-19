import * as React from 'react';
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  CardOverflow,
  Chip,
  Divider,
  Link,
  ListDivider,
  Snackbar,
  Stack,
  Typography,
} from '@mui/joy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../../assets/css/button.css';
import { useCart } from '../AllComp/CardContext';
import useUser from '../../AuthProtectedRoute/useUser';

export default function ProductCard({setaddtoCartSnack, product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);
  const { isUser } = useUser();

  const handleAddToCart = () => {
    if(isUser){
    addToCart(product);
    setAdded(true); // Change button state to "Added"
      setTimeout(() => setAdded(false), 1000);
      setaddtoCartSnack("Added to Cart!");
    }
    else{
      setaddtoCartSnack("Sign in to add plants to your garden collection");
      setTimeout(1000);
    }

  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: 225,
        minHeight: '420px',
        maxHeight: '420px',
        maxWidth: '100%',
        boxShadow: 'sm',
        borderRadius: 'md',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 'md',
        },
        overflow: 'hidden',
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="1" sx={{ minWidth: 160 }}>
          <img
            src={product.imageSrc || "https://via.placeholder.com/160"}
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

      <Divider />

      <CardContent sx={{ p: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
          {product.category && (
            <Chip
              size="sm"
              variant="soft"
              color="primary"
              sx={{ textTransform: 'capitalize', height: '18px', fontSize: '10px' }}
            >
              {product.category}
            </Chip>
          )}

          {product.details && product.details.bloomSeason && (
            <Chip size="sm" variant="soft" color="success" sx={{ height: '18px', fontSize: '10px' }}>
              {product.details.bloomSeason}
            </Chip>
          )}
        </Stack>

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
              minHeight: '24px',
            }}
          >
            {product.title || "Product Name"}
          </Typography>
        </Link>

        {product.details && (
          <Typography level="body-xs" sx={{ color: 'text.tertiary', mt: 0.5, fontSize: '10px' }}>
            {product.details.sunlight && `${product.details.sunlight} • `}
            {product.details.watering && `${product.details.watering}`}
          </Typography>
        )}

        <Divider sx={{ my: 0.5 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" >
          <Typography level="title-md" sx={{ fontWeight: 'bold', color: 'success.600' }}>
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
              fontSize: '12px',
              py: 0.5,
              transition: 'all 0.5s ease-in-out',
              minWidth: 100,
            }}
            onClick={handleAddToCart}
          >
            {added ? 'Added to cart' : 'Add to cart'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}