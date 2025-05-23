import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Select,
  Option,
  CircularProgress
} from "@mui/joy";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../auth"; // Adjust path if needed
import { useOutletContext } from "react-router-dom";

const BillingInfo = () => {
  const { user, userData, showSuccessMessage, setError } = useOutletContext();

  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const [billingInfo, setBillingInfo] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    saveAsDefault: true,
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  useEffect(() => {
    if (userData) {
      if (userData.billingInfo) {
        setBillingInfo(userData.billingInfo);
      }
      setSettingsLoading(false);
    }
  }, [userData]);

  const handleBillingInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingInfo({
      ...billingInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

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

  if (settingsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography level="h3" sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif' }}>
        Billing Information
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ maxWidth: 600 }}>
        <Typography level="h4" sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif' }}>
          Shipping Address
        </Typography>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Address Line 1</FormLabel>
          <Input
            name="addressLine1"
            value={billingInfo.addressLine1}
            onChange={handleBillingInfoChange}
            placeholder="Street address, apartment number"
            sx={{ '--Input-radius': '8px' }}
          />
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Address Line 2</FormLabel>
          <Input
            name="addressLine2"
            value={billingInfo.addressLine2}
            onChange={handleBillingInfoChange}
            placeholder="Suite, building, floor (optional)"
            sx={{ '--Input-radius': '8px' }}
          />
        </FormControl>

        <Box display="flex" gap={2} mb={2}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>City</FormLabel>
            <Input
              name="city"
              value={billingInfo.city}
              onChange={handleBillingInfoChange}
              sx={{ '--Input-radius': '8px' }}
            />
          </FormControl>

          <FormControl sx={{ flex: 1 }}>
            <FormLabel>State/Province</FormLabel>
            <Input
              name="state"
              value={billingInfo.state}
              onChange={handleBillingInfoChange}
              sx={{ '--Input-radius': '8px' }}
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
              sx={{ '--Input-radius': '8px' }}
            />
          </FormControl>

          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Country</FormLabel>
            <Select
              name="country"
              value={billingInfo.country}
              onChange={(_, value) =>
                setBillingInfo({ ...billingInfo, country: value })
              }
              sx={{ '--Select-radius': '8px' }}
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

        <Typography level="h4" sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif' }}>
          Payment Information
        </Typography>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Cardholder Name</FormLabel>
          <Input
            name="cardholderName"
            value={billingInfo.cardholderName}
            onChange={handleBillingInfoChange}
            placeholder="Name as it appears on card"
            sx={{ '--Input-radius': '8px' }}
          />
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Card Number</FormLabel>
          <Input
            name="cardNumber"
            value={billingInfo.cardNumber}
            onChange={handleBillingInfoChange}
            placeholder="1234 5678 9012 3456"
            sx={{ '--Input-radius': '8px' }}
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
              sx={{ '--Input-radius': '8px' }}
            />
          </FormControl>

          <FormControl sx={{ flex: 1 }}>
            <FormLabel>CVV</FormLabel>
            <Input
              name="cvv"
              type="password"
              value={billingInfo.cvv}
              onChange={handleBillingInfoChange}
              placeholder="123"
              sx={{ '--Input-radius': '8px' }}
            />
          </FormControl>
        </Box>

        <Button
          variant="solid"
          color="primary"
          onClick={handleSaveBillingInfo}
          disabled={loading}
          sx={{
            borderRadius: 'md',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}
        >
          {loading ? <CircularProgress size="sm" /> : "Save Billing Information"}
        </Button>
      </Box>
    </>
  );
};

export default BillingInfo;
