import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Divider,
  CardContent,
  Chip,
  CircularProgress,
  AspectRatio,
  Alert
} from "@mui/joy";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../auth"; // Adjust the path based on your project structure

const OrdersList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Create query to get user orders, sorted by date
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(ordersQuery);
        const ordersData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        setOrders(ordersData);

        console.log(ordersData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError("Failed to load order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Helper function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Helper function to determine status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <>
      <Typography level="h3" sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif' }}>
        Order History
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert color="danger" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : orders.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {orders.map((order) => (
            <Card
              key={order.id}
              sx={{
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 'md'
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Typography level="h4" sx={{ fontSize: '1.1rem' }}>
                    Order #{order.orderNumber || order.id.substring(0, 8)}
                  </Typography>
                  <Chip
                    color={getStatusColor(order.status)}
                    variant="soft"
                  >
                    {order.status || 'Processing'}
                  </Chip>
                </Box>
                
                <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 2 }}>
                  Placed on {formatDate(order.createdAt)}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  {/* Items Preview */}
                  <Box sx={{ flex: 2 }}>
                    <Typography level="body-sm" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Items ({order.items?.length || 0})
                    </Typography>
                    
                    {order.items && order.items.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {order.items.slice(0, 3).map((item, index) => (
                          <Box key={index} sx={{ width: 60, textAlign: 'center' }}>
                            <AspectRatio ratio="1" sx={{ mb: 1, borderRadius: 'sm', overflow: 'hidden' }}>
                              <img
                                src={item.imageURL || '/placeholder-plant.jpg'}
                                alt={item.name}
                                style={{ objectFit: 'cover' }}
                              />
                            </AspectRatio>
                            <Typography level="body-xs" noWrap>
                              {item.name}
                            </Typography>
                          </Box>
                        ))}
                        {order.items.length > 3 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography level="body-sm">
                              +{order.items.length - 3} more
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Typography level="body-sm">No items data available</Typography>
                    )}
                  </Box>
                  
                  {/* Order Summary */}
                  <Box sx={{ flex: 1 }}>
                    <Typography level="body-sm" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Order Summary
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography level="body-sm">Subtotal:</Typography>
                      <Typography level="body-sm">${order.subtotal?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography level="body-sm">Shipping:</Typography>
                      <Typography level="body-sm">${order.shipping?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                      <Typography level="body-sm">Total:</Typography>
                      <Typography level="body-sm">${order.total?.toFixed(2) || '0.00'}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                {order.estimatedDelivery && (
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
                    <Typography level="body-sm">
                      Estimated Delivery: {formatDate(order.estimatedDelivery)}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography level="body-md" sx={{ p: 3, color: 'text.secondary', textAlign: 'center' }}>
          You haven't placed any orders yet.
        </Typography>
      )}
    </>
  );
};

export default OrdersList;