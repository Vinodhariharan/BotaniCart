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
import RelatedProducts from "../AllComp/RelatedProducts.jsx";
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
    featured: false,    // Add these three badge fields
    newArrival: false,  // instead of a single badge field
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

  //addto Cart SnackBar
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

  useEffect(() => {
    const fetchProductFromFirebase = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, try to find product by ID/productId directly
        const productRef = doc(db, "products", productId);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProductData({ id: docSnap.id, ...docSnap.data() });
        } else {
          // If not found by ID, try to find by link field
          const productsQuery = query(
            collection(db, "products"),
            where("link", "==", productId)
          );

          const querySnapshot = await getDocs(productsQuery);

          if (!querySnapshot.empty) {
            // Use the first matching document
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
    //  setTimeout(() => setAdded(false), 1000);
      setaddtoCartSnack("Added to Cart!");}
    else{
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
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {details.scientificName && (
            <Grid xs={12}>
              <Typography level="title-md">Scientific Name:</Typography>
              <Typography level="body-md" fontStyle="italic">{details.scientificName}</Typography>
            </Grid>
          )}

          <Grid xs={12} sm={6} md={4}>
            <Card variant="soft" sx={{ height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <WbSunny color="warning" />
                <Typography level="title-sm">Sunlight</Typography>
              </Stack>
              <Typography level="body-sm">{details.sunlight || "Not specified"}</Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <Card variant="soft" sx={{ height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Opacity color="info" />
                <Typography level="title-sm">Watering</Typography>
              </Stack>
              <Typography level="body-sm">{details.watering || "Not specified"}</Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <Card variant="soft" sx={{ height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Speed />
                <Typography level="title-sm">Growth Rate</Typography>
              </Stack>
              <Typography level="body-sm">{details.growthRate || "Not specified"}</Typography>
            </Card>
          </Grid>

          <Grid xs={12} sm={6} md={4}>
            <Card variant="soft" sx={{ height: "100%" }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Build />
                <Typography level="title-sm">Maintenance</Typography>
              </Stack>
              <Typography level="body-sm">{details.maintenance || "Not specified"}</Typography>
            </Card>
          </Grid>

          {details.bloomSeason && (
            <Grid xs={12} sm={6} md={4}>
              <Card variant="soft" sx={{ height: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <LocalFlorist color="secondary" />
                  <Typography level="title-sm">Bloom Season</Typography>
                </Stack>
                <Typography level="body-sm">{details.bloomSeason}</Typography>
              </Card>
            </Grid>
          )}

          {details.specialFeatures && (
            <Grid xs={12} sm={6} md={4}>
              <Card variant="soft" sx={{ height: "100%" }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Grass color="success" />
                  <Typography level="title-sm">Special Features</Typography>
                </Stack>
                <Typography level="body-sm">{details.specialFeatures}</Typography>
              </Card>
            </Grid>
          )}

          {details.toxicity && (
            <Grid xs={12}>
              <Card
                variant="outlined"
                color={details.toxicity.toLowerCase().includes('toxic') ? 'danger' : 'success'}
                sx={{ mt: 2 }}
              >
                <Typography level="title-sm">
                  Toxicity: {details.toxicity}
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>
      );
    }

    // For other product categories (containers, tools, etc.)
    return (
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {details.material && (
          <Grid xs={12} sm={6}>
            <Typography level="title-sm">Material:</Typography>
            <Typography level="body-md">{details.material}</Typography>
          </Grid>
        )}

        {details.size && (
          <Grid xs={12} sm={6}>
            <Typography level="title-sm">Size:</Typography>
            <Typography level="body-md">{details.size}</Typography>
          </Grid>
        )}

        {details.color && (
          <Grid xs={12} sm={6}>
            <Typography level="title-sm">Color:</Typography>
            <Typography level="body-md">{details.color}</Typography>
          </Grid>
        )}

        {details.useCase && (
          <Grid xs={12} sm={6}>
            <Typography level="title-sm">Use Case:</Typography>
            <Typography level="body-md">{details.useCase}</Typography>
          </Grid>
        )}

        {details.drainageHoles !== undefined && (
          <Grid xs={12} sm={6}>
            <Typography level="title-sm">Drainage Holes:</Typography>
            <Typography level="body-md">{details.drainageHoles ? 'Yes' : 'No'}</Typography>
          </Grid>
        )}
      </Grid>
    );
  };

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid xs={12} md={6}>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Grid>
          <Grid xs={12} md={6}>
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="60%" height={30} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mt: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 3 }} />
            <Skeleton variant="rectangular" width="60%" height={50} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert variant="soft" color="danger" sx={{ mb: 3 }}>
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
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<ChevronRight fontSize="small" />}
        sx={{ mb: 3 }}
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
        <Grid xs={12} md={6}>
          <Card variant="outlined" sx={{ overflow: 'hidden', height: '100%' }}>
            <CardOverflow>
              {/* Low Stock Badge */}
              {productData.stock && productData.stock.quantity < 10 && (
                <Badge
                  color="danger"
                  badgeContent={`Only ${productData.stock.quantity} left!`}
                  sx={{ position: 'absolute', top: 16, right: 16 }}
                />
              )}

              {/* Feature Badges - Position them at the left */}
              <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {productData.popular && (
                  <Box sx={{
                    bgcolor: 'warning.300',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 'md',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 'xs'
                  }}>
                    Best Seller
                  </Box>
                )}

                {productData.featured && (
                  <Box sx={{
                    bgcolor: 'primary.400',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 'md',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 'xs'
                  }}>
                    Featured
                  </Box>
                )}

                {productData.newArrival && (
                  <Box sx={{
                    bgcolor: 'success.400',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 'md',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 'xs'
                  }}>
                    New Arrival
                  </Box>
                )}
              </Box>

              <AspectRatio ratio="4/3" objectFit="cover">
                <img
                  src={productData.imageSrc}
                  alt={productData.title}
                  loading="lazy"
                />
              </AspectRatio>
            </CardOverflow>
          </Card>
        </Grid>

        {/* Product Information */}
        <Grid xs={12} md={6}>
          <Sheet
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 'md',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <IconButton
              component={Link}
              to="/shop"
              variant="plain"
              size="sm"
              sx={{ alignSelf: 'flex-start', mb: 2 }}
              aria-label="back to shop"
            >
              <ArrowBack />
            </IconButton>

            <Typography level="body-xs" textTransform="uppercase" mb={1}>
              {productData.category}
            </Typography>

            <Typography level="h3" component="h1" fontWeight="lg">
              {productData.title}
            </Typography>

            {productData.details && productData.details.scientificName && (
              <Typography level="body-lg" fontStyle="italic" mb={2}>
                {productData.details.scientificName}
              </Typography>
            )}

            <Typography level="h4" color="primary" fontWeight="lg" my={2}>
              ${productData.price}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography level="body-md" mb={3}>
              {productData.description || "No description available for this product."}
            </Typography>

            {/* Quantity Selector */}
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <Typography level="body-md">Quantity:</Typography>
              <Button
                variant="outlined"
                size="sm"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Remove fontSize="small" />
              </Button>
              <Typography sx={{ mx: 2 }}>{quantity}</Typography>
              <Button
                variant="outlined"
                size="sm"
                onClick={increaseQuantity}
                disabled={!productData.stock || quantity >= productData.stock.quantity}
              >
                <Add fontSize="small" />
              </Button>
            </Stack>

            {/* Add to Cart Button */}
            <Button
              variant="solid"
              color="success"
              size="lg"
              startDecorator={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!productData.stock || !productData.stock.availability}
              sx={{
                py: 1.5,
                borderRadius: 'xl',
                mt: 'auto'
              }}
            >
              Add to Garden
            </Button>

            <Snackbar open={open} variant="soft" color="success" autoHideDuration={3000} onClose={() => setOpen(false)}>
              Added to cart!
            </Snackbar>

            <Stack direction="row" spacing={1} mt={3} flexWrap="wrap">
              {productData.stock && productData.stock.availability ? (
                <Chip
                  color="success"
                  variant="soft"
                  size="md"
                >
                  In Stock
                </Chip>
              ) : (
                <Chip
                  color="danger"
                  variant="soft"
                  size="md"
                >
                  Out of Stock
                </Chip>
              )}

              {productData.subCategory && (
                <Chip
                  color="primary"
                  variant="soft"
                  size="md"
                >
                  {productData.subCategory}
                </Chip>
              )}

              {productData.type && (
                <Chip
                  color="neutral"
                  variant="soft"
                  size="md"
                >
                  {productData.type}
                </Chip>
              )}

              {/* Add chips based on the boolean fields */}
              {productData.popular && (
                <Chip
                  color="warning"
                  variant="soft"
                  size="md"
                >
                  Best Seller
                </Chip>
              )}

              {productData.featured && (
                <Chip
                  color="primary"
                  variant="soft"
                  size="md"
                >
                  Featured
                </Chip>
              )}

              {productData.newArrival && (
                <Chip
                  color="success"
                  variant="soft"
                  size="md"
                >
                  New Arrival
                </Chip>
              )}
            </Stack>
          </Sheet>
        </Grid>

        {/* Product Details Section */}
        <Grid xs={12}>
          <Card sx={{ p: 3, mt: 4 }}>
            <Typography level="h5" component="h2" gutterBottom>
              Product Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {renderPlantDetails()}
          </Card>
        </Grid>

        {/* Related Products Section - This could be added in a future enhancement */}
        <Grid xs={12}>
          <Typography level="h2" component="h2" sx={{ mt: 6, mb: 3 }}>
            You May Also Like
          </Typography>
          <RelatedProducts setaddtoCartSnack={setaddtoCartSnack} category={productData.category} currentProductId={productId} />
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