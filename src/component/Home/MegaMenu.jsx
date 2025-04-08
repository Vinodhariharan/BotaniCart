import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Container, Sheet, Typography, List, ListItem, ListItemButton, Drawer, IconButton, Box, Divider } from '@mui/joy';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const MegaMenu = () => {
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    fetchCategories();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Sheet
      className="wrapper"
      sx={{
        backgroundColor: 'white',
        boxShadow: 'sm', // Add a subtle shadow
        borderRadius: 'md', // Rounded corners
        p: 1, // Add some padding
        mb: 2, // Add some margin bottom
        mt: 0,
        pt:0
      }}
    >
      <Container>
        <nav>
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <div className="content" sx={{ display: { xs: 'none', md: 'block' } }}>
            <List
              className="links"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <div className="logo">
                <Typography level="body-lg" fontWeight="md">
                  Categories:
                </Typography>
              </div>
              <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} /> {/* Add divider */}
              {categories.map((category) => (
                <ListItem key={category.id}>
                  <Link to={`/category/${category.id}`} className="desktop-link">
                    <ListItemButton>{category.name}</ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </div>
        </nav>
      </Container>
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        anchor="left"
        size="sm"
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 250, p: 2, pt:0 }}>
          <List>
            {categories.map((category) => (
              <ListItem key={category.id}>
                <Link to={`/category/${category.id}`} style={{ textDecoration: 'none' }}>
                  <ListItemButton onClick={handleDrawerToggle}>
                    {category.name}
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Sheet>
  );
};

export default MegaMenu;