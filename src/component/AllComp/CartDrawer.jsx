import React, { useState, useEffect, useMemo } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  onSnapshot
} from 'firebase/firestore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Drawer from '@mui/joy/Drawer';
import Button from '@mui/joy/Button';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import ModalClose from '@mui/joy/ModalClose';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/joy/CircularProgress';
import { app } from '../../firebaseConfig';
import CompactCartCard from './CartCard';
import { useCart } from './CardContext';

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const {cartProducts} = useCart();

  useEffect(() => {
    // Only set up listener if user is authenticated
    if (auth.currentUser) {
      // Reference to the user's document
      const userCartRef = doc(db, 'users', auth.currentUser.uid);

      // Set up real-time listener for cart items
      const unsubscribe = onSnapshot(userCartRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const cartData = userData.cart?.items || [];
          
          setCartItems(cartData);
          setLoading(false);
        }
      }, (error) => {
        console.error("Error fetching cart:", error);
        setLoading(false);
      });

      // Cleanup subscription
      return () => unsubscribe();
    }
  }, [auth.currentUser, db]);

  // Calculate total cart quantity
  const totalCartQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    navigate('/checkout');
    setOpen(false);
  };

  return (
    <div>
      <Button
        sx={{ borderRadius: '20px' }}
        variant="soft"
        color="neutral"
        endDecorator={
          <Badge badgeContent={totalCartQuantity} color="primary">
            <ShoppingCartIcon color="white" />
          </Badge>
        }
        onClick={() => setOpen(true)}
      >
        View Cart
      </Button>
      <Drawer 
        variant="plain" 
        open={open} 
        onClose={() => setOpen(false)} 
        size="md" 
        anchor="right"
      >
        <Sheet
          sx={{
            borderRadius: 'md',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          <DialogTitle>Your Cart</DialogTitle>
          <ModalClose />
          <Divider />
          <DialogContent sx={{ gap: 2 }}>
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                <CircularProgress />
                <Typography level="body-sm" mt={2}>
                  Loading your cart...
                </Typography>
              </Stack>
            ) : cartItems.length === 0 ? (
              <Typography level="body-lg" textAlign="center" sx={{ py: 4 }}>
                Your cart is empty.
              </Typography>
            ) : (
              <>
                <List>
                  {cartItems.map((item) => (
                    <ListItem key={item.productId}>
                      <CompactCartCard 
                        productId={item.productId} 
                        quantity={item.quantity} 
                      />
                    </ListItem>
                  ))}
                </List>
                <Typography level="h6" sx={{ mt: 2, textAlign: 'right' }}>
                  Total Items: {cartItems.length}
                </Typography>
              </>
            )}
          </DialogContent>
          <Divider sx={{ mt: 'auto' }} />
          <Stack direction="row" justifyContent="space-between" useFlexGap spacing={1}>
            <Button 
              sx={{ 
                borderRadius: '20px', 
                backgroundColor: '#0A4938', 
                color: '#fff' 
              }} 
              variant="soft" 
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || loading}
            >
              Checkout
            </Button>
            <Button 
              sx={{ 
                borderRadius: '20px', 
                backgroundColor: 'red', 
                color: '#fff' 
              }} 
              variant="soft" 
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </Stack>
        </Sheet>
      </Drawer>
    </div>
  );
}