// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "../../firebaseConfig.js";
// import { 
//   Container, 
//   Grid, 
//   Typography, 
//   Paper, 
//   Button, 
//   Box, 
//   Chip, 
//   Divider, 
//   IconButton,
//   Skeleton,
//   Breadcrumbs,
//   Alert
// } from "@mui/material";
// import { 
//   WbSunny, 
//   Opacity, 
//   Speed, 
//   Build, 
//   LocalFlorist, 
//   Grass,
//   ArrowBack, 
//   AddShoppingCart,
//   Home,
//   NavigateNext
// } from "@mui/icons-material";
// // import { useDispatch } from "react-redux";
// // import { addToCart } from "../Cart Redux/action.js";
// import { Link } from "react-router-dom";

// function ProductDetails() {
//   const { slug } = useParams();
//   // const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [productData, setProductData] = useState({
//     title: '',
//     imageSrc: '',
//     price: '',
//     description: '',
//     link: '',
//     category: '',
//     subCategory: '',
//     type: '',
//     details: {
//       scientificName: '',
//       sunlight: '',
//       watering: '',
//       growthRate: '',
//       maintenance: '',
//       bloomSeason: '',
//       specialFeatures: '',
//       toxicity: '',
//       material: '',
//       drainageHoles: false,
//       size: '',
//       color: '',
//       useCase: ''
//     },
//     stock: {
//       availability: true,
//       quantity: ''
//     }
//   });

//   useEffect(() => {
//     const fetchProductFromFirebase = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         // First, try to find product by ID/slug directly
//         const productRef = doc(db, "products", slug);
//         const docSnap = await getDoc(productRef);

//         if (docSnap.exists()) {
//           setProductData(docSnap.data());
//         } else {
//           // If not found by ID, try to find by link field
//           const productsQuery = query(
//             collection(db, "products"), 
//             where("link", "==", slug)
//           );

//           const querySnapshot = await getDocs(productsQuery);

//           if (!querySnapshot.empty) {
//             // Use the first matching document
//             const matchingProduct = querySnapshot.docs[0].data();
//             setProductData(matchingProduct);
//           } else {
//             // No product found
//             setError("Product not found");
//             console.error("Product not found!");
//           }
//         }
//       } catch (error) {
//         setError("Error fetching product details");
//         console.error("Error fetching product: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductFromFirebase();
//   }, [slug]);

//   const handleAddToCart = () => {
//     addToCart({...productData, quantity});
//   };

//   const increaseQuantity = () => {
//     if (quantity < productData.stock.quantity) {
//       setQuantity(quantity + 1);
//     }
//   };

//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   // Function to render plant specific details
//   const renderPlantDetails = () => {
//     const { details } = productData;

//     if (productData.category === 'plants' || 
//         productData.category === 'flowers' || 
//         productData.category === 'shrubs' || 
//         productData.category === 'trees') {
//       return (
//         <Grid container spacing={2} sx={{ mt: 2 }}>
//           {details.scientificName && (
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold">Scientific Name:</Typography>
//               <Typography variant="body1" fontStyle="italic">{details.scientificName}</Typography>
//             </Grid>
//           )}

//           <Grid item xs={12} sm={6} md={4}>
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5", height: "100%" }}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <WbSunny color="warning" sx={{ mr: 1 }} />
//                 <Typography variant="subtitle2">Sunlight</Typography>
//               </Box>
//               <Typography variant="body2">{details.sunlight || "Not specified"}</Typography>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} sm={6} md={4}>
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5", height: "100%" }}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <Opacity color="info" sx={{ mr: 1 }} />
//                 <Typography variant="subtitle2">Watering</Typography>
//               </Box>
//               <Typography variant="body2">{details.watering || "Not specified"}</Typography>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} sm={6} md={4}>
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5", height: "100%" }}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <Speed color="action" sx={{ mr: 1 }} />
//                 <Typography variant="subtitle2">Growth Rate</Typography>
//               </Box>
//               <Typography variant="body2">{details.growthRate || "Not specified"}</Typography>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} sm={6} md={4}>
//             <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5", height: "100%" }}>
//               <Box display="flex" alignItems="center" mb={1}>
//                 <Build color="action" sx={{ mr: 1 }} />
//                 <Typography variant="subtitle2">Maintenance</Typography>
//               </Box>
//               <Typography variant="body2">{details.maintenance || "Not specified"}</Typography>
//             </Paper>
//           </Grid>

//           {details.bloomSeason && (
//             <Grid item xs={12} sm={6} md={4}>
//               <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5", height: "100%" }}>
//                 <Box display="flex" alignItems="center" mb={1}>
//                   <LocalFlorist color="secondary" sx={{ mr: 1 }} />
//                   <Typography variant="subtitle2">Bloom Season</Typography>
//                 </Box>
//                 <Typography variant="body2">{details.bloomSeason}</Typography>
//               </Paper>
//             </Grid>
//           )}

