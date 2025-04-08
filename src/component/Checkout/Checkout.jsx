import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../AllComp/CardContext";
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Grid
} from '@mui/joy';
import { db, auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

// Import subcomponents
import CartItems from './CartItems.jsx';
import ShippingAddress from './ShippingAddress';
import OrderSummary from './OrderSummary';
import PaymentPage from './PaymentPage';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsWithDetails, setProductsWithDetails] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Fetch user data from Firestore
  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
           
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          uid: userId,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          role: userData.role || "customer",
          billingInfo: userData.billingInfo || {},
          cart: userData.cart || { items: [] }
        });
      } else {
        // User document doesn't exist, create it
        const currentUser = auth.currentUser;
        if (currentUser) {
          const newUserData = {
            firstName: "",
            lastName: "",
            email: currentUser.email,
            phone: "",
            role: "customer", // Default role for new users
            createdAt: new Date().toISOString(),
            billingInfo: {},
            cart: { items: [] }
          };
                   
          await setDoc(userRef, newUserData);
          setUser({
            uid: userId,
            ...newUserData
          });
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        // Redirect to login if not authenticated
        navigate("/login");
      }
    });
     
    return () => unsubscribe();
  }, [navigate]);

  // Fetch product details for cart items
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!user?.cart?.items || user.cart.items.length === 0) {
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);
        const productsCollection = collection(db, "products");
        const productDetails = [];

        // Use a for...of loop for sequential async operations
        for (const item of user.cart.items) {
          const productDocRef = doc(productsCollection, item.productId);
          const productDocSnap = await getDoc(productDocRef);
          
          if (productDocSnap.exists()) {
            productDetails.push({
              id: productDocSnap.id,
              ...productDocSnap.data(),
              quantity: item.quantity
            });
          } else {
            console.warn(`Product with ID ${item.productId} not found`);
          }
        }

        setProductsWithDetails(productDetails);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoadingProducts(false);
      }
    };

    if (user) {
      fetchProductDetails();
    }
  }, [user]);

  // Calculate order summary
  const subtotal = calculateTotal(productsWithDetails);
  const shipping = 5.99;
  const tax = (subtotal * 0.08).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(shipping) + parseFloat(tax)).toFixed(2);

  const handlePlaceOrder = async () => {
    try {
      setOpenDialog(true);
    } catch (error) {
      console.error("Error opening payment dialog:", error);
      setError("Failed to process order. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const createOrder = async (paymentDetails) => {
    try {
      // Generate an order number with format ORD-XXXXX
      const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      
      // Format items for order
      const orderItems = productsWithDetails.map(product => ({
        productId: product.id,
        quantity: product.quantity
      }));
      
      // Get current timestamp
      const currentTimestamp = new Date().toISOString();
      
      // Create order object using exact format from requirements
      const orderData = {
        orderNumber: orderNumber,
        userId: user.uid,
        userEmail: user.email,
        orderDate: currentTimestamp,
        status: "pending",
        paymentStatus: "processing",
        paymentDetails: {
          paymentId: paymentDetails.paymentId || `pi_${Math.random().toString(36).substring(2, 15)}`,
          paymentMethod: "credit_card",
          paymentProvider: "stripe",
          transactionReference: paymentDetails.transactionReference || `txn_${Math.random().toString(36).substring(2, 15)}`,
          failureReason: null
        },
        items: orderItems,
        pricing: {
          subtotal: parseFloat(subtotal),
          taxTotal: parseFloat(tax),
          shippingTotal: shipping,
          grandTotal: parseFloat(total),
          currency: "USD"
        },
        shippingAddress: {
          fullName: `${user.firstName} ${user.lastName}`.trim() || "Guest User",
          addressLine1: user.billingInfo?.addressLine1 || "",
          addressLine2: user.billingInfo?.addressLine2 || "",
          city: user.billingInfo?.city || "",
          state: user.billingInfo?.state || "",
          postalCode: user.billingInfo?.postalCode || "",
          country: user.billingInfo?.country || "US",
          phone: user.phone || ""
        },
        customerNotes: paymentDetails.customerNotes || "Please leave at the door",
        timestamps: {
          created: currentTimestamp,
          updated: currentTimestamp,
          paymentProcessed: null,
          shipped: null,
          delivered: null
        },
        tracking: {
          carrier: "UPS",
          trackingNumber: null
        },
        source: {
          platform: "web",
          ipAddress: "192.168.1.1" // Could be dynamically captured in production
        }
      };
      
      // Add the order to Firestore
      const ordersCollection = collection(db, "orders");
      const orderRef = await addDoc(ordersCollection, orderData);
      console.log("Order created with ID:", orderRef.id);
      
      // Clear the cart
      clearCart();
      
      // Navigate to thank you page
      navigate('/thank-you', { state: { orderId: orderRef.id, orderNumber: orderNumber } });
      
      return true;
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order. Please try again.");
      return false;
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    const orderCreated = await createOrder(paymentDetails);
    if (orderCreated) {
      handleCloseDialog();
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading checkout information...</Typography>
    </Box>
  );
  
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto' }}>
      <Typography level="h3" textAlign="center" sx={{ mb: 3 }}>
        Checkout
      </Typography>
      
      <Grid container spacing={3}>
        {/* Left Column - Cart Items */}
        <Grid xs={12} md={8}>
          <CartItems 
            products={productsWithDetails} 
            loading={loadingProducts} 
          />
        </Grid>

        {/* Right Column - Address & Order Summary */}
        <Grid xs={12} md={4}>
          {/* Shipping Address Section */}
          <ShippingAddress 
            user={user} 
            setUser={setUser} 
          />

          {/* Order Summary */}
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
            onPlaceOrder={handlePlaceOrder}
            disabled={productsWithDetails.length === 0 || loadingProducts}
          />
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <PaymentPage
        open={openDialog}
        onClose={handleCloseDialog}
        onPaymentSuccess={handlePaymentSuccess}
        orderTotal={total}
        userData={user}
        products={productsWithDetails}
      />
    </Box>
  );
};

const calculateTotal = (products) => {
  return products.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
};

export default Checkout;