import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Button, Box, Snackbar, IconButton, Typography } from '@mui/joy'; // Import Button, Box, Snackbar from Joy UI
import ChatbotSheet from './component/Chatbot/ChatbotSheet'; // Import the new ChatbotSheet component
import { CartProvider } from './component/AllComp/CardContext'; // Ensure CartProvider is imported
import useUser from './AuthProtectedRoute/useUser'; // Ensure useUser is imported

import Navbar from './component/AllComp/Navbar';
import ProductCategories from './component/Home/MegaMenu';
import Footer from './component/Footer/Footer.jsx';
import { auth } from "./auth";
import { onAuthStateChanged } from "firebase/auth";
import ProtectedAdminRoute from './AuthProtectedRoute/ProtectedAdminRoute.jsx';
import LoadingPage from './component/AllComp/LoadingPage';
import { lazyWithLoading } from './component/AllComp/RouteTransition.jsx';
// Removed lucide-react imports for simpler implementation

// Regular imports for auth pages (no loading screen)
import Login from './component/Login/Login';
import Signup from './component/Login/Signup.jsx';
import CategoryExtractorTool from './component/Admin/CategoryExtractor.jsx';
import JSONProductLoader from './component/Admin/JSONProductLoader.jsx';
import SpecialProducts from './component/ProductList/SpecialProducts.jsx';
import ProductList from './component/ProductList/ProductList.jsx';
import CareGuides from './component/CareGuides/CareGuidesDashboard.jsx';
import GuideDetail from './component/CareGuides/GuidePage.jsx';
import CareGuideForm from './component/Admin/GuideForm.jsx';
import JSONGuideLoader from './component/Admin/JSONGuideLoader.jsx';
import CareGuideList from './component/Admin/CareGuideList.jsx';
import ProfileLayout from './component/Customer/ProfileLayout.jsx';
import ProfileInfo from './component/Customer/ProfileInfo.jsx';
import ProtectedUserRoute from './AuthProtectedRoute/ProtectedUserRoute.jsx';
import OrdersList from './component/Customer/OrderDetails.jsx';
import BillingInfo from './component/Customer/BillingInfo.jsx';
import AccountSettings from './component/Customer/AccountSettings.jsx';
import { MessageCircle, MessageCircleIcon } from 'lucide-react';
import { ChatBubble, ChatBubbleOutline, ChatBubbleOutlined } from '@mui/icons-material';

// Lazy load components to enable loading screen
const Home = lazyWithLoading(() => import('./component/Home/Home'));
const About = lazyWithLoading(() => import('./component/About/About.jsx'));
const ProductListPass = lazyWithLoading(() => import('./component/ProductList/ProductListPass.jsx'));
const TermsAndConditions = lazyWithLoading(() => import('./component/Footer/TermsAndConditions.jsx'));
const FAQSection = lazyWithLoading(() => import('./component/Footer/Faq.jsx'));
const PrivacyPolicy = lazyWithLoading(() => import('./component/Footer/PrivacyPolicy.jsx'));
const ContactInformation = lazyWithLoading(() => import('./component/Footer/Contact.jsx'));
const Checkout = lazyWithLoading(() => import('./component/Checkout/Checkout.jsx'));
const PaymentPage = lazyWithLoading(() => import('./component/Checkout/PlaceOrder.jsx'));
const ProfilePage = lazyWithLoading(() => import('./component/Customer/ProfilePage.jsx'));
const ProductDetails = lazyWithLoading(() => import('./component/ProductPage/ProductDetails.jsx'));
const ThankYou = lazyWithLoading(() => import('./component/Checkout/ThankYou.jsx'));

// Admin components
const AdminLayout = lazyWithLoading(() => import('./component/Admin/AdminLayout.jsx'));
const AdminDashboard = lazyWithLoading(() => import('./component/Admin/AdminDashboard.jsx'));
const AdminProductList = lazyWithLoading(() => import('./component/Admin/ProductList.jsx'));
const ProductForm = lazyWithLoading(() => import('./component/Admin/ProductForm.jsx'));
const UsersManagement = lazyWithLoading(() => import('./component/Admin/UsersManagement.jsx'));

// Global loading fallback for suspense
const GlobalLoadingFallback = () => <LoadingPage timeout={0} />;

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
      // Add a small delay to simulate loading authentication state
      setTimeout(() => setIsLoading(false), 500);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingPage timeout={0} />;
  }

  return (
    <Router>
      <Suspense fallback={<GlobalLoadingFallback />}>
        {/* Wrap AppContent with CartProvider to make useCart available */}
        <CartProvider>
          <AppContent isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
        </CartProvider>
      </Suspense>
    </Router>
  );
};

