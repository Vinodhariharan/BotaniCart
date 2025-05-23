import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Input,
  CircularProgress
} from "@mui/joy";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../auth"; // Adjust the path based on your project structure
import { useOutletContext } from "react-router-dom";

const ProfileInfo = () => {
  // Get both the Firebase auth user and Firestore userData from outlet context
  const { user, userData, showSuccessMessage, setError } = useOutletContext();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    // Initialize form data with userData when it becomes available
    if (userData) {
      setUpdatedData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        email: userData.email || user?.email || ""
      });
    }
  }, [userData, user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
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
      
      setEditing(false);
      showSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If no userData available yet
  if (!userData && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography level="h3" sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif' }}>
        Profile Information
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ maxWidth: 600 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography level="h4" sx={{ fontFamily: 'League Spartan, sans-serif' }}>
            {updatedData.firstName ? `${updatedData.firstName} ${updatedData.lastName}'s Account` : "My Account"}
          </Typography>
          {userData?.role === "admin" && (
            <Typography level="body-sm" sx={{ color: 'primary.500', fontWeight: 'bold' }}>
              Admin Account
            </Typography>
          )}
        </Box>

        {/* Editable Fields */}
        <Typography level="title-md" sx={{ mt: 2 }}>
          Email:
        </Typography>
        <Input 
          name="email" 
          value={updatedData.email || user?.email || ""} 
          disabled 
          sx={{ 
            mb: 2,
            width: '100%',
            '--Input-radius': '8px',
          }} 
        />

        <Typography level="title-md">First Name:</Typography>
        <Input
          name="firstName"
          value={updatedData.firstName || ""}
          onChange={handleChange}
          disabled={!editing}
          sx={{ 
            mb: 2,
            width: '100%',
            '--Input-radius': '8px',
          }}
        />

        <Typography level="title-md">Last Name:</Typography>
        <Input
          name="lastName"
          value={updatedData.lastName || ""}
          onChange={handleChange}
          disabled={!editing}
          sx={{ 
            mb: 2,
            width: '100%',
            '--Input-radius': '8px',
          }}
        />

        <Typography level="title-md">Phone Number:</Typography>
        <Input
          name="phone"
          value={updatedData.phone || ""}
          onChange={handleChange}
          disabled={!editing}
          sx={{ 
            mb: 3,
            width: '100%',
            '--Input-radius': '8px',
          }}
        />

        {editing ? (
          <Box display="flex" gap={2} mt={2}>
            <Button 
              color="primary" 
              onClick={handleSave} 
              disabled={loading}
              sx={{ 
                borderRadius: 'md',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              {loading ? <CircularProgress size="sm" /> : "Save Changes"}
            </Button>
            <Button 
              variant="outlined" 
              color="neutral" 
              onClick={() => setEditing(false)}
              sx={{ 
                borderRadius: 'md',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button 
            variant="outlined" 
            onClick={handleEdit}
            sx={{ 
              mt: 2,
              borderRadius: 'md',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            Edit Profile
          </Button>
        )}
      </Box>
    </>
  );
};

export default ProfileInfo;
