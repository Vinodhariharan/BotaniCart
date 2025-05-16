import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './component/AllComp/Navbar';
import ProductCategories from './component/Home/MegaMenu';
import Footer from './component/Footer/Footer.jsx';
import { auth } from "./auth"; 
import { onAuthStateChanged } from "firebase/auth";
import ProtectedAdminRoute from './firebase/ProtectedAdminRoute.jsx';
import LoadingPage from './component/AllComp/LoadingPage';
import { lazyWithLoading } from './component/AllComp/RouteTransition.jsx';

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
        <AppContent isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
      </Suspense>
    </Router>
  );
};

const AppContent = ({ isLoggedIn, setLoggedIn }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    document.body.style.backgroundColor = isAuthPage ? '#0A4938' : '#fff';
  }, [isAuthPage]);

  return (
    <div>
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
          <Route path="category-extractor" element={<CategoryExtractorTool/>} />
          <Route path="json-product-loader" element={<JSONProductLoader/>} />
          <Route path="add-guide" element={<CareGuideForm/>} />
          <Route path="json-guide-loader" element={<JSONGuideLoader/>} />
          <Route path="guide-list" element={<CareGuideList/>} />
        </Route>

        {/* Customer Pages */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Auth Pages - No loading screen */}
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />

        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Product Listing pages */}
        <Route path='/category/:slug' element={<ProductListPass />} />
        <Route path='/category/' element={<ProductListPass />} />
        {/* <Route path="/products/:slug" element={<ProductDetails />} /> */}
        <Route path="/new-arrivals" element={<SpecialProducts type="newArrival" />} />
        <Route path="/bestselling" element={<SpecialProducts type="bestSelling" />} />
        <Route path="/featured" element={<SpecialProducts type="featured" />} />
        <Route path="products">
            {/* Product list with optional query parameters (category, subCategory, search) */}
            <Route index element={<ProductList initialCategory="All" />} />
            
            {/* Product detail page */}
            <Route path=":productId" element={<ProductDetails />} />
          </Route>
          
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
      
      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
};

export default App;