import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ProductList from "./ProductList.jsx";
import { CircularProgress, Box, Typography, Sheet, Card, CardContent, Button } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";

/**
 * Check if products exist in the specified category
 * 
 * @param {string} category - Category name to check, or "all" for any category
 * @returns {Promise<boolean>} True if products exist, false otherwise
 */
async function checkProductsExistInCategory(category) {
  try {
    const productsRef = collection(db, "products");
    let q;

    // Handle "all" as a special case, or use the specific category
    if (!category || category === "all") {
      q = query(productsRef, limit(1));
    } else {
      q = query(productsRef, where("category", "==", category), limit(1));
    }

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking products:", error);
    throw error;
  }
}

/**
 * ProductListPass component - Handles routing to display ProductList with the specified category
 * Note: Despite the filename, this component passes category data to ProductList
 */
function ProductListPass() {
  const { slug } = useParams();
  const [productsExist, setProductsExist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryName = slug || "All";

  useEffect(() => {
    // Reset state when category changes
    setLoading(true);
    setError(null);
    
    let isMounted = true;
    
    async function fetchData() {
      try {
        // Check if products exist in this category
        const exist = await checkProductsExistInCategory(slug);
        
        // Only update state if component is still mounted
        if (isMounted) {
          setProductsExist(exist);
          setError(null);
        }
      } catch (error) {
        console.error("Error in ProductListPass:", error);
        if (isMounted) {
          setError("Failed to load products. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Sheet sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Card variant="outlined" sx={{ width: "80%", maxWidth: 600, p: 3 }}>
          <CardContent>
            <Typography level="h4" textAlign="center" mb={2}>
              Error Loading Products
            </Typography>
            <Typography level="body-md" textAlign="center" mb={3}>
              {error}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button 
                component={RouterLink} 
                to="/" 
                variant="solid" 
                color="primary"
              >
                Return to Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Sheet>
    );
  }

  if (productsExist) {
    return <ProductList initialCategory={categoryName} />;
  } else {
    return (
      <Sheet sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Card variant="outlined" sx={{ width: "80%", maxWidth: 600, p: 3 }}>
          <CardContent>
            <Typography level="h4" textAlign="center" mb={2}>
              No products found in {categoryName === "All" ? "any category" : `"${categoryName}"`}
            </Typography>
            <Typography level="body-md" textAlign="center" mb={3}>
              Please try another category or check back later.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button 
                component={RouterLink} 
                to="/" 
                variant="solid" 
                color="primary"
              >
                Return to Home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Sheet>
    );
  }
}

// Rename the component to match its actual purpose
export default ProductListPass;