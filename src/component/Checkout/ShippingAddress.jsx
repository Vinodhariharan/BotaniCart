import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Divider, 
  Button, 
  Stack, 
  TextField, 
  Checkbox 
} from '@mui/joy';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ShippingAddress = ({ user, setUser }) => {
  const [editMode, setEditMode] = useState(false);
  const [addressForm, setAddressForm] = useState({
    addressLine1: user?.billingInfo?.addressLine1 || '',
    addressLine2: user?.billingInfo?.addressLine2 || '',
    city: user?.billingInfo?.city || '',
    state: user?.billingInfo?.state || '',
    postalCode: user?.billingInfo?.postalCode || '',
    country: user?.billingInfo?.country || 'US',
    saveAsDefault: user?.billingInfo?.saveAsDefault || true
  });
  const [error, setError] = useState(null);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    setAddressForm(prev => ({
      ...prev,
      saveAsDefault: e.target.checked
    }));
  };

  const handleAddressSubmit = async () => {
    try {
      // Update the user's address in Firebase
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        ...user,
        billingInfo: {
          ...addressForm
        }
      }, { merge: true });
      
      // Update local state
      setUser(prev => ({
        ...prev,
        billingInfo: {
          ...addressForm
        }
      }));
      
      setEditMode(false);
    } catch (err) {
      console.error("Error updating address:", err);
      setError("Failed to update address. Please try again.");
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center">
          <LocationOnIcon sx={{ mr: 1 }} />
          <Typography level="h5">Shipping Address</Typography>
        </Stack>
        <Button 
          variant="plain" 
          size="sm"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Cancel' : 'Edit'}
        </Button>
      </Stack>
      <Divider />

      {error && (
        <Typography color="danger" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!editMode ? (
        <Box sx={{ py: 2 }}>
          <Typography fontWeight="bold">{user?.firstName} {user?.lastName}</Typography>
          <Typography>{user?.billingInfo?.addressLine1}</Typography>
          {user?.billingInfo?.addressLine2 && (
            <Typography>{user?.billingInfo?.addressLine2}</Typography>
          )}
          {user?.billingInfo?.city && (
            <Typography>
              {user?.billingInfo?.city}, {user?.billingInfo?.state} {user?.billingInfo?.postalCode}
            </Typography>
          )}
          <Typography>{user?.billingInfo?.country}</Typography>
          {user?.phone && <Typography sx={{ mt: 1 }}>{user?.phone}</Typography>}
          <Typography>{user?.email}</Typography>
        </Box>
      ) : (
        <Box component="form" sx={{ py: 2 }}>
          <Stack spacing={2}>
            <TextField
              name="addressLine1"
              label="Address Line 1"
              value={addressForm.addressLine1}
              onChange={handleAddressChange}
              size="sm"
              required
            />
            <TextField
              name="addressLine2"
              label="Address Line 2"
              value={addressForm.addressLine2}
              onChange={handleAddressChange}
              size="sm"
            />
            <Stack direction="row" spacing={1}>
              <TextField
                name="city"
                label="City"
                value={addressForm.city}
                onChange={handleAddressChange}
                size="sm"
                fullWidth
                required
              />
              <TextField
                name="state"
                label="State"
                value={addressForm.state}
                onChange={handleAddressChange}
                size="sm"
                fullWidth
                required
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                name="postalCode"
                label="Postal Code"
                value={addressForm.postalCode}
                onChange={handleAddressChange}
                size="sm"
                fullWidth
                required
              />
              <TextField
                name="country"
                label="Country"
                value={addressForm.country}
                onChange={handleAddressChange}
                size="sm"
                fullWidth
                required
              />
            </Stack>
            <Box>
              <Checkbox 
                checked={addressForm.saveAsDefault}
                onChange={handleCheckboxChange}
              />
              <Typography level="body-sm" sx={{ ml: 1, display: 'inline' }}>
                Save as default address
              </Typography>
            </Box>
            <Button onClick={handleAddressSubmit} color="primary">
              Save Address
            </Button>
          </Stack>
        </Box>
      )}
    </Card>
  );
};

export default ShippingAddress;