import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { 
  Card,
  AspectRatio,
  IconButton,
  Typography,
  Box,
  Stack
} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ThemeProvider } from '@mui/joy/styles';
import theme from '../../theme';
import { app } from '../../firebaseConfig';
import { useCart } from './CardContext';

export function CompactCartCard({ productId }) {
  const { 
    rawCartItems, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  // Find the specific cart item for this product
  const cartItem = rawCartItems.find(item => item.productId === productId);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({
            id: productSnap.id,
            title: productSnap.data().title,
            price: productSnap.data().price,
            imageSrc: productSnap.data().imageSrc,
          });
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, db]);

  const handleQuantityChange = (newQuantity) => {
    if (product && cartItem && newQuantity > 0) {
      updateQuantity({ productId: productId }, newQuantity);
    }
  };

  const handleRemove = () => {
    if (product && cartItem) {
      removeFromCart({ productId: productId });
    }
  };

  if (loading || !product || !cartItem) {
    return <Typography level="body-xs">Loading...</Typography>;
  }

  const totalPrice = (product.price * cartItem.quantity).toFixed(2);

  return (
    <ThemeProvider theme={theme}>
      <Card 
        variant="outlined"
        sx={{ 
          width: '100%',
          height: '100px', // Reduced height for drawer
          p: 1, // Smaller padding
          mb: 0.5, // Reduced margin
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1 // Reduced gap
        }}
      >
        {/* Product Image */}
        <AspectRatio ratio="1" sx={{ width: 100, height: 100, flexShrink: 0 }}>
          <img
            src={product.imageSrc}
            loading="lazy"
            alt={product.title}
            style={{ objectFit: 'cover', borderRadius: '4px' }}
          />
        </AspectRatio>

        {/* Middle Section - Title and Quantity */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography 
            level="body-sm" 
            fontWeight="md" 
            noWrap 
            title={product.title}
            sx={{ mb: 0.5 }}
          >
            {product.title}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Quantity Controls */}
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 'sm',
                height: '24px'
              }}
            >
              <IconButton 
                size="sm" 
                variant="plain"
                onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                sx={{ p: 0 }}
              >
                <RemoveIcon sx={{ fontSize: 16 }} />
              </IconButton>

              <Typography level="body-xs" sx={{ px: 0.5 }}>
                {cartItem.quantity}
              </Typography>

              <IconButton 
                size="sm" 
                variant="plain"
                onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                sx={{ p: 0 }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            <Typography level="body-xs" color="neutral">
              ${product.price.toFixed(2)} 
            </Typography>
          </Stack>
        </Box>

        {/* Right Section - Price and Remove */}
        <Stack direction="column" alignItems="flex-end" spacing={0.5} sx={{ flexShrink: 0 }}>
          <Typography level="body-sm" fontWeight="md">
            $ {totalPrice}
          </Typography>

          <IconButton 
            size="sm" 
            variant="soft" 
            color="danger"
            onClick={handleRemove}
            sx={{ p: 0.5 }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Card>
    </ThemeProvider>
  );
}

export default CompactCartCard;