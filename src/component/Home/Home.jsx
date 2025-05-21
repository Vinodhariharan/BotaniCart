import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import CardSlider from '../AllComp/CardSlider';
import { Link } from 'react-router-dom';

// JoyUI Imports
import { CssVarsProvider } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardCover from '@mui/joy/CardCover';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Container from '@mui/joy/Container';
import CircularProgress from '@mui/joy/CircularProgress';
import Sheet from '@mui/joy/Sheet';
import ArrowForward from '@mui/icons-material/ArrowForward';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Spa from '@mui/icons-material/Spa';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import { Grass, LocalMall } from '@mui/icons-material';
import FeaturedPlantGuides from '../CareGuides/FeaturedCareGuides';
import { Alert, Chip, Snackbar } from '@mui/joy';
import CartSnackbar from '../AllComp/CartSnackBar';

const HomePage = () => {
  const [featuredPlants, setFeaturedPlants] = useState([]);
  const [popularPlants, setPopularPlants] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [addtoCartSnack, setaddtoCartSnack] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // If user is logged in, fetch their cart
      if (currentUser) {
        fetchUserCart(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (addtoCartSnack) {
      setOpenSnackbar(true);
    }
  }, [addtoCartSnack]);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;

    setOpenSnackbar(false);
    setaddtoCartSnack(''); // or setAddToCartSnack(null);
  };

  function toTitle(str) {
    // Handle edge cases - return empty string if input is falsy
    if (!str) return '';

    // Split the string into an array of words, map over each word
    return str
      .toLowerCase()
      .split(' ')
      .map(word => {
        // Skip empty strings
        if (word.length === 0) return '';
        // Capitalize the first letter and join with the rest of the word
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch featured plants (plants with featured flag) - limit to 8
        const featuredQuery = query(
          collection(db, 'products'),
          where('featured', '==', true),
          // limit(8)
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        const featuredData = featuredSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedPlants(featuredData);
        // Fetch popular plants (based on ratings or sales) - limit to 8
        const popularQuery = query(
          collection(db, 'products'),
          where('popular', '==', true),
          // orderBy('rating', 'desc'),
          // limit(8)
        );
        const popularSnapshot = await getDocs(popularQuery);
        const popularData = popularSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPopularPlants(popularData);
        // Fetch new arrivals - limit to 8
        const newArrivalsQuery = query(
          collection(db, "products"),
          where("newArrival", "==", true),
          // limit(8) // Restrict to 8 items for efficiency
        );

        const newArrivalsSnapshot = await getDocs(newArrivalsQuery);
        const newArrivalsData = newArrivalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewArrivals(newArrivalsData);
        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchUserCart = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setCartItems(userData.cart || []);
      }
    } catch (error) {
      console.error("Error fetching user cart: ", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size="lg" />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          borderRadius: 'lg',
          overflow: 'hidden',
          my: 4,
        }}
      >
        <Card variant="outlined" sx={{
          bgcolor: 'background.level1',
          minHeight: 550,
          boxShadow: 'lg'
        }}>
          <CardContent sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
            p: { xs: 4, md: 6 },
            zIndex: 1
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography level="h1" sx={{ fontSize: 55, mb: 2, color: '#333' }}>
                Bring Nature Indoors
              </Typography>
              <Typography sx={{ mb: 4, color: 'success.700' }}>
                Discover our hand-picked selection of premium plants for your home or office
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/products"
                  size="lg"
                  color="success"
                >
                  Shop All Plants
                </Button>
                <Button
                  component={Link}
                  to="/care-guides"
                  size="lg"
                  variant="outlined"
                  color="primary"
                >
                  Plant Care Guides
                </Button>
              </Box>
            </Box>
            <AspectRatio
              ratio="16/12"
              sx={{
                minWidth: { xs: '100%', md: '50%' },
                borderRadius: 'md',
                overflow: 'hidden'
              }}
            >
              <img
                src="https://www.ikea.cn/images/03/5f/035f4164cc692fd1e56caa28e3e1eedf.jpg?f=l"
                alt="Beautiful indoor plants"
                loading="lazy"
              />
            </AspectRatio>
          </CardContent>
          <Box
            sx={{
              position: 'absolute',
              bottom: '-10%',
              right: '-5%',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              bgcolor: 'success.100',
              opacity: 0.6,
              zIndex: 0
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '-10%',
              left: '-5%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              bgcolor: 'success.100',
              opacity: 0.6,
              zIndex: 0
            }}
          />
        </Card>
      </Box>

      {/* Categories Section */}
      <Box component="section" sx={{ my: 6 }}>
        <Typography level="h2" sx={{ mb: 3 }}>
          Browse by Category
        </Typography>
        <Grid container spacing={2}>
          {categories.map(category => (
            (
              <Grid key={category.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  component={Link}
                  to={`/category/${category.name}`}
                  variant="outlined"
                  sx={{
                    height: { xs: 160, sm: 200, md: 220 },
                    textDecoration: 'none',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    border: '1px solid',
                    borderColor: 'neutral.200',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 'lg',
                      borderColor: 'transparent',
                      '& .category-image': {
                        transform: 'scale(1.1)'
                      },
                      '& .category-overlay': {
                        background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.2) 60%)'
                      },
                      '& .category-details': {
                        transform: 'translateY(-5px)'
                      },
                      '& .category-count': {
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    }
                  }}
                >
                  {/* Product count chip */}
                  {category.count && (
                    <Chip
                      size="sm"
                      variant="soft"
                      color="primary"
                      startDecorator={<LocalMall fontSize="medium" />}
                      sx={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 2,
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        backdropFilter: 'blur(4px)',
                        color: 'text.primary',
                        fontSize: '0.75rem'
                      }}
                    >
                      {category.count}
                    </Chip>
                  )}

                  <CardCover>
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      loading="lazy"
                      className="category-image"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                      }}
                    />
                  </CardCover>

                  <CardCover
                    className="category-overlay"
                    sx={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15) 50%, rgba(0,0,0,0))',
                      transition: 'background 0.3s ease'
                    }}
                  />

                  <CardContent
                    sx={{
                      justifyContent: 'flex-end',
                      textAlign: 'center',
                      gap: 0.5,
                      p: { xs: 1.5, sm: 2 }
                    }}
                  >
                    <Box
                      className="category-details"
                      sx={{
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <Typography
                        level="title-lg"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                          mb: 0.5,
                          lineHeight: 1.2
                        }}
                      >
                        {toTitle(category.name)}
                      </Typography>

                      {category.description && (
                        <Typography
                          level="body-sm"
                          className="category-count"
                          sx={{
                            color: 'rgba(255,255,255,0.85)',
                            maxWidth: '85%',
                            mx: 'auto',
                            opacity: 0,
                            transform: 'translateY(8px)',
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                            display: { xs: 'none', sm: 'block' }
                          }}
                        >
                          {category.description}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          ))}
        </Grid>
      </Box>

      {/* Featured Plants Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography level="h2">Featured Plants</Typography>
        <Button
          component={Link}
          to="/featured"
          variant="plain"
          color="success"
          endDecorator={<ArrowForward />}
        >
          View All
        </Button>
      </Box>
      <CardSlider setaddtoCartSnack={setaddtoCartSnack} products={featuredPlants} user={user} />

      <FeaturedPlantGuides />

      {/* Best Sellers Section */}
      <Box component="section" sx={{ my: 6 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography level="h2">Best Sellers</Typography>
          <Button
            component={Link}
            to="/bestSelling"
            variant="plain"
            color="success"
            endDecorator={<ArrowForward />}
          >
            View All
          </Button>
        </Box>
        <CardSlider setaddtoCartSnack={setaddtoCartSnack} products={popularPlants} user={user} />
      </Box>

      {/* New Arrivals Section */}
      <Box component="section" sx={{ my: 6 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography level="h2">New Arrivals</Typography>
          <Button
            component={Link}
            to="/new-arrivals"
            variant="plain"
            color="success"
            endDecorator={<ArrowForward />}
          >
            View All
          </Button>
        </Box>
        <CardSlider setaddtoCartSnack={setaddtoCartSnack} products={newArrivals} user={user} />
      </Box>

      {/* Benefits Section  */}
      <Card component="section" sx={{ my: 6, p: 4 }}>
        <Typography level="h2" sx={{ mb: 4, textAlign: 'center' }}>
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Sheet
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'success.100'
                }}
              >
                <VerifiedUser sx={{ fontSize: 30, color: 'success.600' }} />
              </Sheet>
              <Typography level="title-lg" sx={{ mb: 1 }}>
                Quality Guaranteed
              </Typography>
              <Typography level="body-md" sx={{ color: 'neutral.600' }}>
                30-day plant health guarantee on all purchases
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Sheet
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'success.100'
                }}
              >
                <LocalShipping sx={{ fontSize: 30, color: 'success.600' }} />
              </Sheet>
              <Typography level="title-lg" sx={{ mb: 1 }}>
                Free Shipping
              </Typography>
              <Typography level="body-md" sx={{ color: 'neutral.600' }}>
                On orders over $50 within the continental US and India
              </Typography>
            </Box>
          </Grid>
          <Grid xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Sheet
                sx={{
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'success.100'
                }}
              >
                <Spa sx={{ fontSize: 30, color: 'success.600' }} />
              </Sheet>
              <Typography level="title-lg" sx={{ mb: 1 }}>
                Expert Plant Advice
              </Typography>
              <Typography level="body-md" sx={{ color: 'neutral.600' }}>
                Care guides included with every purchase
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Newsletter Section */}
      {/* <Card 
          variant="outlined" 
          sx={{ 
            my: 6, 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'success.50',
            border: '1px dashed',
            borderColor: 'success.300'
          }}
        >
            <Typography level="h2" sx={{ mb: 2 }}>
            Join Our Green Community
          </Typography>
          <Typography sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Subscribe to our newsletter for exclusive offers, plant care tips, and early access to new arrivals.
          </Typography>
          <Box 
            component="form" 
            sx={{ 
              display: 'flex', 
              gap: 1, 
              maxWidth: 500, 
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' } 
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              style={{ 
                flex: 1, 
                padding: '10px 16px', 
                borderRadius: '8px',
                border: '1px solid #d0d5dd',
                fontSize: '1rem'
              }}
            />
            <Button color="success" size="lg">
              Subscribe
            </Button>
             <CartSnackbar
        open={openSnackbar}
        message={addtoCartSnack}
        onClose={handleClose}
      />
          </Box>
        </Card> */}
    </Container>
  );
};

export default HomePage;