import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Switch,
  Checkbox,
  CircularProgress,
  Alert
} from "@mui/joy";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../auth"; // Adjust the path based on your project structure
import { useOutletContext } from 'react-router-dom';

const AccountSettings = () => {
  const { user, userData, showSuccessMessage, setError } = useOutletContext();

  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({});

  // Load notification settings when userData becomes available
  useEffect(() => {
    if (userData) {
      setNotificationSettings(userData.notificationSettings || {});
      setSettingsLoading(false);
    }
  }, [userData]);

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSaveNotificationSettings = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const userRef = doc(db, "users", user.uid);

      const validatedSettings = Object.entries(notificationSettings).reduce((acc, [key, value]) => {
        if (key.trim() !== '') {
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

  // Wait until settings are loaded
  if (settingsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography level="h3" sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif' }}>
        Account Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {success && (
        <Alert color="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ maxWidth: 600 }}>
        <Typography level="h4" sx={{ mb: 2, fontSize: '1.25rem' }}>
          Communication Preferences
        </Typography>

        <FormControl sx={{ mb: 2 }} orientation="horizontal">
          <div>
            <FormLabel>Email Notifications</FormLabel>
            <FormHelperText>Receive order updates and promotional content via email</FormHelperText>
          </div>
          <Switch
            name="emailNotifications"
            checked={!!notificationSettings.emailNotifications}
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
            checked={!!notificationSettings.smsNotifications}
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
            checked={!!notificationSettings.whatsappNotifications}
            onChange={handleNotificationChange}
          />
        </FormControl>

        <Divider sx={{ my: 3 }} />

        <Typography level="h4" sx={{ mb: 2, fontSize: '1.25rem' }}>
          Notification Types
        </Typography>

        <FormControl sx={{ mb: 2 }}>
          <Checkbox
            name="orderUpdates"
            checked={!!notificationSettings.orderUpdates}
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
            checked={!!notificationSettings.promotions}
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
            checked={!!notificationSettings.newsletter}
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
          sx={{
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: 'md'
            }
          }}
        >
          {loading ? <CircularProgress size="sm" /> : "Save Communication Preferences"}
        </Button>
      </Box>
    </>
  );
};

export default AccountSettings;
