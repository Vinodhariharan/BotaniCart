import React, { useState, useEffect, useMemo } from 'react';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  onSnapshot
} from 'firebase/firestore';
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
import CircularProgress from '@mui/joy/CircularProgress';
import Badge from '@mui/joy/Badge';
import IconButton from '@mui/joy/IconButton';
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebaseConfig';
import CompactCartCard from './CartCard';
import { useCart } from './CardContext';

// Import Joy UI icons instead of Material UI icons
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckout from '@mui/icons-material/ShoppingCartCheckout';
import Login from '@mui/icons-material/Login';

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const { cartProducts } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setLoading(user ? true : false);
      
      if (user) {
        // Reference to the user's document
        const userCartRef = doc(db, 'users', user.uid);

        // Set up real-time listener for cart items
        const unsubscribe = onSnapshot(userCartRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const cartData = userData.cart?.items || [];
            
            setCartItems(cartData);
            setLoading(false);
          } else {
            setCartItems([]);
            setLoading(false);
          }
        }, (error) => {
          console.error("Error fetching cart:", error);
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        setCartItems([]);
      }
    });

    // Cleanup subscription
    return () => unsubscribeAuth();
  }, [auth, db]);

  // Calculate total cart quantity
  const totalCartQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const handleCheckout = () => {
    navigate('/checkout');
    setOpen(false);
  };

  const handleSignIn = () => {
    navigate('/login');
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Badge badgeContent={isAuthenticated ? totalCartQuantity : 0} color="neutral">
        <Button
          variant="soft"
          color="neutral"
          startDecorator={<ShoppingCart />}
          onClick={() => setOpen(true)}
          sx={{ borderRadius: '20px' }}
        >
          View Cart
        </Button>
      </Badge>
      
      <Drawer 
        variant="outlined" 
        open={open} 
        onClose={() => setOpen(false)} 
        size="md" 
        anchor="right"
        slotProps={{
          content: {
            sx: {
              bgcolor: 'background.surface',
              p: 0,
              boxShadow: 'lg'
            }
          }
        }}
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
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Divider />
          <DialogContent sx={{ gap: 2 }}>
            {!isAuthenticated ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                <Typography level="h4" textAlign="center" sx={{ mb: 2 }}>
                  Sign In Required
                </Typography>
                <Typography textAlign="center" sx={{ mb: 4 }}>
                  Please sign in to view your cart and add items.
                </Typography>
                <Button
                  size="lg"
                  variant="soft"
                  color="primary"
                  onClick={handleSignIn}
                  startDecorator={<Login />}
                  sx={{ borderRadius: '20px', px: 4 }}
                >
                  Sign In
                </Button>
              </Stack>
            ) : loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                <CircularProgress variant="soft" />
                <Typography level="body-sm" mt={2}>
                  Loading your cart...
                </Typography>
              </Stack>
            ) : cartItems.length === 0 ? (
              <Typography textAlign="center" sx={{ py: 4 }}>
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
                <Typography level="title-md" sx={{ mt: 2, textAlign: 'right' }}>
                  Total Items: {cartItems.length}
                </Typography>
              </>
            )}
          </DialogContent>
          <Divider sx={{ mt: 'auto' }} />
          <Stack direction="row" justifyContent="space-between" useFlexGap spacing={1}>
            {isAuthenticated ? (
              <>
                <Button 
                  variant="solid" 
                  color="#fff"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || loading}
                  startDecorator={<ShoppingCartCheckout />}
                  sx={{ borderRadius: '20px', backgroundColor:"#136c13", color:'#fff'}}
                >
                  Checkout
                </Button>
                <Button 
                  variant="plain" 
                  color="neutral" 
                  onClick={() => setOpen(false)}
                  sx={{ borderRadius: 'md' }}
                >
                  Close
                </Button>
              </>
            ) : (
              <Button 
                fullWidth
                variant="plain" 
                color="neutral" 
                onClick={() => setOpen(false)}
                sx={{ borderRadius: 'md' }}
              >
                Close
              </Button>
            )}
          </Stack>
        </Sheet>
      </Drawer>
    </React.Fragment>
  );
}