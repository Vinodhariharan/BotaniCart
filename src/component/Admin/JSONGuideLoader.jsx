import React, { useState } from 'react';
import { Box, Button, Typography, Snackbar, Alert, Card, CircularProgress, Divider } from '@mui/joy';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../auth'; // Adjust path to your firebase config
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';

const JSONGuideLoader = () => {
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
                // Handle both single guide object or array of guides
                const guidesArray = Array.isArray(data) ? data : [data];
                setJsonData(guidesArray);
                setStats({ total: guidesArray.length, processed: 0, success: 0, failed: 0 });
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

    // Add multiple guides using batch
    const addMultipleGuides = async (guidesArray) => {
        setIsLoading(true);
        setStats(prev => ({ ...prev, processed: 0, success: 0, failed: 0 }));
        
        try {
            // Process in chunks of 500 (Firestore batch limit)
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < guidesArray.length; i += 500) {
                const chunk = guidesArray.slice(i, i + 500);
                const batch = writeBatch(db);

                chunk.forEach((guide) => {
                    // Format the guide data with timestamp
                    const formattedGuide = {
                        ...guide,
                        publishDate: guide.publishDate === 'date' ? new Date() : new Date(guide.publishDate)
                    };
                    
                    const newDocRef = doc(collection(db, 'careguides'));
                    batch.set(newDocRef, formattedGuide);
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

            setSuccess(`Successfully added ${successCount} guides to the database.`);
            setSnackbarOpen(true);
        } catch (err) {
            setError('Error adding guides: ' + err.message);
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
    const handleUploadGuides = () => {
        if (!jsonData) {
            setError('No JSON data available to upload');
            setSnackbarOpen(true);
            return;
        }

        addMultipleGuides(jsonData);
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography level="h2" sx={{ mb: 2 }}>
                Plant Care Guide Uploader
            </Typography>
            
            <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography level="body-lg" sx={{ mb: 2 }}>
                    Upload a JSON file containing plant care guide data to add guides to your database.
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
                        onClick={handleUploadGuides}
                        startDecorator={isLoading ? <CircularProgress size="sm" /> : <AddCircleOutlineRoundedIcon />}
                    >
                        {isLoading ? 'Uploading...' : 'Upload Guides'}
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
                            Guides to upload: <strong>{stats.total}</strong>
                        </Typography>
                    </Box>
                )}

                {isLoading && (
                    <Box sx={{ mb: 2 }}>
                        <Typography level="body-sm" sx={{ mb: 1 }}>
                            Progress: {stats.processed}/{stats.total} guides ({Math.round((stats.processed/stats.total) * 100)}%)
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
                            Successfully added {stats.success} guides
                        </Typography>
                    </Box>
                )}
            </Card>
            
            <Card variant="outlined" sx={{ p: 3 }}>
                <Typography level="title-lg" sx={{ mb: 2 }}>
                    JSON Format Requirements
                </Typography>
                <Typography level="body-md" sx={{ mb: 1 }}>
                    Your JSON file should be either a single guide object or an array of guide objects with the following structure:
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
{`{
  "title": "Complete Care Guide for Monstera Deliciosa",
  "description": "Learn how to care for your Monstera Deliciosa...",
  "category": "Tropical Plants",
  "difficulty": "Moderate",  // Easy, Moderate, Advanced
  "imageURL": "https://example.com/monstera.jpg",
  "publishDate": "date", // Use "date" for current date or specify YYYY-MM-DD
  "author": "Plant Expert Name",
  
  "quickTips": ["water", "light", "temperature", "fertilizer"],
  "wateringTips": "Allow top 2-3 inches of soil to dry out between waterings",
  "lightTips": "Bright, indirect light. Can tolerate some direct morning sun",
  "temperatureTips": "65-85°F (18-29°C). Keep away from cold drafts",
  "fertilizerTips": "Feed monthly during spring and summer with balanced fertilizer",
  
  "content": [
    {
      "title": "Introduction to Monstera Deliciosa",
      "text": "The Monstera Deliciosa, also known as the Swiss Cheese Plant...",
      "imageURL": "https://example.com/monstera-introduction.jpg",
      "imageCaption": "A mature Monstera Deliciosa with fenestrated leaves"
    },
    {
      "title": "Watering",
      "text": "Monstera Deliciosa prefers a consistent watering schedule...",
      "imageURL": "https://example.com/monstera-watering.jpg",
      "imageCaption": "Proper watering technique for Monstera"
    }
    // Additional sections as needed
  ],
  
  "expertTip": "For fuller growth, rotate your Monstera regularly...",
  "expertName": "Maria Garcia",
  "expertTitle": "Tropical Plant Specialist",
  
  "commonProblems": [
    {
      "problem": "Yellow Leaves",
      "solution": "Usually indicates overwatering. Check soil moisture..."
    },
    {
      "problem": "Brown Leaf Edges",
      "solution": "Often caused by low humidity. Increase humidity..."
    }
    // Additional problems as needed
  ],
  
  "relatedProducts": ["productId1", "productId2"]
}`}
                </Box>
            </Card>

            <Card variant="outlined" sx={{ p: 3, mt: 3 }}>
                <Typography level="title-lg" sx={{ mb: 2 }}>
                    Single Guide Upload
                </Typography>
                <Typography level="body-md" sx={{ mb: 2 }}>
                    You can also create a new guide directly by filling out the form below.
                </Typography>
                <Button 
                    variant="outlined" 
                    color="primary"
                    sx={{ mb: 2 }}
                >
                    Open Guide Editor
                </Button>
                <Typography level="body-sm" color="neutral">
                    Note: The guide editor feature is not yet implemented in this component.
                </Typography>
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

export default JSONGuideLoader;