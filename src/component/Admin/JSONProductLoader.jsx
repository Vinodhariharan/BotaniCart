import React, { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert, Card, CircularProgress, Divider } from '@mui/joy';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../auth'; // Adjust path to your firebase config
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';

const JSONProductLoader = () => {
    const [jsonData, setJsonData] = useState(null);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, processed: 0, success: 0, failed: 0 });

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                setJsonData(data);
                setStats({ total: Array.isArray(data) ? data.length : 0, processed: 0, success: 0, failed: 0 });
            } catch (err) {
                setError('Invalid JSON file: ' + err.message);
                setSnackbarOpen(true);
                setJsonData(null);
            }
        };
        reader.onerror = () => {
            setError('Error reading file');
            setSnackbarOpen(true);
        };
        reader.readAsText(file);
    };

    // Add a single product using the provided data
    const addSingleProduct = async (productToAdd) => {
        try {
            const docRef = await addDoc(collection(db, 'products'), productToAdd);
            return { success: true, id: docRef.id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Add multiple products using batch
    const addMultipleProducts = async (productsArray) => {
        setIsLoading(true);
        setStats(prev => ({ ...prev, processed: 0, success: 0, failed: 0 }));
        
        try {
            // Process in chunks of 500 (Firestore batch limit)
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < productsArray.length; i += 500) {
                const chunk = productsArray.slice(i, i + 500);
                const batch = writeBatch(db);

                chunk.forEach((product) => {
                    // Format the product data correctly
                    const formattedProduct = {
                        ...product,
                        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                        stock: {
                            ...product.stock,
                            quantity: typeof product.stock.quantity === 'string' 
                                ? parseInt(product.stock.quantity, 10) 
                                : product.stock.quantity
                        }
                    };
                    
                    const newDocRef = doc(collection(db, 'products'));
                    batch.set(newDocRef, formattedProduct);
                });

                await batch.commit();
                successCount += chunk.length;
                
                // Update progress
                setStats(prev => ({ 
                    ...prev, 
                    processed: i + chunk.length,
                    success: successCount,
                    failed: failCount
                }));
            }

            setSuccess(`Successfully added ${successCount} products to the database.`);
            setSnackbarOpen(true);
        } catch (err) {
            setError('Error adding products: ' + err.message);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
        setError('');
        setSuccess('');
    };

    // Process the JSON data
    const handleUploadProducts = () => {
        if (!jsonData) {
            setError('No JSON data available to upload');
            setSnackbarOpen(true);
            return;
        }

        if (!Array.isArray(jsonData)) {
            setError('JSON data must be an array of products');
            setSnackbarOpen(true);
            return;
        }

        addMultipleProducts(jsonData);
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography level="h2" sx={{ mb: 2 }}>
                Bulk Product Uploader
            </Typography>
            
            <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography level="body-lg" sx={{ mb: 2 }}>
                    Upload a JSON file containing product data to add multiple products at once.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                    <Button 
                        component="label" 
                        variant="outlined" 
                        color="neutral" 
                        startDecorator={<FileUploadRoundedIcon />}
                    >
                        Select JSON File
                        <input 
                            type="file" 
                            accept=".json" 
                            hidden 
                            onChange={handleFileUpload} 
                        />
                    </Button>
                    
                    <Button 
                        variant="solid" 
                        color="primary" 
                        disabled={!jsonData || isLoading}
                        onClick={handleUploadProducts}
                        startDecorator={isLoading ? <CircularProgress size="sm" /> : <AddCircleOutlineRoundedIcon />}
                    >
                        {isLoading ? 'Uploading...' : 'Upload Products'}
                    </Button>
                </Box>
                
                {fileName && (
                    <Typography level="body-sm" sx={{ mb: 1 }}>
                        Selected file: <strong>{fileName}</strong>
                    </Typography>
                )}
                
                {jsonData && (
                    <Box sx={{ mb: 2 }}>
                        <Typography level="body-sm">
                            Products to upload: <strong>{stats.total}</strong>
                        </Typography>
                    </Box>
                )}

                {isLoading && (
                    <Box sx={{ mb: 2 }}>
                        <Typography level="body-sm" sx={{ mb: 1 }}>
                            Progress: {stats.processed}/{stats.total} products ({Math.round((stats.processed/stats.total) * 100)}%)
                        </Typography>
                        <Box sx={{ width: '100%', position: 'relative' }}>
                            <CircularProgress 
                                size="lg" 
                                determinate 
                                value={(stats.processed/stats.total) * 100} 
                                sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
                            />
                        </Box>
                    </Box>
                )}
                
                {stats.success > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.500' }}>
                        <DoneAllRoundedIcon />
                        <Typography>
                            Successfully added {stats.success} products
                        </Typography>
                    </Box>
                )}
            </Card>
            
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography level="title-lg" sx={{ mb: 2 }}>
                    JSON Format Requirements
                </Typography>
                <Typography level="body-md" sx={{ mb: 1 }}>
                    Your JSON file should be an array of product objects with the following structure:
                </Typography>
                <Box
                    component="pre"
                    sx={{
                        p: 1.5,
                        borderRadius: 'sm',
                        backgroundColor: 'neutral.100',
                        overflow: 'auto',
                        fontSize: '0.875rem',
                        maxHeight: '300px'
                    }}
                >
{`[
  {
    "title": "Product Name",
    "imageSrc": "/assets/images/category/image.jpg",
    "price": 19.99,
    "description": "Product description",
    "link": "product-link",
    "category": "category",
    "subCategory": "sub-category",
    "type": "Product Type",
    "details": {
      "scientificName": "",
      "sunlight": "",
      "watering": "",
      "growthRate": "",
      "maintenance": "",
      "bloomSeason": "",
      "specialFeatures": "",
      "toxicity": "",
      "material": "",
      "drainageHoles": false,
      "size": "",
      "color": "",
      "useCase": ""
    },
    "stock": {
      "availability": true,
      "quantity": 20
    }
  },
  // More products...
]`}
                </Box>
            </Card>
            
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    variant="soft"
                    color={error ? 'danger' : 'success'} 
                    onClose={handleCloseSnackbar}
                >
                    {error || success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default JSONProductLoader;