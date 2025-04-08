import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import ProductList from "./ProductList.jsx";
import { CircularProgress, Box, Typography, Sheet, Card, CardContent } from "@mui/joy";

async function checkProductsExistInCategory(category) {
  try {
    const productsRef = collection(db, "products");
    let q;

    if (category === "all") {
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

function ProductDetails() {
  const { slug } = useParams();
  const [productsExist, setProductsExist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const exist = await checkProductsExistInCategory(slug);
        setProductsExist(exist);
        setError(null);
      } catch (error) {
        console.error("Error in ProductDetails:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "30vh" }}>
        <Typography level="h5" color="danger">
          {error}
        </Typography>
      </Box>
    );
  }

  if (productsExist) {
    return <ProductList initialCategory={slug} />;
  } else {
    return (
      <Sheet sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Card variant="outlined" sx={{ width: "80%", maxWidth: 600, p: 3 }}>
          <CardContent>
            <Typography level="h4" textAlign="center" mb={2}>
              No products found in this category
            </Typography>
            <Typography level="body-md" textAlign="center">
              Please try another category or check back later.
            </Typography>
          </CardContent>
        </Card>
      </Sheet>
    );
  }
}

export default ProductDetails;