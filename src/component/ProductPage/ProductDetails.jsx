import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import { Link } from "react-router-dom";
import {
  AspectRatio,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardOverflow,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Sheet,
  Skeleton,
  Stack,
  Typography,
  Alert,
  Badge,
  Snackbar
} from "@mui/joy";
import {
  Home,
  ArrowBack,
  Add,
  Remove,
  WbSunny,
  Opacity,
  Speed,
  Build,
  LocalFlorist,
  Grass,
  ShoppingCart,
  ChevronRight
} from "@mui/icons-material";
import { useCart } from '../AllComp/CardContext';
import RelatedProducts from "./RelatedProducts.jsx";
import CartSnackbar from "../AllComp/CartSnackBar.jsx";
import useUser from "../../AuthProtectedRoute/useUser.js";

function ProductDetails() {
  const { productId } = useParams();
  const { isUser } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [productData, setProductData] = useState({
    title: '',
    imageSrc: '',
    price: '',
    description: '',
    link: '',
    category: '',
    subCategory: '',
    type: '',
    featured: false,
    newArrival: false,
    popular: false,
    details: {
      scientificName: '',
      sunlight: '',
      watering: '',
      growthRate: '',
      maintenance: '',
      bloomSeason: '',
      specialFeatures: '',
      toxicity: '',
      material: '',
      drainageHoles: false,
      size: '',
      color: '',
      useCase: ''
    },
    stock: {
      availability: true,
      quantity: ''
    }
  });
  const [addtoCartSnack, setaddtoCartSnack] = useState(''); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { addToCart } = useCart();

  // Add to Cart SnackBar
  useEffect(() => {
    if (addtoCartSnack) {
      setOpenSnackbar(true);
    }
  }, [addtoCartSnack]);
     
  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
    setaddtoCartSnack('');
  };

  useEffect(() => {
    const fetchProductFromFirebase = async () => {
      setLoading(true);
      setError(null);

      try {
        const productRef = doc(db, "products", productId);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProductData({ id: docSnap.id, ...docSnap.data() });
        } else {
          const productsQuery = query(
            collection(db, "products"),
            where("link", "==", productId)
          );

          const querySnapshot = await getDocs(productsQuery);

          if (!querySnapshot.empty) {
            const matchingDoc = querySnapshot.docs[0];
            setProductData({ id: matchingDoc.id, ...matchingDoc.data() });
          } else {
            setError("Product not found");
            console.error("Product not found!");
          }
        }
      } catch (error) {
        setError("Error fetching product details");
        console.error("Error fetching product: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductFromFirebase();
  }, [productId]);

  const handleAddToCart = () => {
    if(isUser){
      addToCart(productData, quantity);
      setaddtoCartSnack("Added to Cart!");
    } else {
      setaddtoCartSnack("Sign in to add plants to your garden collection");
      setTimeout(1000);
    }
  };

  const increaseQuantity = () => {
    if (quantity < productData.stock.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Function to render plant specific details
  const renderPlantDetails = () => {
    const { details } = productData;

    if (productData.category === 'plants' ||
      productData.category === 'flowers' ||
      productData.category === 'shrubs' ||
      productData.category === 'trees') {
      return (
        <Box sx={{ mt: 4 }}>
          {details.scientificName && (
            <Box sx={{ mb: 3, p: 3, bgcolor: 'background.level1', borderRadius: 'lg' }}>
              <Typography level="title-sm" sx={{ color: 'text.secondary', mb: 1 }}>
                Scientific Name
              </Typography>
              <Typography level="body-lg" fontWeight="md" fontStyle="italic">
                {details.scientificName}
              </Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid xs={12} sm={6} lg={3}>
              <Card 
                variant="plain" 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    boxShadow: 'sm',
                    borderColor: 'primary.200'
                  }
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 'md', 
                    bgcolor: 'warning.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48
                  }}>
                    <WbSunny sx={{ color: 'warning.500' }} />
                  </Box>
                  <Box>
                    <Typography level="title-sm" sx={{ mb: 1 }}>Sunlight</Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      {details.sunlight || "Not specified"}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <Card 
                variant="plain" 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    boxShadow: 'sm',
                    borderColor: 'primary.200'
                  }
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 'md', 
                    bgcolor: 'primary.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48
                  }}>
                    <Opacity sx={{ color: 'primary.500' }} />
                  </Box>
                  <Box>
                    <Typography level="title-sm" sx={{ mb: 1 }}>Watering</Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      {details.watering || "Not specified"}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <Card 
                variant="plain" 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    boxShadow: 'sm',
                    borderColor: 'primary.200'
                  }
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 'md', 
                    bgcolor: 'neutral.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48
                  }}>
                    <Speed sx={{ color: 'neutral.500' }} />
                  </Box>
                  <Box>
                    <Typography level="title-sm" sx={{ mb: 1 }}>Growth Rate</Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      {details.growthRate || "Not specified"}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid xs={12} sm={6} lg={3}>
              <Card 
                variant="plain" 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    boxShadow: 'sm',
                    borderColor: 'primary.200'
                  }
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 'md', 
                    bgcolor: 'success.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48
                  }}>
                    <Build sx={{ color: 'success.500' }} />
                  </Box>
                  <Box>
                    <Typography level="title-sm" sx={{ mb: 1 }}>Maintenance</Typography>
                    <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                      {details.maintenance || "Not specified"}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            {details.bloomSeason && (
              <Grid xs={12} sm={6}>
                <Card 
                  variant="plain" 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      boxShadow: 'sm',
                      borderColor: 'primary.200'
                    }
                  }}
                >
                  <Stack spacing={2}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 'md', 
                      bgcolor: 'danger.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48
                    }}>
                      <LocalFlorist sx={{ color: 'danger.500' }} />
                    </Box>
                    <Box>
                      <Typography level="title-sm" sx={{ mb: 1 }}>Bloom Season</Typography>
                      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        {details.bloomSeason}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            )}

            {details.specialFeatures && (
              <Grid xs={12} sm={6}>
                <Card 
                  variant="plain" 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      boxShadow: 'sm',
                      borderColor: 'primary.200'
                    }
                  }}
                >
                  <Stack spacing={2}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 'md', 
                      bgcolor: 'success.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48
                    }}>
                      <Grass sx={{ color: 'success.500' }} />
                    </Box>
                    <Box>
                      <Typography level="title-sm" sx={{ mb: 1 }}>Special Features</Typography>
                      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        {details.specialFeatures}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            )}
          </Grid>

          {details.toxicity && (
            <Alert 
              variant="soft" 
              color={details.toxicity.toLowerCase().includes('toxic') ? 'danger' : 'success'}
              sx={{ mt: 3 }}
            >
              <Typography level="title-sm">
                Toxicity: {details.toxicity}
              </Typography>
            </Alert>
          )}
        </Box>
      );
    }

    // For other product categories
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {details.material && (
          <Grid xs={12} sm={6}>
            <Box sx={{ p: 3, bgcolor: 'background.level1', borderRadius: 'lg' }}>
              <Typography level="title-sm" sx={{ mb: 1, color: 'text.secondary' }}>
                Material
              </Typography>
              <Typography level="body-md">{details.material}</Typography>
            </Box>
          </Grid>
        )}

        {details.size && (
          <Grid xs={12} sm={6}>
            <Box sx={{ p: 3, bgcolor: 'background.level1', borderRadius: 'lg' }}>
              <Typography level="title-sm" sx={{ mb: 1, color: 'text.secondary' }}>
                Size
              </Typography>
              <Typography level="body-md">{details.size}</Typography>
            </Box>
          </Grid>
        )}

        {details.color && (
          <Grid xs={12} sm={6}>
            <Box sx={{ p: 3, bgcolor: 'background.level1', borderRadius: 'lg' }}>
              <Typography level="title-sm" sx={{ mb: 1, color: 'text.secondary' }}>
                Color
              </Typography>
              <Typography level="body-md">{details.color}</Typography>
            </Box>
          </Grid>
        )}

        {details.useCase && (
          <Grid xs={12} sm={6}>
            <Box sx={{ p: 3, bgcolor: 'background.level1', borderRadius: 'lg' }}>
              <Typography level="title-sm" sx={{ mb: 1, color: 'text.secondary' }}>
                Use Case
              </Typography>
              <Typography level="body-md">{details.useCase}</Typography>
            </Box>
          </Grid>
        )}

        {details.drainageHoles !== undefined && (
          <Grid xs={12} sm={6}>
            <Box sx={{ p: 3, bgcolor: 'background.level1', borderRadius: 'lg' }}>
              <Typography level="title-sm" sx={{ mb: 1, color: 'text.secondary' }}>
                Drainage Holes
              </Typography>
              <Typography level="body-md">{details.drainageHoles ? 'Yes' : 'No'}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid xs={12} lg={7}>
            <Skeleton variant="rectangular" width="100%" height={500} sx={{ borderRadius: 'lg' }} />
          </Grid>
          <Grid xs={12} lg={5}>
            <Stack spacing={2}>
              <Skeleton variant="text" width="80%" height={40} />
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="rectangular" width="100%" height={120} />
              <Skeleton variant="rectangular" width="60%" height={50} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={3} alignItems="center">
          <Alert variant="soft" color="danger">
            {error}
          </Alert>
          <Button
            component={Link}
            to="/shop"
            variant="solid"
            color="primary"
            startDecorator={<ArrowBack />}
          >
            Return to Shop
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<ChevronRight fontSize="small" />}
        sx={{ mb: 4 }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Home sx={{ mr: 0.5 }} fontSize="sm" />
          Home
        </Link>
        <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
          Products
        </Link>
        {productData.category && (
          <Link to={`/category/${productData.category.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {productData.category}
          </Link>
        )}
        <Typography>{productData.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid xs={12} lg={7}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Card 
              variant="plain" 
              sx={{ 
                overflow: 'hidden', 
                bgcolor: 'background.level1',
                border: 'none'
              }}
            >
              <CardOverflow>
                {/* Badges Container */}
                <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                  <Stack spacing={1}>
                    {productData.popular && (
                      <Chip 
                        color="warning" 
                        size="sm"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Best Seller
                      </Chip>
                    )}
                    {productData.featured && (
                      <Chip 
                        color="primary" 
                        size="sm"
                        sx={{ fontWeight: 'bold' }}
                      >
                        Featured
                      </Chip>
                    )}
                    {productData.newArrival && (
                      <Chip 
                        color="success" 
                        size="sm"
                        sx={{ fontWeight: 'bold' }}
                      >
                        New Arrival
                      </Chip>
                    )}
                  </Stack>
                </Box>

                {/* Stock Badge */}
                {productData.stock && productData.stock.quantity < 10 && (
                  <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
                    <Chip color="danger" size="sm" sx={{ fontWeight: 'bold' }}>
                      Only {productData.stock.quantity} left!
                    </Chip>
                  </Box>
                )}

                <AspectRatio ratio="4/3" sx={{ minHeight: 400 }}>
                  <img
                    src={productData.imageSrc}
                    alt={productData.title}
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </AspectRatio>
              </CardOverflow>
            </Card>
          </Box>
        </Grid>

        {/* Product Information */}
        <Grid xs={12} lg={5}>
          <Stack spacing={3}>
            {/* Back Button */}
            <IconButton
              component={Link}
              to="/shop"
              variant="plain"
              size="sm"
              sx={{ alignSelf: 'flex-start' }}
            >
              <ArrowBack />
            </IconButton>

            {/* Product Title & Category */}
            <Box>
              <Typography 
                level="body-xs" 
                textTransform="uppercase" 
                sx={{ 
                  color: 'text.secondary', 
                  letterSpacing: '0.1em',
                  mb: 1 
                }}
              >
                {productData.category}
              </Typography>
              
              <Typography level="h2" component="h1" sx={{ mb: 2 }}>
                {productData.title}
              </Typography>

              {productData.details && productData.details.scientificName && (
                <Typography 
                  level="body-lg" 
                  fontStyle="italic" 
                  sx={{ color: 'text.secondary' }}
                >
                  {productData.details.scientificName}
                </Typography>
              )}
            </Box>

            {/* Price */}
            <Typography level="h3" color="primary" fontWeight="lg">
              ${productData.price}
            </Typography>

            {/* Description */}
            <Box sx={{ py: 2 }}>
              <Typography level="body-md" sx={{ lineHeight: 1.7 }}>
                {productData.description || "No description available for this product."}
              </Typography>
            </Box>

            {/* Status Chips */}
            {(productData.stock?.availability || productData.subCategory || productData.type) && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {productData.stock && productData.stock.availability ? (
                  <Chip color="success" variant="soft" size="sm">
                    In Stock
                  </Chip>
                ) : (
                  <Chip color="danger" variant="soft" size="sm">
                    Out of Stock
                  </Chip>
                )}

                {productData.subCategory && (
                  <Chip color="primary" variant="soft" size="sm">
                    {productData.subCategory}
                  </Chip>
                )}

                {productData.type && (
                  <Chip color="neutral" variant="soft" size="sm">
                    {productData.type}
                  </Chip>
                )}
              </Stack>
            )}

            {/* Quantity & Add to Cart */}
            <Card variant="outlined" sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography level="title-sm">Quantity</Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      variant="outlined"
                      size="sm"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography 
                      level="title-md" 
                      sx={{ 
                        minWidth: 40, 
                        textAlign: 'center',
                        py: 1,
                        px: 2,
                        bgcolor: 'background.level1',
                        borderRadius: 'sm'
                      }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton
                      variant="outlined"
                      size="sm"
                      onClick={increaseQuantity}
                      disabled={!productData.stock || quantity >= productData.stock.quantity}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                <Button
                  variant="solid"
                  color="success"
                  size="lg"
                  startDecorator={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={!productData.stock || !productData.stock.availability}
                  sx={{
                    py: 1.5,
                    borderRadius: 'md'
                  }}
                >
                  Add to Garden
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        {/* Product Details Section */}
        <Grid xs={12}>
          <Box sx={{ mt: 6 }}>
            <Typography level="h3" component="h2" sx={{ mb: 3 }}>
              Product Details
            </Typography>
            {renderPlantDetails()}
          </Box>
        </Grid>

        {/* Related Products Section */}
        <Grid xs={12}>
          <Box sx={{ mt: 8 }}>
            <Typography level="h3" component="h2" sx={{ mb: 4 }}>
              You May Also Like
            </Typography>
            <RelatedProducts 
              setaddtoCartSnack={setaddtoCartSnack} 
              category={productData.category} 
              currentProductId={productId} 
            />
          </Box>
        </Grid>
      </Grid>

      <CartSnackbar
        open={openSnackbar}
        message={addtoCartSnack}
        onClose={handleClose}
      />
    </Container>
  );
}

export default ProductDetails;