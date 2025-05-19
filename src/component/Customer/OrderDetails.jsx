import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  Grid,
  Chip,
  Sheet,
  AspectRatio,
  CardOverflow,
  Skeleton,
  LinearProgress,
  Badge
} from "@mui/joy";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { getProductDetails } from "../../AuthProtectedRoute/firestore";
import { ProductItem } from "../AllComp/ProductItem";
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import { useOutletContext } from "react-router-dom";

const OrdersList = () => {
    const { user, userData, showSuccessMessage, setError } = useOutletContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', userData.uid),
          // orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const orderData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData]);

  const handleOpen = async (order) => {
    setSelectedOrder(order);
    setOpen(true);
    setLoadingProducts(true);

    const productMap = {};
    await Promise.all(
      order.items.map(async (item) => {
        const product = await getProductDetails(item.productId);
        if (product) {
          productMap[item.productId] = { ...product, quantity: item.quantity };
        }
      })
    );

    setProductDetails(productMap);
    console.log(productDetails);
    setLoadingProducts(false);
  };

  // Function to determine status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'primary';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Empty state component
  const EmptyState = () => (
    <Sheet
      variant="soft"
      sx={{
        borderRadius: 'md',
        p: 4,
        textAlign: 'center',
        maxWidth: 500,
        mx: 'auto',
        mt: 4
      }}
    >
      <ShoppingBagRoundedIcon sx={{ fontSize: 60, mb: 2, color: 'neutral.500' }} />
      <Typography level="h4" sx={{ mb: 1 }}>No Orders Yet</Typography>
      <Typography level="body-md" sx={{ mb: 3, color: 'neutral.600' }}>
        You haven't placed any orders yet. Browse our products and make your first purchase!
      </Typography>
      <Button variant="solid" color="primary">
        Start Shopping
      </Button>
    </Sheet>
  );

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography level="h2" fontWeight="lg">
          Your Orders
        </Typography>
        <Badge badgeContent={orders.length} color="primary">
          <Chip variant="soft" color="neutral" size="lg">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} 
          </Chip>
        </Badge>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {loading ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
          <Box sx={{ mt: 4 }}>
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="30%" />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Skeleton variant="rectangular" width={100} height={36} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ) : orders.length === 0 ? (
        <EmptyState />
      ) : (
        <Box sx={{ display: 'grid', gap: 3 }}>
          {orders.map((order) => (
            <Card 
              key={order.id} 
              variant="outlined" 
              sx={{ 
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 'md',
                  borderColor: 'primary.300',
                }
              }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid xs={12} sm={7}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ReceiptRoundedIcon sx={{ mr: 1, color: 'primary.500' }} />
                      <Typography level="title-lg">
                        Order #{order.orderNumber}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayRoundedIcon sx={{ fontSize: 'sm', mr: 0.5, color: 'neutral.500' }} />
                        <Typography level="body-sm" color="neutral.600">
                          {formatDate(order.orderDate)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalShippingRoundedIcon sx={{ fontSize: 'sm', mr: 0.5, color: 'neutral.500' }} />
                        <Typography level="body-sm" color="neutral.600">
                          {order.tracking.carrier || "Standard Shipping"}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardRoundedIcon sx={{ fontSize: 'sm', mr: 0.5, color: 'neutral.500' }} />
                        <Typography level="body-sm" color="neutral.600">
                          {order.paymentDetails.paymentMethod}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid xs={12} sm={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center', gap: 2 }}>
                    <Chip
                      variant="soft"
                      color={getStatusColor(order.status)}
                      size="md"
                    >
                      {order.status}
                    </Chip>
                    
                    <Typography level="title-md" fontWeight="lg">
                      ${order.pricing.grandTotal.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
              
              <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
                <CardContent orientation="horizontal" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, py: 1.5 }}>
                  <Button 
                    variant="plain" 
                    color="neutral" 
                    size="sm"
                    onClick={() => {}}
                  >
                    Track Order
                  </Button>
                  <Button 
                    variant="solid" 
                    color="primary" 
                    size="sm" 
                    onClick={() => handleOpen(order)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </CardOverflow>
            </Card>
          ))}
        </Box>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <ModalDialog 
            layout="center"
            size="lg"
            variant="outlined"
            sx={{ 
              width: '90%', 
              maxWidth: 900,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <ModalClose />
            <Typography level="h3" startDecorator={<ReceiptRoundedIcon />} sx={{ mb: 2 }}>
              Order Details
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <Chip variant="soft" color={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status}
              </Chip>
              <Typography level="title-sm">
                Order #{selectedOrder.orderNumber}
              </Typography>
              <Typography level="body-sm" color="neutral.600">
                Placed on {formatDate(selectedOrder.orderDate)}
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {/* Left: Ordered Items */}
              <Grid xs={12} md={7}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                      Order Items
                    </Typography>
                    
                    {loadingProducts ? (
                      <Box sx={{ py: 2 }}>
                        <CircularProgress size="sm" />
                        <Typography level="body-sm" sx={{ mt: 1 }}>
                          Loading product details...
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {selectedOrder.items.map((item) =>
                          productDetails[item.productId] ? (
                            <Sheet
                              key={item.productId}
                              variant="outlined"
                              sx={{ 
                                borderRadius: 'sm',
                                p: 2,
                                display: 'flex',
                                gap: 2
                              }}
                            >
                              <AspectRatio
                                ratio="1/1"
                                sx={{ 
                                  width: 70,
                                  borderRadius: 'sm',
                                  overflow: 'hidden'
                                }}
                              >
                                {productDetails[item.productId].imageUrl ? (
                                  <img
                                    src={productDetails[item.productId].imageUrl}
                                    alt={productDetails[item.productId].name}
                                    style={{ objectFit: 'cover' }}
                                  />
                                ) : (
                                  <Box sx={{ bgcolor: 'neutral.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography level="body-xs" textAlign="center">No Image</Typography>
                                  </Box>
                                )}
                              </AspectRatio>
                              
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography level="title-sm">
                                  {productDetails[item.productId].name}
                                </Typography>
                                <Typography level="body-xs" color="neutral.600">
                                  Qty: {item.quantity}
                                </Typography>
                                <Typography level="body-sm" fontWeight="md" sx={{ mt: 0.5 }}>
                                  ${(productDetails[item.productId].price * item.quantity).toFixed(2)}
                                </Typography>
                              </Box>
                            </Sheet>
                          ) : (
                            <Sheet
                              key={item.productId}
                              variant="soft"
                              color="neutral"
                              sx={{ p: 2, borderRadius: 'sm' }}
                            >
                              <Typography level="body-sm">
                                Product details unavailable
                              </Typography>
                            </Sheet>
                          )
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                      Payment Summary
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography level="body-md">Subtotal</Typography>
                      <Typography level="body-md">${selectedOrder.pricing.subtotal?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography level="body-md">Shipping</Typography>
                      <Typography level="body-md">${selectedOrder.pricing.shippingCost?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography level="body-md">Tax</Typography>
                      <Typography level="body-md">${selectedOrder.pricing.tax?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography level="title-md">Total</Typography>
                      <Typography level="title-md" fontWeight="lg">
                        ${selectedOrder.pricing.grandTotal.toFixed(2)} {selectedOrder.pricing.currency}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right: Order Details */}
              <Grid xs={12} md={5}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                      Shipping Details
                    </Typography>
                    
                    <Typography level="body-md" fontWeight="md">
                      {selectedOrder.shippingAddress.fullName}
                    </Typography>
                    <Typography level="body-md">
                      {selectedOrder.shippingAddress.addressLine1}
                      {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                    </Typography>
                    <Typography level="body-md">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                    </Typography>
                    <Typography level="body-md" sx={{ mb: 2 }}>
                      {selectedOrder.shippingAddress.country}
                    </Typography>
                    
                    {selectedOrder.tracking.trackingNumber && (
                      <Box sx={{ mt: 2 }}>
                        <Typography level="body-sm" color="neutral.600">Tracking Number</Typography>
                        <Typography level="body-md" fontWeight="md">
                          {selectedOrder.tracking.trackingNumber}
                        </Typography>
                        <Typography level="body-sm" color="neutral.600" sx={{ mt: 1 }}>
                          Carrier
                        </Typography>
                        <Typography level="body-md">
                          {selectedOrder.tracking.carrier}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>
                      Payment Information
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography level="body-md">Payment Method</Typography>
                      <Typography level="body-md">{selectedOrder.paymentDetails.paymentMethod}</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography level="body-md">Payment Status</Typography>
                      <Chip 
                        size="sm" 
                        variant="soft"
                        color={selectedOrder.paymentDetails.paymentStatus === 'paid' ? 'success' : 'warning'}
                      >
                        {selectedOrder.paymentDetails.paymentStatus}
                      </Chip>
                    </Box>
                    
                    {selectedOrder.paymentDetails.cardLast4 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography level="body-sm" color="neutral.600">Card Information</Typography>
                        <Typography level="body-md">
                          •••• •••• •••• {selectedOrder.paymentDetails.cardLast4}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button 
                variant="outlined" 
                color="neutral" 
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button 
                variant="solid" 
                color="primary"
                onClick={() => {}}
              >
                Download Invoice
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      )}
    </Container>
  );
};

export default OrdersList;