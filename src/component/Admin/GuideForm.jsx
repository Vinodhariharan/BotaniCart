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
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Typography,
  Snackbar,
} from '@mui/joy';
import { 
  Add, 
  ArrowBack, 
  CheckCircle, 
  DeleteOutline, 
  Image, 
  Save, 
  Warning,
  Edit,
  NoteAdd
} from '@mui/icons-material';
import { handleImageUpload } from './handleImageUpload';

const CareGuideForm = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!guideId;

  // Initial care guide state with default values
  const defaultCareGuide = {
    // Basic Information
    title: '',
    description: '',
    category: '',
    difficulty: 'Moderate', // Default to Moderate
    imageURL: '',
    publishDate: new Date().toISOString().split('T')[0],
    author: '',
    
    // Quick Tips
    quickTips: [],
    wateringTips: '',
    lightTips: '',
    temperatureTips: '',
    fertilizerTips: '',
    
    // Content sections
    content: [],
    
    // Expert Tips
    expertTip: '',
    expertName: '',
    expertTitle: '',
    
    // Common Problems and Solutions
    commonProblems: [],
    
    // Related Products
    relatedProducts: []
  };

  // Local state
  const [careGuide, setCareGuide] = useState(defaultCareGuide);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('danger');
  const [activeTab, setActiveTab] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form state for new items
  const [newContentSection, setNewContentSection] = useState({ title: '', text: '', imageURL: '', imageCaption: '' });
  const [newProblem, setNewProblem] = useState({ problem: '', solution: '' });
  const [newQuickTip, setNewQuickTip] = useState('');
  const [newRelatedProduct, setNewRelatedProduct] = useState('');
  const [editingSectionIndex, setEditingSectionIndex] = useState(-1);
  const [editingProblemIndex, setEditingProblemIndex] = useState(-1);

  // Categories and difficulty levels
  const categories = [
    'Tropical Plants', 
    'Succulents', 
    'Cacti', 
    'Flowering Plants', 
    'Foliage Plants', 
    'Air Plants', 
    'Herbs',
    'Indoor Trees',
    'Outdoor Plants'
  ];
  
  const difficultyLevels = ['Easy', 'Moderate', 'Advanced'];

  // Fetch the care guide data from Firestore if in edit mode
  useEffect(() => {
    const fetchCareGuide = async () => {
      if (!isEditMode) return;

      try {
        setIsLoading(true);
        const guideDocRef = doc(db, 'careguides', guideId);
        const guideDoc = await getDoc(guideDocRef);

        if (guideDoc.exists()) {
          const guideData = guideDoc.data();

          // Ensure required arrays exist with default values
          if (!guideData.content) guideData.content = [];
          if (!guideData.commonProblems) guideData.commonProblems = [];
          if (!guideData.quickTips) guideData.quickTips = [];
          if (!guideData.relatedProducts) guideData.relatedProducts = [];

          // Format date if it exists
          if (guideData.publishDate && guideData.publishDate.toDate) {
            guideData.publishDate = guideData.publishDate.toDate().toISOString().split('T')[0];
          }

          setCareGuide(guideData);
        } else {
          throw new Error('Care guide not found');
        }
      } catch (err) {
        setSnackbarMessage(`Error fetching care guide: ${err.message}`);
        setSnackbarColor('danger');
        setSnackbarOpen(true);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareGuide();
  }, [guideId, isEditMode]);

  // Generic handler for field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setCareGuide(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle content section field changes
  const handleContentFieldChange = (e) => {
    const { name, value } = e.target;
    setNewContentSection(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle problem field changes
  const handleProblemFieldChange = (e) => {
    const { name, value } = e.target;
    setNewProblem(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new content section
  const handleAddContentSection = () => {
    if (newContentSection.title.trim() && newContentSection.text.trim()) {
      if (editingSectionIndex >= 0) {
        // Update existing section
        const updatedContent = [...careGuide.content];
        updatedContent[editingSectionIndex] = { ...newContentSection };
        
        setCareGuide(prev => ({
          ...prev,
          content: updatedContent
        }));
        setEditingSectionIndex(-1);
      } else {
        // Add new section
        setCareGuide(prev => ({
          ...prev,
          content: [...prev.content, { ...newContentSection }]
        }));
      }
      
      // Reset form
      setNewContentSection({ title: '', text: '', imageURL: '', imageCaption: '' });
    }
  };

  // Add a new common problem
  const handleAddProblem = () => {
    if (newProblem.problem.trim() && newProblem.solution.trim()) {
      if (editingProblemIndex >= 0) {
        // Update existing problem
        const updatedProblems = [...careGuide.commonProblems];
        updatedProblems[editingProblemIndex] = { ...newProblem };
        
        setCareGuide(prev => ({
          ...prev,
          commonProblems: updatedProblems
        }));
        setEditingProblemIndex(-1);
      } else {
        // Add new problem
        setCareGuide(prev => ({
          ...prev,
          commonProblems: [...prev.commonProblems, { ...newProblem }]
        }));
      }
      
      // Reset form
      setNewProblem({ problem: '', solution: '' });
    }
  };

  // Add a new quick tip
  const handleAddQuickTip = () => {
    if (newQuickTip.trim()) {
      setCareGuide(prev => ({
        ...prev,
        quickTips: [...prev.quickTips, newQuickTip.trim()]
      }));
      setNewQuickTip('');
    }
  };

  // Add a new related product
  const handleAddRelatedProduct = () => {
    if (newRelatedProduct.trim()) {
      setCareGuide(prev => ({
        ...prev,
        relatedProducts: [...prev.relatedProducts, newRelatedProduct.trim()]
      }));
      setNewRelatedProduct('');
    }
  };

  // Remove a content section
  const handleRemoveContentSection = (index) => {
    setCareGuide(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  // Remove a common problem
  const handleRemoveProblem = (index) => {
    setCareGuide(prev => ({
      ...prev,
      commonProblems: prev.commonProblems.filter((_, i) => i !== index)
    }));
  };

  // Remove a quick tip
  const handleRemoveQuickTip = (index) => {
    setCareGuide(prev => ({
      ...prev,
      quickTips: prev.quickTips.filter((_, i) => i !== index)
    }));
  };

  // Remove a related product
  const handleRemoveRelatedProduct = (index) => {
    setCareGuide(prev => ({
      ...prev,
      relatedProducts: prev.relatedProducts.filter((_, i) => i !== index)
    }));
  };

  // Edit content section
  const handleEditContentSection = (index) => {
    setNewContentSection({ ...careGuide.content[index] });
    setEditingSectionIndex(index);
  };

  // Edit common problem
  const handleEditProblem = (index) => {
    setNewProblem({ ...careGuide.commonProblems[index] });
    setEditingProblemIndex(index);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!careGuide.title) {
      setSnackbarColor('danger');
      setSnackbarMessage('Care guide title is required.');
      setSnackbarOpen(true);
      setActiveTab(0); // Switch to basic info tab
      return;
    }

    try {
      setIsLoading(true);

      // Format date for Firestore
      const formattedGuide = {
        ...careGuide,
        publishDate: new Date(careGuide.publishDate)
      };

      if (isEditMode) {
        // Update existing guide
        const guideDocRef = doc(db, 'careguides', guideId);

        // Add updated timestamp
        await updateDoc(guideDocRef, {
          ...formattedGuide,
          updatedAt: new Date()
        });

        setSnackbarColor('success');
        setSnackbarMessage('Care guide updated successfully!');
      } else {
        // Create a new guide
        const guideToAdd = {
          ...formattedGuide,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Add document to Firestore
        const guidesCollectionRef = collection(db, 'careguides');
        await addDoc(guidesCollectionRef, guideToAdd);

        setSnackbarColor('success');
        setSnackbarMessage('Care guide added successfully!');
      }

      setSnackbarOpen(true);

      setTimeout(() => {
        navigate('/admin/guide-list');
      }, 1500);
    } catch (err) {
      setSnackbarColor('danger');
      setSnackbarMessage(`Error ${isEditMode ? 'updating' : 'adding'} care guide: ${err.message}`);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete care guide
  const handleDeleteCareGuide = async () => {
    if (!isEditMode || !guideId) return;

    try {
      setIsDeleting(true);

      // Delete guide from Firestore
      const guideDocRef = doc(db, 'careguides', guideId);
      await deleteDoc(guideDocRef);

      setDeleteModalOpen(false);
      setSnackbarColor('success');
      setSnackbarMessage('Care guide deleted successfully!');
      setSnackbarOpen(true);

      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1500);
    } catch (err) {
      setDeleteModalOpen(false);
      setSnackbarColor('danger');
      setSnackbarMessage(`Error deleting care guide: ${err.message}`);
      setSnackbarOpen(true);
      setIsDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Render loading state
  if (isLoading && isEditMode && !careGuide) {
    return (
      <Box sx={{ width: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LinearProgress sx={{ width: '60%', mb: 2 }} />
        <Typography level="h4">Loading care guide data...</Typography>
      </Box>
    );
  }

  // Render error state
  if (isEditMode && !careGuide && error) {
    return (
      <Box sx={{ maxWidth: 'md', mx: 'auto', p: 4 }}>
        <Card variant="outlined" color="danger">
          <CardContent>
            <Typography level="title-lg" startDecorator={<Warning />} color="danger">
              Error Loading Care Guide
            </Typography>
            <Typography level="body-md" sx={{ mt: 1 }}>{error}</Typography>
            <Button
              variant="solid"
              onClick={() => navigate('/admin-dashboard')}
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
            {isEditMode ? 'Update Care Guide' : 'Add New Care Guide'}
          </Typography>
          <Typography level="body-sm" color="neutral">
            {isEditMode
              ? 'Edit your plant care guide and share your expertise'
              : 'Create a comprehensive plant care guide to help your customers'}
          </Typography>
        </div>

        {isEditMode && (
          <Button
            variant="soft"
            color="danger"
            startDecorator={<DeleteOutline />}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Guide
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
          <Tab>Quick Tips</Tab>
          <Tab>Content Sections</Tab>
          <Tab>Expert Tips & Problems</Tab>
        </TabList>

        <form onSubmit={handleSubmit}>
          {/* Tab 1: Basic Information */}
          <TabPanel value={0}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={12}>
                <FormControl required>
                  <FormLabel>Guide Title</FormLabel>
                  <Input
                    name="title"
                    value={careGuide.title || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter care guide title"
                    required
                  />
                </FormControl>
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    name="category"
                    value={careGuide.category || ''}
                    onChange={(e, value) => handleFieldChange({ target: { name: 'category', value } })}
                    placeholder="Select plant category"
                  >
                    {categories.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select
                    name="difficulty"
                    value={careGuide.difficulty || 'Moderate'}
                    onChange={(e, value) => handleFieldChange({ target: { name: 'difficulty', value } })}
                  >
                    {difficultyLevels.map((level) => (
                      <Option key={level} value={level}>
                        {level}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={12}>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={careGuide.description || ''}
                    onChange={handleFieldChange}
                    minRows={3}
                    placeholder="Enter a brief description of the care guide"
                  />
                </FormControl>
              </Grid>

              <Grid xs={12}>
                <FormControl>
                  <FormLabel>Featured Image</FormLabel>

                  {/* File Upload Button */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setCareGuide, 'imageURL', guideId)} 
                    style={{ marginBottom: '1rem' }}
                  />

                  {/* Manual Image URL Input */}
                  <Input
                    name="imageURL"
                    value={careGuide.imageURL || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter image URL"
                    startDecorator={<Image />}
                  />
                  <FormHelperText>Upload an image or enter a URL</FormHelperText>
                </FormControl>

                {careGuide.imageURL && (
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
                      src={careGuide.imageURL}
                      alt="Care guide cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/200';
                        e.target.alt = 'Image preview not available';
                      }}
                    />
                  </AspectRatio>
                )}
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Author Name</FormLabel>
                  <Input
                    name="author"
                    value={careGuide.author || ''}
                    onChange={handleFieldChange}
                    placeholder="Enter author name"
                  />
                </FormControl>
              </Grid>

              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Publish Date</FormLabel>
                  <Input
                    type="date"
                    name="publishDate"
                    value={careGuide.publishDate || ''}
                    onChange={handleFieldChange}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Quick Tips */}
          <TabPanel value={1}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={12}>
                <Typography level="title-md" sx={{ mb: 2 }}>Quick Care Tips</Typography>
                <Typography level="body-sm" color="neutral" sx={{ mb: 3 }}>
                  Add essential quick care tips that will be featured prominently in the guide
                </Typography>
              </Grid>

              <Grid xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <FormControl>
                      <FormLabel>Watering Tips</FormLabel>
                      <Textarea
                        name="wateringTips"
                        value={careGuide.wateringTips || ''}
                        onChange={handleFieldChange}
                        placeholder="How often to water, how much water to use, etc."
                        minRows={2}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <FormControl>
                      <FormLabel>Light Tips</FormLabel>
                      <Textarea
                        name="lightTips"
                        value={careGuide.lightTips || ''}
                        onChange={handleFieldChange}
                        placeholder="Light requirements, ideal placement, etc."
                        minRows={2}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <FormControl>
                      <FormLabel>Temperature Tips</FormLabel>
                      <Textarea
                        name="temperatureTips"
                        value={careGuide.temperatureTips || ''}
                        onChange={handleFieldChange}
                        placeholder="Ideal temperature range, humidity needs, etc."
                        minRows={2}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <FormControl>
                      <FormLabel>Fertilizer Tips</FormLabel>
                      <Textarea
                        name="fertilizerTips"
                        value={careGuide.fertilizerTips || ''}
                        onChange={handleFieldChange}
                        placeholder="Fertilizing schedule, type of fertilizer, etc."
                        minRows={2}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              {/* Additional Quick Tips */}
              <Grid xs={12}>
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Typography level="title-sm" sx={{ mb: 2 }}>Additional Quick Tips</Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
                      {careGuide.quickTips && careGuide.quickTips.map((tip, index) => (
                        <Chip 
                          key={index} 
                          color="primary" 
                          variant="soft"
                          endDecorator={
                            <IconButton 
                              variant="plain" 
                              color="neutral" 
                              size="sm"
                              onClick={() => handleRemoveQuickTip(index)}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          }
                        >
                          {tip}
                        </Chip>
                      ))}
                    </Stack>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <FormControl sx={{ flexGrow: 1 }}>
                      <Input
                        value={newQuickTip}
                        onChange={(e) => setNewQuickTip(e.target.value)}
                        placeholder="Enter a quick tip"
                      />
                    </FormControl>
                    <Button
                      onClick={handleAddQuickTip}
                      startDecorator={<Add />}
                      disabled={!newQuickTip.trim()}
                    >
                      Add Tip
                    </Button>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Content Sections */}
          <TabPanel value={2}>
            <Box>
              <Typography level="title-md" sx={{ mb: 2 }}>Content Sections</Typography>
              <Typography level="body-sm" color="neutral" sx={{ mb: 3 }}>
                Add detailed content sections for your care guide. Each section should focus on a specific aspect of plant care.
              </Typography>

              {/* List of existing content sections */}
              {careGuide.content && careGuide.content.length > 0 ? (
                <Box sx={{ mb: 4 }}>
                  {careGuide.content.map((section, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography level="title-md">{section.title}</Typography>
                          <Box>
                            <IconButton 
                              size="sm" 
                              variant="plain" 
                              color="primary"
                              onClick={() => handleEditContentSection(index)}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="sm" 
                              variant="plain" 
                              color="danger"
                              onClick={() => handleRemoveContentSection(index)}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography level="body-sm" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                          {section.text.length > 100 ? `${section.text.substring(0, 100)}...` : section.text}
                        </Typography>
                        
                        {section.imageURL && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Image fontSize="small" />
                            <Typography level="body-xs" color="neutral">
                              {section.imageCaption || 'Image attached'}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Card variant="outlined" sx={{ mb: 3, p: 3, textAlign: 'center' }}>
                  <Typography level="body-md" color="neutral">
                    No content sections added yet. Add your first section below.
                  </Typography>
                </Card>
              )}

              {/* Add/Edit section form */}
              <Card variant="outlined" sx={{ p: 3 }}>
                <Typography level="title-sm" sx={{ mb: 2 }}>
                  {editingSectionIndex >= 0 ? 'Edit Section' : 'Add New Section'}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <FormControl>
                      <FormLabel>Section Title</FormLabel>
                      <Input
                        name="title"
                        value={newContentSection.title}
                        onChange={handleContentFieldChange}
                        placeholder="E.g., Watering, Light Requirements, Propagation"
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid xs={12}>
                    <FormControl>
                      <FormLabel>Content</FormLabel>
                      <Textarea
                        name="text"
                        value={newContentSection.text}
                        onChange={handleContentFieldChange}
                        minRows={4}
                        placeholder="Write detailed content for this section..."
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid xs={12}>
                    <FormControl>
                      <FormLabel>Section Image URL (Optional)</FormLabel>
                      <Input
                        name="imageURL"
                        value={newContentSection.imageURL}
                        onChange={handleContentFieldChange}
                        placeholder="Enter image URL"
                        startDecorator={<Image />}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid xs={12}>
                    <FormControl>
                      <FormLabel>Image Caption (Optional)</FormLabel>
                      <Input
                        name="imageCaption"
                        value={newContentSection.imageCaption}
                        onChange={handleContentFieldChange}
                        placeholder="Enter a caption for the image"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  {editingSectionIndex >= 0 && (
                    <Button
                      variant="plain"
                      color="neutral"
                      onClick={() => {
                        setNewContentSection({ title: '', text: '', imageURL: '', imageCaption: '' });
                        setEditingSectionIndex(-1);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                  )}
                  
                  <Button
                    startDecorator={editingSectionIndex >= 0 ? <Edit /> : <NoteAdd />}
                    onClick={handleAddContentSection}
                    disabled={!newContentSection.title.trim() || !newContentSection.text.trim()}
                  >
                    {editingSectionIndex >= 0 ? 'Update Section' : 'Add Section'}
                  </Button>
                </Box>
              </Card>
            </Box>
          </TabPanel>

          {/* Tab 4: Expert Tips & Problems */}
          <TabPanel value={3}>
            <Grid container spacing={3}>
              {/* Expert Tip Section */}
              <Grid xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>Expert Tip</Typography>
                    
                    <FormControl sx={{ mb: 2 }}>
                      <FormLabel>Expert Tip</FormLabel>
                      <Textarea
                        name="expertTip"
                        value={careGuide.expertTip || ''}
                        onChange={handleFieldChange}
                        minRows={3}
                        placeholder="Share a valuable tip from an expert"
                      />
                    </FormControl>
                <Grid container spacing={2}>
                      <Grid xs={12} sm={6}>
                        <FormControl>
                          <FormLabel>Expert Name</FormLabel>
                          <Input
                            name="expertName"
                            value={careGuide.expertName || ''}
                            onChange={handleFieldChange}
                            placeholder="Name of the expert"
                          />
                        </FormControl>
                      </Grid>
                      
                      <Grid xs={12} sm={6}>
                        <FormControl>
                          <FormLabel>Expert Title</FormLabel>
                          <Input
                            name="expertTitle"
                            value={careGuide.expertTitle || ''}
                            onChange={handleFieldChange}
                            placeholder="Expert's title or role"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Common Problems Section */}
              <Grid xs={12}>
                <Typography level="title-md" sx={{ mb: 2 }}>Common Problems & Solutions</Typography>
                
                {/* List of existing problems */}
                {careGuide.commonProblems && careGuide.commonProblems.length > 0 ? (
                  <Box sx={{ mb: 3 }}>
                    {careGuide.commonProblems.map((item, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography level="title-sm" fontWeight="bold">{item.problem}</Typography>
                            <Box>
                              <IconButton 
                                size="sm" 
                                variant="plain" 
                                color="primary"
                                onClick={() => handleEditProblem(index)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="sm" 
                                variant="plain" 
                                color="danger"
                                onClick={() => handleRemoveProblem(index)}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography level="body-sm" sx={{ mt: 1 }}>{item.solution}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Card variant="outlined" sx={{ mb: 3, p: 3, textAlign: 'center' }}>
                    <Typography level="body-md" color="neutral">
                      No common problems added yet. Help your customers by adding common issues and solutions.
                    </Typography>
                  </Card>
                )}

                {/* Add/Edit problem form */}
                <Card variant="outlined" sx={{ p: 3 }}>
                  <Typography level="title-sm" sx={{ mb: 2 }}>
                    {editingProblemIndex >= 0 ? 'Edit Problem' : 'Add New Problem'}
                  </Typography>
                  
                  <FormControl sx={{ mb: 2 }}>
                    <FormLabel>Problem</FormLabel>
                    <Input
                      name="problem"
                      value={newProblem.problem}
                      onChange={handleProblemFieldChange}
                      placeholder="Describe the problem (e.g., Yellow Leaves)"
                    />
                  </FormControl>
                  
                  <FormControl sx={{ mb: 2 }}>
                    <FormLabel>Solution</FormLabel>
                    <Textarea
                      name="solution"
                      value={newProblem.solution}
                      onChange={handleProblemFieldChange}
                      minRows={3}
                      placeholder="Describe the solution to this problem"
                    />
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    {editingProblemIndex >= 0 && (
                      <Button
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setNewProblem({ problem: '', solution: '' });
                          setEditingProblemIndex(-1);
                        }}
                        sx={{ mr: 1 }}
                      >
                        Cancel
                      </Button>
                    )}
                    
                    <Button
                      startDecorator={editingProblemIndex >= 0 ? <Edit /> : <Add />}
                      onClick={handleAddProblem}
                      disabled={!newProblem.problem.trim() || !newProblem.solution.trim()}
                    >
                      {editingProblemIndex >= 0 ? 'Update Problem' : 'Add Problem'}
                    </Button>
                  </Box>
                </Card>
              </Grid>

              {/* Related Products Section */}
              <Grid xs={12} sx={{ mt: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="title-md" sx={{ mb: 2 }}>Related Products</Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
                        {careGuide.relatedProducts && careGuide.relatedProducts.map((product, index) => (
                          <Chip 
                            key={index} 
                            color="primary" 
                            variant="soft"
                            endDecorator={
                              <IconButton 
                                variant="plain" 
                                color="neutral" 
                                size="sm"
                                onClick={() => handleRemoveRelatedProduct(index)}
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            }
                          >
                            {product}
                          </Chip>
                        ))}
                      </Stack>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <FormControl sx={{ flexGrow: 1 }}>
                        <Input
                          value={newRelatedProduct}
                          onChange={(e) => setNewRelatedProduct(e.target.value)}
                          placeholder="Enter product ID"
                        />
                      </FormControl>
                      <Button
                        onClick={handleAddRelatedProduct}
                        startDecorator={<Add />}
                        disabled={!newRelatedProduct.trim()}
                      >
                        Add Product
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Form Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => navigate('/admin/careguide-list')}
              startDecorator={<ArrowBack />}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="solid"
              color="primary"
              startDecorator={<Save />}
              loading={isLoading}
              disabled={isLoading}
            >
              {isEditMode ? 'Update Care Guide' : 'Create Care Guide'}
            </Button>
          </Box>
        </form>
      </Tabs>

      {/* Confirmation Dialog for Delete */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalDialog variant="outlined" color="danger">
          <ModalClose />
          <Typography level="h4">Delete Care Guide</Typography>
          <Typography level="body-md" sx={{ mt: 1, mb: 2 }}>
            Are you sure you want to delete this care guide? This action cannot be undone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="solid" 
              color="danger" 
              onClick={handleDeleteCareGuide}
              loading={isDeleting}
            >
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        color={snackbarColor}
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        autoHideDuration={6000}
        startDecorator={snackbarColor === 'success' ? <CheckCircle /> : <Warning />}
        sx={{ zIndex: 2000 }}
      >
        {snackbarMessage}
      </Snackbar>
    </Sheet>
  );
};

export default CareGuideForm;