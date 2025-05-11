import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { 
  Container, 
  Sheet, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  Drawer, 
  IconButton, 
  Box, 
  Divider,
  Chip,
  Tooltip
} from '@mui/joy';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';

const MegaMenu = ({ compact, onItemClick }) => {
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleItemClick = (category) => {
    if (onItemClick) {
      onItemClick();
    }
    // Any additional logic you want to run when a category is clicked
  };

  // If compact prop is true, render a simplified version (used in mobile drawer)
  if (compact) {
    return (
      <Box sx={{ 
        width: '100%',
      }}>
        <List>
          {loading ? (
            // Simple loading state for compact view
            Array(5).fill(0).map((_, index) => (
              <ListItem key={`loading-${index}`}>
                <ListItemButton disabled sx={{ 
                  opacity: 0.7,
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.7 },
                    '50%': { opacity: 0.4 },
                    '100%': { opacity: 0.7 },
                  }
                }}>
                  Category {index + 1}
                </ListItemButton>
              </ListItem>
            ))
          ) : categories.length === 0 ? (
            <Typography level="body-sm" sx={{ p: 2, color: 'neutral.500' }}>
              No categories available
            </Typography>
          ) : (
            categories.map((category) => (
              <ListItem key={category.id}>
                <ListItemButton 
                  component={Link} 
                  to={`/category/${category.id}`}
                  onClick={() => handleItemClick(category)}
                  sx={{
                    borderRadius: 'md',
                    color: '#136c13',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(19, 108, 19, 0.08)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <CategoryIcon sx={{ mr: 1.5, fontSize: 18, opacity: 0.7 }} />
                  {category.name}
                  <KeyboardArrowRightIcon sx={{ ml: 'auto', fontSize: 18 }} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    );
  }

  // Default full version
  return (
    <Sheet
      className="megamenu-wrapper"
      sx={{
        backgroundColor: 'white',
        mb: 2,
        mt: 0,
        pt: 0,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
        width: '100%',
        zIndex: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Container>
        <nav aria-label="Category navigation">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Mobile Toggle Button */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between'
            }}>
              <Typography 
                level="title-md" 
                fontWeight="bold"
                sx={{ color: '#136c13', ml: 1 }}
              >
                Categories
              </Typography>
              <Tooltip title="Browse Categories" placement="right">
                <IconButton
                  size="md"
                  variant="soft"
                  color="primary"
                  onClick={handleDrawerToggle}
                  aria-label="Open categories menu"
                  sx={{ 
                    borderRadius: '50%',
                    bgcolor: 'rgba(19, 108, 19, 0.1)',
                    color: '#136c13',
                    '&:hover': {
                      bgcolor: 'rgba(19, 108, 19, 0.2)'
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Desktop Categories List */}
            <Box 
              className="content" 
              sx={{ 
                display: { xs: 'none', md: 'block' },
                width: '100%'
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
                <Typography 
                  level="title-sm" 
                  fontWeight="md"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: '#136c13',
                    whiteSpace: 'nowrap'
                  }}
                >
                  BROWSE CATEGORIES
                </Typography>
                
                <Divider orientation="vertical" />
                
                <List
                  className="category-links"
                  orientation="horizontal"
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 1,
                    overflowX: 'auto',
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                      height: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(19, 108, 19, 0.2)',
                      borderRadius: '10px',
                    }
                  }}
                >
                  {loading ? (
                    // Loading state for desktop
                    Array(5).fill(0).map((_, index) => (
                      <Chip
                        key={`loading-${index}`}
                        sx={{ 
                          opacity: 0.7,
                          animation: 'pulse 1.5s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.7 },
                            '50%': { opacity: 0.4 },
                            '100%': { opacity: 0.7 },
                          }
                        }}
                        variant="soft"
                      >
                        Category {index + 1}
                      </Chip>
                    ))
                  ) : categories.length === 0 ? (
                    <Typography level="body-sm" sx={{ color: 'neutral.500', ml: 2 }}>
                      No categories available
                    </Typography>
                  ) : (
                    categories.map((category) => (
                      <ListItem key={category.id} sx={{ width: 'auto', p: 0 }}>
                        <Tooltip title={`Browse ${category.name}`} placement="top">
                          <Chip
                            component={Link}
                            to={`/category/${category.id}`}
                            onClick={() => handleItemClick(category)}
                            variant="soft"
                            color="primary"
                            sx={{
                              borderRadius: '16px',
                              transition: 'all 0.2s ease',
                              color: '#136c13',
                              '&:hover': {
                                bgcolor: 'rgba(19, 108, 19, 0.15)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            {category.name}
                          </Chip>
                        </Tooltip>
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            </Box>
          </Box>
        </nav>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        anchor="left"
        size="sm"
        variant="plain"
        sx={{ display: { md: 'none' } }}
      >
        <Box sx={{ 
          width: 280, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}>
            <Typography 
              level="title-lg" 
              sx={{ 
                color: '#136c13', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Categories
            </Typography>
            <IconButton onClick={handleDrawerToggle} style={{margin:'10px'}} aria-label="Close categories menu">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 0 }}>
            <List>
              {loading ? (
                // Loading state for mobile drawer
                Array(8).fill(0).map((_, index) => (
                  <ListItem key={`loading-drawer-${index}`}>
                    <ListItemButton disabled sx={{ 
                      opacity: 0.7,
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.7 },
                        '50%': { opacity: 0.4 },
                        '100%': { opacity: 0.7 },
                      }
                    }}>
                      Category {index + 1}
                    </ListItemButton>
                  </ListItem>
                ))
              ) : categories.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100px' 
                }}>
                  <Typography level="body-md" sx={{ color: 'neutral.500' }}>
                    No categories available
                  </Typography>
                </Box>
              ) : (
                categories.map((category) => (
                  <ListItem key={category.id}>
                    <ListItemButton
                      component={Link}
                      to={`/category/${category.id}`}
                      onClick={() => handleItemClick(category)}
                      sx={{
                        borderRadius: 'md',
                        color: '#136c13',
                        transition: 'all 0.2s',
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(19, 108, 19, 0.08)',
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'space-between'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 1.5
                        }}>
                          <Typography level="body-md" fontWeight="md">
                            {category.name}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        </Box>
      </Drawer>
    </Sheet>
  );
};

export default MegaMenu;