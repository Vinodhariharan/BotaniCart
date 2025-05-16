import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../auth';
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  LinearProgress,
  Modal,
  ModalDialog,
  ModalClose,
  Option,
  Select,
  Sheet,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Typography,
  Snackbar,
} from '@mui/joy';
import { Add, ArrowBack, CheckCircle, DeleteOutline, Image, Save, Warning } from '@mui/icons-material';
import { handleImageUpload } from './handleImageUpload'

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!productId;

  // Initial product state with default values
  const defaultProduct = {
    title: '',
    description: '',
    imageSrc: '',
    price: 0,
    category: '',
    subCategory: '',
    type: '',
    link: '',
    featured: false,
    newArrival: true,
    popular: false,
    details: {
      bloomSeason: '',
      color: '',
      drainageHoles: false,
      growthRate: '',
      maintenance: '',
      material: '',
      scientificName: '',
      size: '',
      specialFeatures: '',
      sunlight: '',
      toxicity: '',
      useCase: '',
      watering: ''
    },
    stock: {
      availability: true,
      quantity: 0
    }
  };

  // Local state
  const [product, setProduct] = useState(defaultProduct);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('danger');
  const [activeTab, setActiveTab] = useState(0);
  const [newDetailName, setNewDetailName] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Common product categories
  const categories = ['plants', 'tools', 'fertilizers', 'pots', 'seeds', 'accessories'];

  // Fetch the product data from Firestore if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditMode) return;

      try {
        setIsLoading(true);
        const productDocRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productDocRef);

        if (productDoc.exists()) {
          const productData = productDoc.data();

          // Ensure required objects exist with default values
          if (!productData.details) productData.details = {};
          if (!productData.stock) productData.stock = { availability: true, quantity: 0 };

          setProduct(productData);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        setSnackbarMessage(`Error fetching product: ${err.message}`);
        setSnackbarColor('danger');
        setSnackbarOpen(true);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isEditMode]);

  // Generic handler for any field at the root level
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for number inputs
  const handleNumberChange = (name, value) => {
    setProduct(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // Generic handler for nested fields
  const handleNestedFieldChange = (nestedObject, name, value) => {
    setProduct(prev => ({
      ...prev,
      [nestedObject]: {
        ...prev[nestedObject],
        [name]: value,
      },
    }));
  };

  // Handle boolean values for details
  const handleDetailBooleanChange = (detailName, checked) => {
    setProduct(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [detailName]: checked,
      },
    }));
  };

  // Handle switch change
  const handleSwitchChange = (name, checked) => {
    setProduct(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle nested switch change
  const handleNestedSwitchChange = (nestedObject, name, checked) => {
    setProduct(prev => ({
      ...prev,
      [nestedObject]: {
        ...prev[nestedObject],
        [name]: checked,
      },
    }));
  };

  // Add a new detail field
  const handleAddDetail = () => {
    if (newDetailName.trim()) {
      setProduct(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [newDetailName.trim()]: ''
        }
      }));
      setNewDetailName('');
    }
  };

  // Remove a detail field
  const handleRemoveDetail = (detailName) => {
    setProduct(prev => {
      const updatedDetails = { ...prev.details };
      delete updatedDetails[detailName];
      return {
        ...prev,
        details: updatedDetails
      };
    });
  };

  // Generate a URL-friendly link from the title
  const generateLink = () => {
    if (product.title) {
      const link = product.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single one

      setProduct(prev => ({
        ...prev,
        link
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.title) {
      setSnackbarColor('danger');
      setSnackbarMessage('Product title is required.');
      setSnackbarOpen(true);
      setActiveTab(0); // Switch to basic info tab
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode) {
        // Update existing product
        const productDocRef = doc(db, 'products', productId);

        // Add updated timestamp
        await updateDoc(productDocRef, {
          ...product,
          updatedAt: new Date()
        });

        setSnackbarColor('success');
        setSnackbarMessage('Product updated successfully!');
      } else {
        // Create a new product
        const productToAdd = {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Add document to Firestore
        const productsCollectionRef = collection(db, 'products');
        await addDoc(productsCollectionRef, productToAdd);

        setSnackbarColor('success');
        setSnackbarMessage('Product added successfully!');
      }

      setSnackbarOpen(true);

      setTimeout(() => {
        navigate('/admin/product-list');
      }, 1500);
    } catch (err) {
      setSnackbarColor('danger');
      setSnackbarMessage(`Error ${isEditMode ? 'updating' : 'adding'} product: ${err.message}`);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!isEditMode || !productId) return;

    try {
      setIsDeleting(true);

      // Delete product from Firestore
      const productDocRef = doc(db, 'products', productId);
      await deleteDoc(productDocRef);

      setDeleteModalOpen(false);
      setSnackbarColor('success');
      setSnackbarMessage('Product deleted successfully!');
      setSnackbarOpen(true);

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/admin/product-list');
      }, 1500);
    } catch (err) {
      setDeleteModalOpen(false);
      setSnackbarColor('danger');
      setSnackbarMessage(`Error deleting product: ${err.message}`);
      setSnackbarOpen(true);
      setIsDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Render loading state
  if (isLoading && isEditMode && !product) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LinearProgress sx={{ width: '60%', mb: 2 }} />
        <Typography level="h4">Loading product data...</Typography>
      </Box>
    );
  }

  // Render error state
  if (isEditMode && !product && error) {
    return (
      <Box sx={{ maxWidth: 'md', mx: 'auto', p: 4 }}>
        <Card variant="outlined" color="danger">
          <CardContent>
            <Typography level="title-lg" startDecorator={<Warning />} color="danger">
              Error Loading Product
            </Typography>
            <Typography level="body-md" sx={{ mt: 1 }}>{error}</Typography>
            <Button
              variant="solid"
              onClick={() => navigate('/admin/product-list')}
              sx={{ mt: 2 }}
              startDecorator={<ArrowBack />}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Sheet
      sx={{
        maxWidth: '940px',
        mx: 'auto',
        my: 4,
        px: 2,
        py: 4,
      }}
    >
      <CssBaseline />
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Typography level="h2" fontWeight="lg">
            {isEditMode ? 'Update Product' : 'Add New Product'}
          </Typography>
          <Typography level="body-sm" color="neutral">
            {isEditMode
              ? 'Make changes to your product and save when you\'re done'
              : 'Fill in the product details below and click Save to add it to your inventory'}
          </Typography>
        </div>

        {isEditMode && (
          <Button
            variant="soft"
            color="danger"
            startDecorator={<DeleteOutline />}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Product
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 4 }} />

      <Tabs
        value={activeTab}
        onChange={(e, value) => setActiveTab(value)}
        sx={{ mb: 3 }}
      >
        <TabList variant="outlined">
          <Tab>Basic Info</Tab>
          <Tab>Details</Tab>
          <Tab>Stock & Pricing</Tab>
          <Tab>Flags</Tab>
        </TabList>

        <form onSubmit={handleSubmit}>
          <TabPanel value={0}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={12}>
                <FormControl required>
                  <FormLabel>Product Title</FormLabel>
                  <Input
                    name="title"
                    value={product.title || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter product title"
                    onBlur={generateLink}
                    required
                  />
                </FormControl>
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={product.category || ''}
                    onChange={(e, value) => handleFieldChange({ target: { name: 'category', value } })}
                    placeholder="Select category"
                  >
                    {categories.map((option) => (
                      <Option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Sub Category</FormLabel>
                  <Input
                    name="subCategory"
                    value={product.subCategory || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter sub-category"
                  />
                </FormControl>
              </Grid>

              <Grid xs={12}>
                <FormControl>
                  <FormLabel>Product Type</FormLabel>
                  <Input
                    name="type"
                    value={product.type || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter product type"
                  />
                </FormControl>
              </Grid>

              {/* <Grid xs={12}>
                <FormControl>
                  <FormLabel>Image Source</FormLabel>
                  <Input
                    name="imageSrc"
                    value={product.imageSrc || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter image path or URL"
                    startDecorator={<Image />}
                  />
                  <FormHelperText>Path to the product image</FormHelperText>
                </FormControl>
                
                {product.imageSrc && (
                  <AspectRatio 
                    ratio="16/9" 
                    maxHeight={200} 
                    sx={{ 
                      width: { xs: '100%', sm: 300 }, 
                      mt: 2, 
                      borderRadius: 'md',
                      border: '1px solid',
                      borderColor: 'neutral.outlinedBorder'
                    }}
                  >
                    <img
                      src={product.imageSrc}
                      alt="Product preview"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/200";
                        e.target.alt = "Image preview not available";
                      }}
                    />
                  </AspectRatio>
                )}
              </Grid> */}

              <Grid xs={12}>
                <FormControl>
                  <FormLabel>Image Source</FormLabel>

                  {/* File Upload Button */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setProduct, productId)} // Pass setProduct and productId here
                    style={{ marginBottom: '1rem' }}
                  />

                  {/* Manual Image URL Input (optional) */}
                  <Input
                    name="imageSrc"
                    value={product.imageSrc || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter image path or URL"
                    startDecorator={<Image />}
                  />
                  <FormHelperText>Upload an image or enter a URL</FormHelperText>
                </FormControl>

                {product.imageSrc && (
                  <AspectRatio
                    ratio="16/9"
                    maxHeight={200}
                    sx={{
                      width: { xs: '100%', sm: 300 },
                      mt: 2,
                      borderRadius: 'md',
                      border: '1px solid',
                      borderColor: 'neutral.outlinedBorder',
                    }}
                  >
                    <img
                      src={product.imageSrc}
                      alt="Product preview"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/200';
                        e.target.alt = 'Image preview not available';
                      }}
                    />
                  </AspectRatio>
                )}
              </Grid>



              <Grid xs={12}>
                <FormControl>
                  <FormLabel>URL/Link Path</FormLabel>
                  <Input
                    name="link"
                    value={product.link || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter URL path"
                    endDecorator={
                      <Button
                        variant="outlined"
                        size="sm"
                        disabled={!product.title}
                        onClick={generateLink}
                      >
                        Generate from title
                      </Button>
                    }
                  />
                  <FormHelperText>URL-friendly product identifier</FormHelperText>
                </FormControl>
              </Grid>

              <Grid xs={12}>
                <FormControl>
                  <FormLabel>Product Description</FormLabel>
                  <Textarea
                    name="description"
                    value={product.description || ''}
                    onChange={handleFieldChange}
                    minRows={4}
                    placeholder="Enter product description"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={1}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Typography level="title-md">Product Details</Typography>
                <Chip color="primary" size="sm">
                  {product.details ? Object.keys(product.details).length : 0} fields
                </Chip>
              </Stack>

              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {/* Dynamically render all details fields */}
                {product.details && Object.entries(product.details).map(([key, value]) => (
                  <Grid xs={12} sm={6} key={key}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <FormControl>
                          <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                          {typeof value === 'boolean' ? (
                            <Switch
                              checked={value}
                              onChange={(e) => handleDetailBooleanChange(key, e.target.checked)}
                              color={value ? 'success' : 'neutral'}
                            />
                          ) : (
                            <Input
                              value={value || ''}
                              onChange={(e) => handleNestedFieldChange('details', key, e.target.value)}
                              type={typeof value === 'number' ? 'number' : 'text'}
                              placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                            />
                          )}
                        </FormControl>
                        <Typography level="body-xs" color="neutral" sx={{ mt: 1 }}>
                          ({typeof value})
                          <Button
                            size="sm"
                            variant="plain"
                            color="danger"
                            onClick={() => handleRemoveDetail(key)}
                            sx={{ ml: 1 }}
                          >
                            delete
                          </Button>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}

                {/* Add a field to add new detail */}
                <Grid xs={12}>
                  <Card variant="outlined" sx={{ mt: 2 }}>
                    <CardContent>
                      <Typography level="title-sm" sx={{ mb: 2 }}>Add New Detail Field</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FormControl sx={{ flexGrow: 1 }}>
                          <Input
                            value={newDetailName}
                            onChange={(e) => setNewDetailName(e.target.value)}
                            placeholder="Enter field name (e.g., material, dimensions, size)"
                          />
                        </FormControl>
                        <IconButton
                          variant="solid"
                          color="primary"
                          disabled={!newDetailName.trim()}
                          onClick={handleAddDetail}
                        >
                          <Add />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={2}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Price ($)</FormLabel>
                  <Input
                    type="number"
                    value={product.price || 0}
                    onChange={(e) => handleNumberChange('price', e.target.value)}
                    startDecorator="$"
                    slotProps={{
                      input: {
                        min: 0,
                        step: 0.01
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>{isEditMode ? 'Stock Quantity' : 'Initial Stock Quantity'}</FormLabel>
                  <Input
                    type="number"
                    value={(product.stock && product.stock.quantity) || 0}
                    onChange={(e) => handleNestedFieldChange('stock', 'quantity', parseInt(e.target.value) || 0)}
                    endDecorator="units"
                    slotProps={{
                      input: {
                        min: 0,
                        step: 1
                      }
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid xs={12}>
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                      <div>
                        <FormLabel>{isEditMode ? 'Available for Purchase' : 'Make Available for Purchase'}</FormLabel>
                        <Typography level="body-sm" color="neutral">
                          {(product.stock && product.stock.availability)
                            ? isEditMode
                              ? 'This product is available in your store'
                              : 'Product will be visible in your store'
                            : isEditMode
                              ? 'This product is currently hidden from customers'
                              : 'Product will be hidden from customers'}
                        </Typography>
                      </div>
                      <Switch
                        checked={(product.stock && product.stock.availability) || false}
                        onChange={(e) => handleNestedSwitchChange('stock', 'availability', e.target.checked)}
                        color={(product.stock && product.stock.availability) ? 'success' : 'neutral'}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={3}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={12}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                      <div>
                        <FormLabel>Featured Product</FormLabel>
                        <Typography level="body-sm" color="neutral">
                          Show on homepage and featured collections
                        </Typography>
                      </div>
                      <Switch
                        checked={product.featured || false}
                        onChange={(e) => handleSwitchChange('featured', e.target.checked)}
                        color={product.featured ? 'success' : 'neutral'}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                      <div>
                        <FormLabel>New Arrival</FormLabel>
                        <Typography level="body-sm" color="neutral">
                          Mark as a recently added product
                        </Typography>
                      </div>
                      <Switch
                        checked={product.newArrival || false}
                        onChange={(e) => handleSwitchChange('newArrival', e.target.checked)}
                        color={product.newArrival ? 'success' : 'neutral'}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                      <div>
                        <FormLabel>Popular Product</FormLabel>
                        <Typography level="body-sm" color="neutral">
                          Highlight as a customer favorite
                        </Typography>
                      </div>
                      <Switch
                        checked={product.popular || false}
                        onChange={(e) => handleSwitchChange('popular', e.target.checked)}
                        color={product.popular ? 'success' : 'neutral'}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Actions area - always visible */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 4,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => navigate('/admin/product-list')}
              startDecorator={<ArrowBack />}
            >
              Cancel & Return
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              loadingPosition="start"
              startDecorator={isLoading ? null : <Save />}
            >
              {isLoading
                ? isEditMode ? 'Saving Changes...' : 'Adding Product...'
                : isEditMode ? 'Save Changes' : 'Add Product'}
            </Button>
          </Box>
        </form>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => !isDeleting && setDeleteModalOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <ModalClose disabled={isDeleting} />
          <Typography level="h4" startDecorator={<DeleteOutline />} sx={{ mb: 2 }}>
            Delete Product
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography level="body-md" sx={{ mb: 2 }}>
            Are you sure you want to delete "{product.title}"? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleDeleteProduct}
              loading={isDeleting}
              loadingPosition="start"
              startDecorator={isDeleting ? null : <DeleteOutline />}
            >
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <Snackbar
        autoHideDuration={6000}
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        color={snackbarColor}
        size="lg"
        variant="solid"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        startDecorator={snackbarColor === 'success' ? <CheckCircle /> : <Warning />}
      >
        {snackbarMessage}
      </Snackbar>
    </Sheet>
  );
};

export default ProductForm;