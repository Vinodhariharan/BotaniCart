import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  IconButton,
  Sheet,
} from "@mui/joy";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingBag as ProductsIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Assessment as ReportsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  CategoryRounded,
  UploadFileRounded,
  DocumentScanner,
  Info,
  Home,
  HomeMax,
  HomeMini,
  House,
  Grass,
} from "@mui/icons-material";

const Sidebar = ({ open, onToggle, onLogout }) => {
  const location = useLocation();

  const expandedWidth = 240;
  const collapsedWidth = 72;

  const menuItems = [
    // { text: "Reports", icon: <ReportsIcon />, path: "/admin/reports" },
    // { text: "Notifications", icon: <NotificationsIcon />, path: "/admin/notifications" },
    // { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
     // Core functionality
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    
    // Products section
    { text: "Products", icon: <ProductsIcon />, path: "/admin/product-list" },
    { text: "Add Product", icon: <AddIcon />, path: "/admin/add-product" },
    { text: "Product JSON Uploader", icon: <UploadFileRounded />, path: "/admin/json-product-loader" },
    { text: "Category Extractor", icon: <CategoryRounded />, path: "/admin/category-extractor" },
    
    // Care Guides section
    { text: "CareGuide List", icon: <Grass />, path: "/admin/guide-list" },
    { text: "Add CareGuide", icon: <Info />, path: "/admin/add-guide" },
    { text: "Guide JSON Uploader", icon: <DocumentScanner />, path: "/admin/json-guide-loader" },
  ];

  return (
    <Sheet
      sx={{
        display: "flex",
        height: "100vh",
        position: "sticky",
        top: 0,
        width: open ? expandedWidth : collapsedWidth,
        transition: "width 0.2s ease",
        // background: "linear-gradient(135deg, #e0f7fa 0%, #c8e6c9 100%)",
        color: "#333",
        borderRight: "1px solid #ccc",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: expandedWidth }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            justifyContent: open ? "space-between" : "center",
            bgcolor: "#fff",
          }}
        >
          {open ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box>
                  <Box sx={{display:"flex"}}>
                  <img
                    src="/Untitled.png"
                    alt="BotaniCart Logo"
                    style={{
                      height: '30px',
                    }}
                  />
                  <Typography level="h2" sx={{ fontWeight: "bold", ml:'5px', color: "#333" }}>
                    BotaniCart
                  </Typography>
                  </Box>
                  <Typography level="body-sm" sx={{ color: "#000" }}>
                    Admin Panel
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={onToggle} size="sm" variant="plain" color="neutral">
                <ChevronLeftIcon />
              </IconButton>
            </>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <IconButton onClick={onToggle} size="sm" variant="plain" color="neutral">
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <ListDivider />

        <List
          size="sm"
          sx={{
            "--ListItem-radius": "8px",
            "--List-gap": "4px",
            mt: 2,
            px: 2,
          }}
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    justifyContent: open ? "flex-start" : "center",
                    px: open ? 0 : 0,
                    "&.Mui-selected": {
                      bgcolor: "#e0f7fa",
                      color: "#000",
                      "&:hover": {
                        bgcolor: "#c8e6c9",
                      },
                    },
                    "&:hover": {
                      bgcolor: "#e0f7fa50",
                    },
                  }}
                >
                  <ListItemDecorator
                    sx={{
                      color: isActive ? "#2e7d32" : "#333",
                      minWidth: open ? "auto" : "100%",
                      justifyContent: open ? "flex-start" : "center",
                    }}
                  >
                    {item.icon}
                  </ListItemDecorator>
                  {open && <ListItemContent sx={{ml:0.5}}>{item.text}</ListItemContent>}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Box sx={{ mt: "auto", px: 2 }}>
          <ListDivider sx={{ my: 2 }} />
          <ListItem>
            <ListItemButton
              onClick={onLogout}
              sx={{
                justifyContent: open ? "flex-start" : "center",
                "&:hover": {
                  bgcolor: "#c8e6c930",
                },
              }}
            >
              <ListItemDecorator
                sx={{
                  minWidth: open ? "auto" : "100%",
                  justifyContent: open ? "flex-start" : "center",
                  color: "#333  ",
                }}
              >
                <LogoutIcon />
              </ListItemDecorator>
              {open && <ListItemContent>Logout</ListItemContent>}
            </ListItemButton>
          </ListItem>
        </Box>
        <Box sx={{ mt: "auto", mb: 2, px: 2 }}>
          <ListDivider sx={{ my: 2 }} />
          <ListItem>
            <ListItemButton
              component={Link}
              to="/"
              sx={{
                justifyContent: open ? "flex-start" : "center",
                "&:hover": {
                  bgcolor: "#c8e6c930",
                },
              }}
            >
              <ListItemDecorator
                sx={{
                  minWidth: open ? "auto" : "100%",
                  justifyContent: open ? "flex-start" : "center",
                  color: "#005005",
                }}
              >
                <House />
              </ListItemDecorator>
              {open && <ListItemContent>Website</ListItemContent>}
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>
    </Sheet>
  );
};

export default Sidebar;