//           {details.specialFeatures && (
//             <Grid item xs={12} sm={6} md={4}>
//               <Paper elevation={0} sx={{ p: 2, backgroundColor: "#f5f5f5", height: "100%" }}>
//                 <Box display="flex" alignItems="center" mb={1}>
//                   <Grass color="success" sx={{ mr: 1 }} />
//                   <Typography variant="subtitle2">Special Features</Typography>
//                 </Box>
//                 <Typography variant="body2">{details.specialFeatures}</Typography>
//               </Paper>
//             </Grid>
//           )}

//           {details.toxicity && (
//             <Grid item xs={12}>
//               <Box sx={{ mt: 2, p: 2, borderRadius: 1, bgcolor: details.toxicity.toLowerCase().includes('toxic') ? '#ffebee' : '#f1f8e9' }}>
//                 <Typography variant="subtitle2" fontWeight="bold">
//                   Toxicity: {details.toxicity}
//                 </Typography>
//               </Box>
//             </Grid>
//           )}
//         </Grid>
//       );
//     }

//     // For other product categories (containers, tools, etc.)
//     return (
//       <Grid container spacing={2} sx={{ mt: 2 }}>
//         {details.material && (
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" fontWeight="bold">Material:</Typography>
//             <Typography variant="body2">{details.material}</Typography>
//           </Grid>
//         )}

//         {details.size && (
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" fontWeight="bold">Size:</Typography>
//             <Typography variant="body2">{details.size}</Typography>
//           </Grid>
//         )}

//         {details.color && (
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" fontWeight="bold">Color:</Typography>
//             <Typography variant="body2">{details.color}</Typography>
//           </Grid>
//         )}

//         {details.useCase && (
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" fontWeight="bold">Use Case:</Typography>
//             <Typography variant="body2">{details.useCase}</Typography>
//           </Grid>
//         )}

//         {details.drainageHoles !== undefined && (
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle2" fontWeight="bold">Drainage Holes:</Typography>
//             <Typography variant="body2">{details.drainageHoles ? 'Yes' : 'No'}</Typography>
//           </Grid>
//         )}
//       </Grid>
//     );
//   };

//   if (loading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={6}>
//             <Skeleton variant="rectangular" width="100%" height={400} />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Skeleton variant="text" width="80%" height={40} />
//             <Skeleton variant="text" width="60%" height={30} sx={{ mt: 2 }} />
//             <Skeleton variant="text" width="40%" height={30} sx={{ mt: 2 }} />
//             <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 3 }} />
//             <Skeleton variant="rectangular" width="60%" height={50} sx={{ mt: 2 }} />
//           </Grid>
//         </Grid>
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//         <Button 
//           component={Link} 
//           to="/shop" 
//           variant="contained" 
//           startIcon={<ArrowBack />}
//         >
//           Return to Shop
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* Breadcrumbs */}
//       <Breadcrumbs 
//         separator={<NavigateNext fontSize="small" />}
//         aria-label="breadcrumb"
//         sx={{ mb: 3 }}
//       >
//         <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
//           <Home sx={{ mr: 0.5 }} fontSize="inherit" />
//           Home
//         </Link>
//         <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
//           Shop
//         </Link>
//         {productData.category && (
//           <Link to={`/category/${productData.category.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//             {productData.category}
//           </Link>
//         )}
//         <Typography color="text.primary">{productData.title}</Typography>
//       </Breadcrumbs>

//       <Grid container spacing={4}>
//         {/* Product Image */}
//         <Grid item xs={12} md={6}>
//           <Box 
//             sx={{ 
//               borderRadius: 2, 
//               overflow: 'hidden', 
//               boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//               position: 'relative'
//             }}
//           >
//             <img 
//               src={productData.imageSrc} 
//               alt={productData.title} 
//               style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }} 
//             />
//             {productData.stock && productData.stock.quantity < 10 && (
//               <Chip 
//                 label={`Only ${productData.stock.quantity} left!`} 
//                 color="error" 
//                 sx={{ 
//                   position: 'absolute', 
//                   top: 16, 
//                   right: 16,
//                   fontWeight: 'bold'
//                 }} 
//               />
//             )}
//           </Box>
//         </Grid>

//         {/* Product Information */}
//         <Grid item xs={12} md={6}>
//           <IconButton 
//             component={Link} 
//             to="/shop" 
//             sx={{ mb: 2 }}
//             aria-label="back to shop"
//           >
//             <ArrowBack />
//           </IconButton>

