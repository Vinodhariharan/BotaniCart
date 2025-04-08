import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Divider,
  IconButton,
  Sheet,
  Button,
  Avatar,
  CircularProgress
} from "@mui/joy";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingBag as ProductsIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";
import UsersManagement from "./UsersManagement";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
// import Sidebar from "./SideBar";

// Firebase imports
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  Timestamp 
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { db,auth,app} from "../../firebaseConfig"
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

const drawerWidth = 0;

const AdminDashboard = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("Logged out successfully");
      navigate("/login");
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* <Sidebar open={open} onLogout={handleLogout} /> */}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin-left 0.3s",
          ml: { xs: 0, sm: open ? `${drawerWidth}px` : 0 },
          width: { xs: "100%", sm: `calc(100% - ${open ? drawerWidth : 0}px)` }
        }}
      >

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Box>
  );
};

// Dashboard home component with Firebase data
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Calculate month-over-month percentage change
  const [percentChanges, setPercentChanges] = useState({
    users: 0,
    products: 0,
    revenue: 0,
    orders: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch collection counts
        const usersSnapshot = await getDocs(collection(db, "users"));
        const productsSnapshot = await getDocs(collection(db, "products"));
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        
        // Calculate revenue from orders
        let totalRevenue = 0;
        ordersSnapshot.forEach(doc => {
          const order = doc.data();
          totalRevenue += order.totalAmount || 0;
        });
        
        // Set stats state
        setStats({
          totalUsers: usersSnapshot.size,
          totalProducts: productsSnapshot.size,
          totalRevenue: totalRevenue,
          totalOrders: ordersSnapshot.size
        });
        

        setPercentChanges({
          users: 15, // Example: would be calculated based on data
          products: 7,
          revenue: -2,
          orders: 12
        });
        
        // Fetch recent activities
        const activitiesQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        
        const userRegistrationsQuery = query(
          collection(db, "users"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        
        const productAdditionsQuery = query(
          collection(db, "products"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        
        const [
          recentOrdersSnapshot,
          recentUsersSnapshot,
          recentProductsSnapshot
        ] = await Promise.all([
          getDocs(activitiesQuery),
          getDocs(userRegistrationsQuery),
          getDocs(productAdditionsQuery)
        ]);
        
        // Build activities array
        const activities = [];
        
        recentUsersSnapshot.forEach(doc => {
          const user = doc.data();
          activities.push({
            type: "user",
            title: "New user registered",
            description: user.email || "New user",
            timestamp: user.createdAt || Timestamp.now()
          });
        });
        
        recentProductsSnapshot.forEach(doc => {
          const product = doc.data();
          activities.push({
            type: "product",
            title: "New product added",
            description: product.name || "New product",
            timestamp: product.createdAt || Timestamp.now()
          });
        });
        
        recentOrdersSnapshot.forEach(doc => {
          const order = doc.data();
          activities.push({
            type: "order",
            title: "Order completed",
            description: `Order #${doc.id.substring(0, 5)}`,
            timestamp: order.createdAt || Timestamp.now()
          });
        });
        
        // Sort activities by timestamp
        activities.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        
        setRecentActivities(activities);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="danger" level="h5">Error loading dashboard data</Typography>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  // Function to format time elapsed
  const formatTimeElapsed = (timestamp) => {
    if (!timestamp) return "Unknown";
    
    const now = new Date();
    const activityTime = timestamp.toDate();
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <Box>
      <Typography level="h2" sx={{ mb: 3 }}>
        Welcome to Admin Dashboard
      </Typography>
      
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 2 }}>
        <Sheet 
          variant="outlined" 
          sx={{ p: 2, borderRadius: "md" }}
        >
          <Typography level="title-md">Total Users</Typography>
          <Typography level="h2">{stats.totalUsers.toLocaleString()}</Typography>
          <Typography 
            level="body-sm" 
            sx={{ color: percentChanges.users >= 0 ? "success.500" : "danger.500" }}
          >
            {percentChanges.users >= 0 ? "+" : ""}{percentChanges.users}% from last month
          </Typography>
        </Sheet>
        
        <Sheet 
          variant="outlined" 
          sx={{ p: 2, borderRadius: "md" }}
        >
          <Typography level="title-md">Total Products</Typography>
          <Typography level="h2">{stats.totalProducts.toLocaleString()}</Typography>
          <Typography 
            level="body-sm" 
            sx={{ color: percentChanges.products >= 0 ? "success.500" : "danger.500" }}
          >
            {percentChanges.products >= 0 ? "+" : ""}{percentChanges.products}% from last month
          </Typography>
        </Sheet>
        
        <Sheet 
          variant="outlined" 
          sx={{ p: 2, borderRadius: "md" }}
        >
          <Typography level="title-md">Revenue</Typography>
          <Typography level="h2">${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography>
          <Typography 
            level="body-sm" 
            sx={{ color: percentChanges.revenue >= 0 ? "success.500" : "danger.500" }}
          >
            {percentChanges.revenue >= 0 ? "+" : ""}{percentChanges.revenue}% from last month
          </Typography>
        </Sheet>
        
        <Sheet 
          variant="outlined" 
          sx={{ p: 2, borderRadius: "md" }}
        >
          <Typography level="title-md">Orders</Typography>
          <Typography level="h2">{stats.totalOrders.toLocaleString()}</Typography>
          <Typography 
            level="body-sm" 
            sx={{ color: percentChanges.orders >= 0 ? "success.500" : "danger.500" }}
          >
            {percentChanges.orders >= 0 ? "+" : ""}{percentChanges.orders}% from last month
          </Typography>
        </Sheet>
      </Box>
      
      <Typography level="h3" sx={{ mt: 4, mb: 2 }}>
        Recent Activities
      </Typography>
      
      <Sheet variant="outlined" sx={{ p: 2, borderRadius: "md" }}>
        {recentActivities.length > 0 ? (
          <List>
            {recentActivities.map((activity, index) => (
              <ListItem key={index}>
                <ListItemContent>
                  <Typography level="title-sm">{activity.title}</Typography>
                  <Typography level="body-sm">{activity.description}</Typography>
                </ListItemContent>
                <Typography level="body-xs">
                  {formatTimeElapsed(activity.timestamp)}
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography level="body-md" sx={{ p: 2 }}>No recent activities found.</Typography>
        )}
      </Sheet>
    </Box>
  );
};

// Settings component
const Settings = () => {
  return (
    <Box>
      <Typography level="h2" sx={{ mb: 3 }}>
        Settings
      </Typography>
      <Sheet variant="outlined" sx={{ p: 3, borderRadius: "md" }}>
        <Typography level="h4" sx={{ mb: 2 }}>General Settings</Typography>
        <Typography level="body-md">
          This is the settings page. You can add your settings controls here.
        </Typography>
      </Sheet>
    </Box>
  );
};

export default AdminDashboard;