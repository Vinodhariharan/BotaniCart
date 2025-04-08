import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton from '@mui/joy/IconButton';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Close from '@mui/icons-material/Close';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
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
        orientation="horizontal" 
        sx={{ 
          width: '100%', 
          height: '90px', 
          boxShadow: 'sm', 
          margin: '4px 0', 
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <AspectRatio ratio="1" sx={{ width: 60, height: 60, flexShrink: 0 }}>
          <img
            src={product.imageSrc}
            loading="lazy"
            alt={product.title}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '4px'
            }}
          />
        </AspectRatio>

        <div sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography level="body-sm" fontWeight="md">
            {product.title}
          </Typography>
          <div sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1 
          }}>
            <div sx={{
              display: 'flex',
              flexDirection: 'row', // Explicitly set to horizontal
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'sm'
            }}>
              <IconButton 
                size="sm" 
                variant="plain"
                color="neutral"
                onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                sx={{ px: 0.5 }}
              >
                <Remove fontSize="small" />
              </IconButton>

              <Typography level="body-sm" sx={{ px: 1 }}>
                {cartItem.quantity}
              </Typography>

              <IconButton 
                size="sm" 
                variant="plain"
                color="neutral"
                onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                sx={{ px: 0.5 }}
              >
                <Add fontSize="small" />
              </IconButton>
            </div>

            <Typography level="body-xs" color="neutral" sx={{ ml: 1 }}>
              {product.price.toFixed(2)} INR each
            </Typography>
          </div>
        </div>

        <div sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1
        }}>
          <Typography level="body-sm" fontWeight="lg">
            {totalPrice} INR
          </Typography>

          <IconButton 
            size="sm" 
            variant="soft" 
            color="danger"
            onClick={handleRemove}
            sx={{ p: 0.5 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </div>
      </Card>
    </ThemeProvider>
  );
}

export default CompactCartCard;