//           <Typography variant="overline" color="text.secondary" textTransform="uppercase">
//             {productData.category}
//           </Typography>

//           <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
//             {productData.title}
//           </Typography>

//           {productData.details && productData.details.scientificName && (
//             <Typography variant="subtitle1" color="text.secondary" fontStyle="italic" gutterBottom>
//               {productData.details.scientificName}
//             </Typography>
//           )}

//           <Typography variant="h5" color="primary" fontWeight="bold" sx={{ my: 2 }}>
//             ₹{productData.price}
//           </Typography>

//           <Divider sx={{ my: 2 }} />

//           <Typography variant="body1" paragraph>
//             {productData.description || "No description available for this product."}
//           </Typography>

//           {/* Quantity Selector */}
//           <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//             <Typography variant="subtitle1" sx={{ mr: 2 }}>Quantity:</Typography>
//             <Button 
//               variant="outlined" 
//               size="small" 
//               onClick={decreaseQuantity}
//               disabled={quantity <= 1}
//             >
//               -
//             </Button>
//             <Typography sx={{ mx: 2 }}>{quantity}</Typography>
//             <Button 
//               variant="outlined" 
//               size="small" 
//               onClick={increaseQuantity}
//               disabled={!productData.stock || quantity >= productData.stock.quantity}
//             >
//               +
//             </Button>
//           </Box>

//           {/* Add to Cart Button */}
//           <Button
//             variant="contained"
//             size="large"
//             startIcon={<AddShoppingCart />}
//             onClick={handleAddToCart}
//             disabled={!productData.stock || !productData.stock.availability}
//             fullWidth
//             sx={{ 
//               py: 1.5, 
//               borderRadius: '28px',
//               background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
//               '&:hover': {
//                 background: 'linear-gradient(45deg, #1b5e20 30%, #388e3c 90%)',
//               }
//             }}
//           >
//             Add to Garden
//           </Button>

//           <Box sx={{ display: 'flex', mt: 3 }}>
//             {productData.stock && productData.stock.availability ? (
//               <Chip 
//                 label="In Stock" 
//                 color="success" 
//                 variant="outlined" 
//                 sx={{ mr: 1 }} 
//               />
//             ) : (
//               <Chip 
//                 label="Out of Stock" 
//                 color="error" 
//                 variant="outlined" 
//                 sx={{ mr: 1 }} 
//               />
//             )}

//             {productData.subCategory && (
//               <Chip 
//                 label={productData.subCategory} 
//                 color="primary" 
//                 variant="outlined" 
//               />
//             )}
//           </Box>
//         </Grid>

//         {/* Product Details Section */}
//         <Grid item xs={12}>
//           <Paper sx={{ p: 3, mt: 4 }}>
//             <Typography variant="h5" component="h2" gutterBottom>
//               Product Details
//             </Typography>
//             <Divider sx={{ mb: 3 }} />

//             {renderPlantDetails()}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

// export default ProductDetails;
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
  Badge
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

function ProductDetails() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState({
    title: '',
    imageSrc: '',
    price: '',
    description: '',
    link: '',
    category: '',
    subCategory: '',
    type: '',
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

  useEffect(() => {
    const fetchProductFromFirebase = async () => {
      setLoading(true);
      setError(null);

      try {
        // First, try to find product by ID/slug directly
        const productRef = doc(db, "products", slug);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProductData(docSnap.data());
        } else {
          // If not found by ID, try to find by link field
          const productsQuery = query(
            collection(db, "products"),
            where("link", "==", slug)
          );

          const querySnapshot = await getDocs(productsQuery);

          if (!querySnapshot.empty) {
            // Use the first matching document
            const matchingProduct = querySnapshot.docs[0].data();
            setProductData(matchingProduct);
          } else {
            // No product found
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
  }, [slug]);

  const handleAddToCart = () => {
    // Implementation would be added for cart functionality
    console.log("Adding to cart:", { ...productData, quantity });
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
        <Link to="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>
          Shop
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
              {productData.stock && productData.stock.quantity < 10 && (
                <Badge
                  color="danger"
                  badgeContent={`Only ${productData.stock.quantity} left!`}
                  sx={{ position: 'absolute', top: 16, right: 16 }}
                />
              )}
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
              ₹{productData.price}
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

            <Stack direction="row" spacing={1} mt={3}>
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
        {/* <Grid xs={12}>
          <Typography level="h5" component="h2" sx={{ mt: 6, mb: 3 }}>
            You May Also Like
          </Typography>
          <RelatedProducts category={productData.category} currentProductId={slug} />
        </Grid> */}
      </Grid>
    </Container>
  );
}

export default ProductDetails;