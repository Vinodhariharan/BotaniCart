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
  Grid,
} from "@mui/joy";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { getProductDetails } from "../../firebase/firestore"; // Import the function
import { ProductItem } from "../AllComp/ProductItem"; // Ensure correct import

const OrdersList = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), where("userId", "==", userId));
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
  }, [userId]);

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
    setLoadingProducts(false);
  };

  return (
    <Container>
      <Typography level="h3" mb={2}>Order History</Typography>
      <Divider sx={{ mb: 2 }} />
      {loading ? (
        <CircularProgress />
      ) : orders.length === 0 ? (
        <Typography level="body1">You haven't placed any orders yet.</Typography>
      ) : (
        <Box display="grid" gap={2}>
          {orders.map((order) => (
            <Card key={order.id} variant="outlined">
              <CardContent>
                <Typography level="h4">Order #{order.orderNumber}</Typography>
                <Typography level="body2">Date: {new Date(order.orderDate).toLocaleDateString()}</Typography>
                <Typography level="body2">Status: {order.status}</Typography>
                <Typography level="body2">Total: ${order.pricing.grandTotal.toFixed(2)} {order.pricing.currency}</Typography>
                <Typography level="body2">Payment Status: {order.paymentDetails.paymentStatus}</Typography>
                <Typography level="body2">Shipping: {order.tracking.carrier || "Not Available"}</Typography>
                <Button onClick={() => handleOpen(order)} sx={{ mt: 1 }}>View Details</Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog sx={{ maxWidth: 800, width: "90%", padding: 3 }}>
            <Typography level="h3" mb={2}>Order Details</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {/* Grid Layout: Left - Order Items, Right - Order Details */}
            <Grid container spacing={2}>
              {/* Left: Ordered Items */}
              <Grid xs={12} md={6}>
                <Typography level="h4" mb={2}>Ordered Items</Typography>
                {loadingProducts ? (
                  <CircularProgress />
                ) : (
                  selectedOrder.items.map((item) =>
                    productDetails[item.productId] ? (
                      <ProductItem key={item.productId} product={productDetails[item.productId]} />
                    ) : (
                      <Typography key={item.productId} level="body2">Product details unavailable</Typography>
                    )
                  )
                )}
              </Grid>

              {/* Right: Order Details */}
              <Grid xs={12} md={6}>
                <Typography level="body1"><strong>Order Number:</strong> {selectedOrder.orderNumber}</Typography>
                <Typography level="body1"><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</Typography>
                <Typography level="body1"><strong>Total:</strong> ${selectedOrder.pricing.grandTotal.toFixed(2)} {selectedOrder.pricing.currency}</Typography>
                <Typography level="body1"><strong>Payment Method:</strong> {selectedOrder.paymentDetails.paymentMethod}</Typography>
                <Typography level="body1"><strong>Payment Status:</strong> {selectedOrder.paymentDetails.paymentStatus}</Typography>
                <Typography level="body1">
                  <strong>Shipping Address:</strong> {selectedOrder.shippingAddress.fullName}, {selectedOrder.shippingAddress.addressLine1}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.country}
                </Typography>
              </Grid>
            </Grid>

            <Button variant="solid" color="primary" onClick={() => setOpen(false)} sx={{ mt: 2, display: "block", mx: "auto" }}>
              Close
            </Button>
          </ModalDialog>
        </Modal>
      )}
    </Container>
  );
};

export default OrdersList;
