import React, { useEffect, useState } from "react";
import { db } from "../../auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { 
  Box, 
  Typography,
  Button,
  Table,
  Sheet,
  Input,
  IconButton,
  Chip,
  Tooltip
} from "@mui/joy";
import { Search as SearchIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import CategoryExtractorTool from "./CategoryExtractor";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = await getDocs(collection(db, "users"));
      setUsers(usersCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "customer" ? "admin" : "customer";
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography level="h2">
          Users Management
        </Typography>
        <Button 
          variant="outlined" 
          color="neutral"
          startDecorator={<RefreshIcon />}
          onClick={fetchUsers}
        >
          Refresh
        </Button>
      </Box>

      <Input
        fullWidth
        placeholder="Search users by email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        startDecorator={<SearchIcon />}
        sx={{ mb: 3 }}
      />

      <Sheet 
        variant="outlined"
        sx={{ 
          borderRadius: 'md',
          overflow: 'auto',
          width: '100%'
        }}
      >
        <Table aria-label="users table" stickyHeader>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Email</th>
              <th style={{ width: '20%' }}>Role</th>
              <th style={{ width: '20%' }}>Registration Date</th>
              <th style={{ width: '20%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>
                    <Chip
                      variant="soft"
                      color={user.role === "admin" ? "primary" : "neutral"}
                      size="sm"
                    >
                      {user.role}
                    </Chip>
                  </td>
                  <td>
                    {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : "N/A"}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      color={user.role === "customer" ? "primary" : "warning"}
                      onClick={() => toggleRole(user.id, user.role)}
                    >
                      {user.role === "customer" ? "Promote to Admin" : "Demote to Customer"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
};

export default UsersManagement;