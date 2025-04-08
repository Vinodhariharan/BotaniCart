import React from 'react';
import { Grid, Typography, Box, List, ListItem, Container, Button } from '@mui/material';
import generateLongDescription from './longDiscription';
import generateKeyFeatures from './keyFeatures';
import './productPage.css';
import {useCart} from '../AllComp/useCart';
import { useContext } from 'react';

function ProductPage({ product }) {

  console.log(product.Type)
  const keyFeatures = generateKeyFeatures(product.Type);
  const longDescription = generateLongDescription(product);
  // const keyFeatures = '';
  // const longDescription = '';

  const { cartItems, addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart(product);
  }

  return (
    <Grid container  display="flex" justifyContent="center" alignItems="flex-start" className="product-page">
      <Grid item xs={6} className="product-image" >
        <img src={product.imageSrc} alt={product.title} style={{marginTop:'0',width:'100%',}} />
      </Grid>
      <Grid item xs={6} className="product-details" >
        <Container>
          <Typography variant="h3" sx={{ fontFamily: 'League Spartan, sans-serif'}} className="product-title">
            <h1>{product.title}</h1>
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'League Spartan, sans-serif'}}    color="green" className="product-price">
            Price: ${product.price}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.5, fontFamily: 'League Spartan, sans-serif', marginBottom:'20px' }}>
            {longDescription}
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'League Spartan, sans-serif'}} className="key-features-title">
            Key Features:
          </Typography>
          <List className="key-features-list">
            {Object.keys(keyFeatures).map((featureKey) => (
              <ListItem key={featureKey} className="key-feature">
                {featureKey}: {keyFeatures[featureKey]}
              </ListItem>
            ))}
          </List>
          <Box sx={{ marginTop: 2 }}>
            <Button style={{width:'100%',borderRadius:'20px'}} onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}

export default ProductPage;
