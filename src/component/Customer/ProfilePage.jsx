import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Input,
  Sheet,
  List,
  ListItem,
  ListItemButton,
  Checkbox,
  FormControl,
  FormLabel,
  Switch,
  FormHelperText,
  Select,
  Option,
  Container,
  CircularProgress,
  Alert
} from "@mui/joy";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../auth"; // Adjust the path based on your project structure
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import OrdersList from "./OrderDetails";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [activeSection, setActiveSection] = useState("profile");
  const history = useNavigate();

  // Default notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    orderUpdates: true,
    promotions: true,
    newsletter: false
  });

  // Default billing information
  const [billingInfo, setBillingInfo] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    saveAsDefault: true,
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: ""
  });

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
        });
        setUpdatedData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          phone: userData.phone || "",
          email: userData.email || "",
        });
        
        // Set notification settings from user data if available
        if (userData.notificationSettings) {
          setNotificationSettings(userData.notificationSettings);
        }
        
        // Set billing info from user data if available
        if (userData.billingInfo) {
          setBillingInfo(userData.billingInfo);
        }
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
          };
          
          await setDoc(userRef, newUserData);
          setUser({
            uid: userId,
            ...newUserData
          });
          setUpdatedData(newUserData);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile information. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        // Redirect to login if not authenticated
        history("/login");
      }
    });

    return () => unsubscribe();
  }, [history]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleBillingInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingInfo({
      ...billingInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  // Show success message temporarily
  const showSuccessMessage = (message) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Handle profile update
  const handleSave = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const userRef = doc(db, "users", user.uid);
      
      // Update only specific fields to prevent overwriting other data
      const updatedFields = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        phone: updatedData.phone || null,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(userRef, updatedFields);

      // Update local state
      setUser({
        ...user,
        ...updatedFields
      });
      
      setEditing(false);
      showSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle billing info update
  const handleSaveBillingInfo = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const userRef = doc(db, "users", user.uid);
      
      await updateDoc(userRef, {
        billingInfo: billingInfo,
        updatedAt: new Date().toISOString(),
      });
      
      showSuccessMessage("Billing information saved successfully!");
    } catch (err) {
      console.error("Error updating billing info:", err);
      setError("Failed to update billing information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle notification settings update
  const handleSaveNotificationSettings = async () => {
    if (!user?.uid) return;
  
    try {
      setLoading(true);
      const userRef = doc(db, "users", user.uid);
      
      // Debug what's in the notification settings
      console.log("Notification settings to save:", notificationSettings);
      
      // Check for any invalid keys
      const validatedSettings = Object.entries(notificationSettings).reduce((acc, [key, value]) => {
        if (key.trim() !== '') {  // Make sure the key is not empty
          acc[key] = value;
        } else {
          console.error("Found empty key in notification settings");
        }
        return acc;
      }, {});
      
      await updateDoc(userRef, {
        notificationSettings: validatedSettings,
        updatedAt: new Date().toISOString(),
      });
      
      showSuccessMessage("Notification preferences updated successfully!");
    } catch (err) {
      console.error("Error updating notification settings:", err);
      setError("Failed to update notification settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If still loading initial data
  if (loading && !user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Box display="flex" minHeight="100vh">
        {/* Side Menu */}
        <Sheet
          variant="soft"
          sx={{
            width: 250,
            minHeight: "100vh",
            padding: 2,
          }}
        >
          <Typography level="h4" sx={{ textAlign: "center", mb: 2 }}>
            My Account
          </Typography>
          <List>
            <ListItem>
              <ListItemButton 
                selected={activeSection === "profile"}
                onClick={() => setActiveSection("profile")}
              >
                Profile
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton 
                selected={activeSection === "orders"}
                onClick={() => setActiveSection("orders")}
              >
                Orders
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton 
                selected={activeSection === "billing"}
                onClick={() => setActiveSection("billing")}
              >
                Billing Info
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton 
                selected={activeSection === "settings"}
                onClick={() => setActiveSection("settings")}
              >
                Account Settings
              </ListItemButton>
            </ListItem>
          </List>
        </Sheet>

        {/* Main Content Area */}
        <Box flex={1} p={3}>
          {/* Status Messages */}
          {error && (
            <Alert color="danger" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert color="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <>
              <Typography level="h3" mb={2}>
                Profile Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {user ? (
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography level="h4">
                      {user.firstName ? `${user.firstName} ${user.lastName}'s Account` : "My Account"}
                    </Typography>
                    {user.role === "admin" && (
                      <Typography level="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Admin Account
                      </Typography>
                    )}
                  </Box>

                  {/* Editable Fields */}
                  <Typography level="body1" sx={{ mt: 1 }}>
                    Email:
                  </Typography>
                  <Input name="email" value={user.email} disabled sx={{ mb: 2 }} />

                  <Typography level="body1">First Name:</Typography>
                  <Input
                    name="firstName"
                    value={updatedData.firstName || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    sx={{ mb: 2 }}
                  />

                  <Typography level="body1">Last Name:</Typography>
                  <Input
                    name="lastName"
                    value={updatedData.lastName || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    sx={{ mb: 2 }}
                  />

                  <Typography level="body1">Phone Number:</Typography>
                  <Input
                    name="phone"
                    value={updatedData.phone || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    sx={{ mb: 2 }}
                  />

                  {editing ? (
                    <Box display="flex" gap={2}>
                      <Button color="primary" onClick={handleSave} disabled={loading}>
                        {loading ? <CircularProgress size="sm" /> : "Save Changes"}
                      </Button>
                      <Button variant="outlined" color="neutral" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Button variant="outlined" onClick={handleEdit}>
                      Edit Profile
                    </Button>
                  )}
                </Box>
              ) : (
                <Typography>No profile information available</Typography>
              )}
            </>
          )}

          {/* Orders Section */}
          {activeSection === "orders" && (
            <>
              {/* <Typography level="h3" mb={2}>
                Order History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography level="body1">
                You haven't placed any orders yet.
              </Typography> */}
              <OrdersList userId={user.uid}></OrdersList>
              {/* We'll implement this in the future when orders are created */}
            </>
          )}

          {/* Billing Info Section */}
          {activeSection === "billing" && (
            <>
              <Typography level="h3" mb={2}>
                Billing Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ maxWidth: 600 }}>
                <Typography level="h4" mb={2}>
                  Shipping Address
                </Typography>
                
                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Address Line 1</FormLabel>
                  <Input
                    name="addressLine1"
                    value={billingInfo.addressLine1}
                    onChange={handleBillingInfoChange}
                    placeholder="Street address, apartment number"
                  />
                </FormControl>
                
                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Address Line 2</FormLabel>
                  <Input
                    name="addressLine2"
                    value={billingInfo.addressLine2}
                    onChange={handleBillingInfoChange}
                    placeholder="Suite, building, floor (optional)"
                  />
                </FormControl>
                
                <Box display="flex" gap={2} mb={2}>
                  <FormControl sx={{ flex: 1 }}>
                    <FormLabel>City</FormLabel>
                    <Input
                      name="city"
                      value={billingInfo.city}
                      onChange={handleBillingInfoChange}
                    />
                  </FormControl>
                  
                  <FormControl sx={{ flex: 1 }}>
                    <FormLabel>State/Province</FormLabel>
                    <Input
                      name="state"
                      value={billingInfo.state}
                      onChange={handleBillingInfoChange}
                    />
                  </FormControl>
                </Box>
                
                <Box display="flex" gap={2} mb={2}>
                  <FormControl sx={{ flex: 1 }}>
                    <FormLabel>Postal Code</FormLabel>
                    <Input
                      name="postalCode"
                      value={billingInfo.postalCode}
                      onChange={handleBillingInfoChange}
                    />
                  </FormControl>
                  
                  <FormControl sx={{ flex: 1 }}>
                    <FormLabel>Country</FormLabel>
                    <Select
                      name="country"
                      value={billingInfo.country}
                      onChange={(_, value) => 
                        setBillingInfo({...billingInfo, country: value})
                      }
                    >
                      <Option value="US">United States</Option>
                      <Option value="CA">Canada</Option>
                      <Option value="UK">United Kingdom</Option>
                      <Option value="AU">Australia</Option>
                      <Option value="IN">India</Option>
                    </Select>
                  </FormControl>
                </Box>
                
                <FormControl sx={{ mb: 4 }}>
                  <Checkbox
                    name="saveAsDefault"
                    checked={billingInfo.saveAsDefault}
                    onChange={handleBillingInfoChange}
                    label="Save as default shipping address"
                  />
                </FormControl>
                
                <Typography level="h4" mb={2}>
                  Payment Information
                </Typography>
                
                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Cardholder Name</FormLabel>
                  <Input
                    name="cardholderName"
                    value={billingInfo.cardholderName}
                    onChange={handleBillingInfoChange}
                    placeholder="Name as it appears on card"
                  />
                </FormControl>
                
                <FormControl sx={{ mb: 2 }}>
                  <FormLabel>Card Number</FormLabel>
                  <Input
                    name="cardNumber"
                    value={billingInfo.cardNumber}
                    onChange={handleBillingInfoChange}
                    placeholder="1234 5678 9012 3456"
                  />
                </FormControl>
                
                <Box display="flex" gap={2} mb={4}>
                  <FormControl sx={{ flex: 1 }}>
                    <FormLabel>Expiry Date</FormLabel>
                    <Input
                      name="expiryDate"
                      value={billingInfo.expiryDate}
                      onChange={handleBillingInfoChange}
                      placeholder="MM/YY"
                    />
                  </FormControl>
                  
                  <FormControl sx={{ flex: 1 }}>
                    <FormLabel>CVV</FormLabel>
                    <Input
                      name="cvv"
                      value={billingInfo.cvv}
                      onChange={handleBillingInfoChange}
                      placeholder="123"
                      type="password"
                    />
                  </FormControl>
                </Box>
                
                <Button 
                  variant="solid" 
                  color="primary" 
                  onClick={handleSaveBillingInfo}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size="sm" /> : "Save Billing Information"}
                </Button>
              </Box>
            </>
          )}

          {/* Account Settings Section */}
          {activeSection === "settings" && (
            <>
              <Typography level="h3" mb={2}>
                Account Settings
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ maxWidth: 600 }}>
                <Typography level="h4" mb={2}>
                  Communication Preferences
                </Typography>
                
                <FormControl sx={{ mb: 2 }} orientation="horizontal">
                  <div>
                    <FormLabel>Email Notifications</FormLabel>
                    <FormHelperText>Receive order updates and promotional content via email</FormHelperText>
                  </div>
                  <Switch
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                  />
                </FormControl>
                
                <FormControl sx={{ mb: 2 }} orientation="horizontal">
                  <div>
                    <FormLabel>SMS Notifications</FormLabel>
                    <FormHelperText>Receive text messages for order updates and delivery status</FormHelperText>
                  </div>
                  <Switch
                    name="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onChange={handleNotificationChange}
                  />
                </FormControl>
                
                <FormControl sx={{ mb: 2 }} orientation="horizontal">
                  <div>
                    <FormLabel>WhatsApp Notifications</FormLabel>
                    <FormHelperText>Get instant updates about your orders via WhatsApp</FormHelperText>
                  </div>
                  <Switch
                    name="whatsappNotifications"
                    checked={notificationSettings.whatsappNotifications}
                    onChange={handleNotificationChange}
                  />
                </FormControl>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography level="h4" mb={2}>
                  Notification Types
                </Typography>
                
                <FormControl sx={{ mb: 2 }}>
                  <Checkbox
                    name="orderUpdates"
                    checked={notificationSettings.orderUpdates}
                    onChange={handleNotificationChange}
                    label="Order Updates"
                  />
                  <FormHelperText sx={{ mt: 0, ml: 2 }}>
                    Receive notifications about order status, shipping, and delivery
                  </FormHelperText>
                </FormControl>
                
                <FormControl sx={{ mb: 2 }}>
                  <Checkbox
                    name="promotions"
                    checked={notificationSettings.promotions}
                    onChange={handleNotificationChange}
                    label="Promotions and Discounts"
                  />
                  <FormHelperText sx={{ mt: 0, ml: 2 }}>
                    Stay informed about special offers, seasonal sales, and exclusive discounts
                  </FormHelperText>
                </FormControl>
                
                <FormControl sx={{ mb: 4 }}>
                  <Checkbox
                    name="newsletter"
                    checked={notificationSettings.newsletter}
                    onChange={handleNotificationChange}
                    label="Plant Care Newsletter"
                  />
                  <FormHelperText sx={{ mt: 0, ml: 2 }}>
                    Receive monthly tips and guidance on caring for your plants
                  </FormHelperText>
                </FormControl>
                
                <Button 
                  variant="solid" 
                  color="primary" 
                  onClick={handleSaveNotificationSettings}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size="sm" /> : "Save Communication Preferences"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;