const AppContent = ({ isLoggedIn, setLoggedIn }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isProductsList = location.pathname.startsWith('/products?') || location.pathname.startsWith('/new-arrivals') || location.pathname.startsWith('/bestSelling') || location.pathname === '/products' || location.pathname.startsWith('/category') || location.pathname.startsWith('featured');
  
  
  // State for chatbot sheet visibility and snackbar messages
  const [openChat, setOpenChat] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { user } = useUser(); // Get user object from your useUser hook

  // Function to set snackbar message and open it
  const setaddtoCartSnack = (message) => {
    setSnackBarMessage(message);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    document.body.style.backgroundColor = isAuthPage ? '#0A4938' : '#fff';
  }, [isAuthPage]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar and Product Categories are not shown on auth/admin pages */}
      {!isAuthPage && !isAdminPage && <Navbar isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />}
      {!isAuthPage && !isAdminPage && <ProductCategories />}

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedAdminRoute component={AdminLayout} />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-product" element={<ProductForm />} />
          <Route path="product-list" element={<AdminProductList />} />
          <Route path="update-product/:productId" element={<ProductForm />} />
          <Route path="update-careguide/:guideId" element={<CareGuideForm />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="reports" element={<div>Reports Dashboard</div>} />
          <Route path="notifications" element={<div>Notifications Center</div>} />
          <Route path="settings" element={<div>Admin Settings</div>} />
          <Route path="category-extractor" element={<CategoryExtractorTool />} />
          <Route path="json-product-loader" element={<JSONProductLoader />} />
          <Route path="add-guide" element={<CareGuideForm />} />
          <Route path="json-guide-loader" element={<JSONGuideLoader />} />
          <Route path="guide-list" element={<CareGuideList />} />
        </Route>

        {/* Customer Pages */}
        <Route path="/account" element={<ProtectedUserRoute component={ProfileLayout} />}>
          <Route index element={<Navigate to="/account/profile" replace />} />
          <Route path="profile" element={<ProfileInfo />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="billing" element={<BillingInfo />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>

        {/* Auth Pages - No loading screen */}
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />

        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Product Listing pages */}
        <Route path='/category/:slug' element={<ProductListPass />} />
        <Route path='/category/' element={<ProductListPass />} />
        <Route path="products">
          {/* Product list with optional query parameters (category, subCategory, search) */}
          <Route index element={<ProductList initialCategory="All" />} />
          {/* Product detail page */}
          <Route path=":productId" element={<ProductDetails />} />
        </Route>
        <Route path="/new-arrivals" element={<SpecialProducts type="newArrival" />} />
        <Route path="/bestselling" element={<SpecialProducts type="bestSelling" />} />
        <Route path="/featured" element={<SpecialProducts type="featured" />} />


        {/* Direct product link (alternative route) */}
        <Route path="product/:productId" element={<ProductDetails />} />

        {/* Order Pages */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/placeorder" element={<PaymentPage />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* Terms and Conditions Pages */}
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/faq" element={<FAQSection />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<ContactInformation />} />
        <Route path="/care-guides" element={<CareGuides />} />
        <Route path="/care-guides/:id" element={<GuideDetail />} />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer is not shown on auth/admin pages */}
      {!isAuthPage && !isAdminPage && <Footer />}

      {/* Action Button to Open Chatbot */}
     {!isAuthPage && !isAdminPage && (
        <Button
          onClick={() => setOpenChat(true)}
          sx={{
            position: 'fixed',
            bottom: {
              xs: isProductsList ? 90 : 20, // Mobile: lift on product pages
              sm: 20, // Desktop: always normal position
            },
            right: 25,
            borderRadius: '50%',
            boxShadow: 'lg',
            zIndex: 999,
            background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
            color: 'white',
            minWidth: '60px',
            width: '60px',
            height: '60px',
            fontSize: '20px',
            fontWeight: 'bold',
           '&:hover': {
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease-in-out',
          }}
        >
          <ChatBubble/>
        </Button>
      )}

      {/* Chatbot Sheet Component */}
      <ChatbotSheet
        open={openChat}
        onClose={() => setOpenChat(false)}
        user={user} // Pass the user object to the chatbot
        setaddtoCartSnack={setaddtoCartSnack} // Pass the snackbar setter
      />

      {/* Snackbar for notifications (e.g., "Added to Cart!") */}
      <Snackbar
        variant="soft"
        color="success"
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        {snackBarMessage}
      </Snackbar>
    </Box>
  );
};

export default App;