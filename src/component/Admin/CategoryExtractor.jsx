import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Assuming this is your Firebase config import
import { 
  Button, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress,
  Table,
  Sheet,
  Modal,
  ModalDialog,
  ModalClose,
  Input,
  FormControl,
  FormLabel,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Card,
  IconButton,
  Tooltip,
  Chip,
  AspectRatio,
  Select,
  Option
} from '@mui/joy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import ExtractSettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

const CategoryManager = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [extractionResult, setExtractionResult] = useState({ success: false, message: '', categories: [] });
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // Category Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', or 'delete'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    slug: '',
    imageUrl: '',
    count: 0
  });
  
  // Extraction Settings Modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [extractionSettings, setExtractionSettings] = useState({
    overwriteExisting: false,
    updateCounts: true,
    updateImages: true
  });
  
  const navigate = useNavigate();

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort categories by name
      categoriesData.sort((a, b) => a.name.localeCompare(b.name));
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(`Error fetching categories: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const extractAndSaveCategories = async () => {
    setIsExtracting(true);
    setExtractionResult({ success: false, message: '', categories: [] });
    setError(null);
    
    try {
      // Get all products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get existing categories
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const existingCategories = new Map();
      categoriesSnapshot.docs.forEach(doc => {
        existingCategories.set(doc.id, { id: doc.id, ...doc.data() });
      });
      
      // Extract categories from products
      const extractedCategories = new Map();
      
      products.forEach(product => {
        // Check if the product has a category
        if (product.category) {
          // If it's a string, add it directly
          if (typeof product.category === 'string') {
            const categoryId = product.category.replace(/\s+/g, '-').toLowerCase();
            
            if (!extractedCategories.has(categoryId)) {
              extractedCategories.set(categoryId, {
                name: product.category,
                count: 1,
                imageUrl: product.imageSrc || '' 
              });
            } else {
              // Increment count for existing category
              const category = extractedCategories.get(categoryId);
              extractedCategories.set(categoryId, {
                ...category,
                count: category.count + 1,
                // Update image if current one is better
                imageUrl: category.imageUrl || product.imageSrc || ''
              });
            }
          } 
          // If it's an object with an id and name (like a reference), use it
          else if (product.category.id && product.category.name) {
            const categoryId = product.category.id;
            
            if (!extractedCategories.has(categoryId)) {
              extractedCategories.set(categoryId, {
                name: product.category.name,
                count: 1,
                imageUrl: product.imageSrc || ''
              });
            } else {
              // Increment count for existing category
              const category = extractedCategories.get(categoryId);
              extractedCategories.set(categoryId, {
                ...category,
                count: category.count + 1,
                // Update image if current one is better
                imageUrl: category.imageUrl || product.imageSrc || ''
              });
            }
          }
        }
      });
      
      // Process the results
      const newCategories = [];
      const updatedCategories = [];
      
      // Handle each extracted category
      for (const [categoryId, categoryData] of extractedCategories.entries()) {
        // Check if this category already exists
        if (existingCategories.has(categoryId)) {
          // Category exists, update it if settings allow
          const existingCategory = existingCategories.get(categoryId);
          
          const updates = {};
          let shouldUpdate = false;
          
          // Update count if setting is enabled
          if (extractionSettings.updateCounts && existingCategory.count !== categoryData.count) {
            updates.count = categoryData.count;
            updates.updatedAt = new Date();
            shouldUpdate = true;
          }
          
          // Update image if setting is enabled and there's a new image
          if (extractionSettings.updateImages && 
              categoryData.imageUrl && 
              (!existingCategory.imageUrl || existingCategory.imageUrl.includes('placeholder'))) {
            updates.imageUrl = categoryData.imageUrl;
            updates.updatedAt = new Date();
            shouldUpdate = true;
          }
          
          // Update if needed
          if (shouldUpdate) {
            await updateDoc(doc(db, 'categories', categoryId), updates);
            updatedCategories.push({
              id: categoryId,
              name: existingCategory.name,
              ...updates
            });
          }
        } 
        else if (extractionSettings.overwriteExisting || !existingCategories.has(categoryId)) {
          // This is a new category or we're allowed to overwrite
          const newCategoryDoc = {
            ...categoryData,
            id: categoryId,
            createdAt: new Date(),
            updatedAt: new Date(),
            slug: categoryId
          };
          
          // Save the new category
          await setDoc(doc(db, 'categories', categoryId), newCategoryDoc);
          newCategories.push(newCategoryDoc);
        }
      }
      
      // Refresh categories
      await fetchCategories();
      
      // Set result message
      let resultMsg = '';
      if (newCategories.length > 0) {
        resultMsg += `Created ${newCategories.length} new categories. `;
      }
      if (updatedCategories.length > 0) {
        resultMsg += `Updated ${updatedCategories.length} existing categories. `;
      }
      if (newCategories.length === 0 && updatedCategories.length === 0) {
        resultMsg = 'No changes needed. All categories are up to date.';
      }
      
      setExtractionResult({
        success: true,
        message: resultMsg,
        categories: [...newCategories, ...updatedCategories]
      });
      
    } catch (error) {
      console.error('Error extracting categories:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const openCreateModal = () => {
    setCategoryForm({
      id: '',
      name: '',
      slug: '',
      imageUrl: '',
      count: 0
    });
    setModalMode('create');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      id: category.id,
      name: category.name,
      slug: category.slug || category.id,
      imageUrl: category.imageUrl || '',
      count: category.count || 0
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setModalMode('delete');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({
      ...categoryForm,
      [name]: value
    });
    
    // Auto-generate slug from name if editing the name
    if (name === 'name' && modalMode === 'create') {
      setCategoryForm(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-')
      }));
    }
  };

  const handleCreateCategory = async () => {
    try {
      setError(null);
      
      // Validate form
      if (!categoryForm.name) {
        setError('Category name is required');
        return;
      }
      
      // Generate ID from slug if not provided
      const categoryId = categoryForm.id || categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-');
      
      // Check if category already exists
      const categoryDoc = await getDoc(doc(db, 'categories', categoryId));
      if (categoryDoc.exists()) {
        setError(`A category with the ID "${categoryId}" already exists.`);
        return;
      }
      
      // Create category
      const newCategory = {
        id: categoryId,
        name: categoryForm.name,
        slug: categoryForm.slug || categoryId,
        imageUrl: categoryForm.imageUrl || 'https://via.placeholder.com/400x300?text=Category',
        count: parseInt(categoryForm.count) || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'categories', categoryId), newCategory);
      
      // Update UI
      setCategories([...categories, newCategory]);
      setShowModal(false);
      setExtractionResult({
        success: true,
        message: `Successfully created category "${newCategory.name}"`,
        categories: [newCategory]
      });
      
    } catch (error) {
      console.error('Error creating category:', error);
      setError(`Error creating category: ${error.message}`);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      setError(null);
      
      // Validate form
      if (!categoryForm.name) {
        setError('Category name is required');
        return;
      }
      
      // Update category
      const updatedCategory = {
        name: categoryForm.name,
        slug: categoryForm.slug,
        imageUrl: categoryForm.imageUrl || selectedCategory.imageUrl,
        count: parseInt(categoryForm.count) || 0,
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'categories', selectedCategory.id), updatedCategory);
      
      // Update UI
      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id 
          ? { ...cat, ...updatedCategory } 
          : cat
      ));
      
      setShowModal(false);
      setExtractionResult({
        success: true,
        message: `Successfully updated category "${updatedCategory.name}"`,
        categories: [{ id: selectedCategory.id, ...updatedCategory }]
      });
      
    } catch (error) {
      console.error('Error updating category:', error);
      setError(`Error updating category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteDoc(doc(db, 'categories', selectedCategory.id));
      
      // Update UI
      setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
      setShowModal(false);
      setExtractionResult({
        success: true,
        message: `Successfully deleted category "${selectedCategory.name}"`,
        categories: []
      });
      
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(`Error deleting category: ${error.message}`);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography level="h3" sx={{ mb: 3 }}>
        Category Manager
      </Typography>
      
      <Tabs
        value={activeTab}
        onChange={(event, value) => setActiveTab(value)}
        sx={{ mb: 3 }}
      >
        <TabList>
          <Tab>Category List</Tab>
          <Tab>Extraction Tool</Tab>
        </TabList>
        
        <TabPanel value={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography level="h4">All Categories ({categories.length})</Typography>
            <Button 
              startDecorator={<AddIcon />} 
              onClick={openCreateModal}
              color="primary"
            >
              Create Category
            </Button>
          </Box>
          
          {error && (
            <Alert color="danger" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {extractionResult.success && (
            <Alert color="success" sx={{ mb: 3 }} onClose={() => setExtractionResult({ success: false })}>
              {extractionResult.message}
            </Alert>
          )}
          
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size="lg" />
            </Box>
          ) : categories.length > 0 ? (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md',
                overflow: 'auto',
                mb: 3
              }}
            >
              <Table 
                stickyHeader 
                hoverRow 
                sx={{ 
                  '& thead th': { 
                    bgcolor: 'background.level1',
                    fontWeight: 'bold' 
                  } 
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Image</th>
                    <th>Name</th>
                    <th>ID / Slug</th>
                    <th>Count</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <AspectRatio 
                          ratio="1" 
                          sx={{ 
                            width: 100, 
                            borderRadius: 'md', 
                            overflow: 'hidden',
                            bgcolor: 'background.level1'
                          }}
                        >
                          <img 
                            src={category.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'} 
                            alt={category.name}
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Error';
                            }}
                          />
                        </AspectRatio>
                      </td>
                      <td>
                        <Typography fontWeight="md">{category.name}</Typography>
                      </td>
                      <td>
                        <Typography level="body-sm" sx={{ fontFamily: 'monospace' }}>
                          {category.id}
                        </Typography>
                        {category.slug && category.slug !== category.id && (
                          <Typography level="body-xs" sx={{ fontFamily: 'monospace', color: 'text.tertiary' }}>
                            Slug: {category.slug}
                          </Typography>
                        )}
                      </td>
                      <td>
                        <Chip 
                          size="sm" 
                          variant="soft" 
                          color={category.count > 0 ? 'success' : 'neutral'}
                        >
                          {category.count || 0} products
                        </Chip>
                      </td>
                      <td>
                        <Typography level="body-sm">
                          {formatTimestamp(category.createdAt)}
                        </Typography>
                      </td>
                      <td>
                        <Typography level="body-sm">
                          {formatTimestamp(category.updatedAt)}
                        </Typography>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit Category">
                            <IconButton 
                              size="sm" 
                              variant="plain" 
                              color="neutral" 
                              onClick={() => openEditModal(category)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Category">
                            <IconButton 
                              size="sm" 
                              variant="plain" 
                              color="danger" 
                              onClick={() => openDeleteModal(category)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          ) : (
            <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography level="body-lg">
                No categories found. Create a new category or use the extraction tool.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                <Button 
                  onClick={openCreateModal} 
                  startDecorator={<AddIcon />}
                >
                  Create Category
                </Button>
                <Button 
                  onClick={() => setActiveTab(1)} 
                  variant="outlined"
                  startDecorator={<UploadIcon />}
                >
                  Extract from Products
                </Button>
              </Box>
            </Card>
          )}
        </TabPanel>
        
        <TabPanel value={1}>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography level="h4">Category Extraction Tool</Typography>
              <Button 
                variant="outlined" 
                color="neutral" 
                onClick={() => setShowSettingsModal(true)}
                startDecorator={<ExtractSettingsIcon />}
              >
                Extraction Settings
              </Button>
            </Box>
            
            <Alert color="info" sx={{ mb: 3 }}>
              This tool will scan all products in your database, extract unique categories, and save them to the categories collection. 
              <br />
              <strong>Current settings:</strong> 
              {extractionSettings.overwriteExisting ? ' Overwrite existing categories,' : ' Keep existing categories,'} 
              {extractionSettings.updateCounts ? ' Update product counts,' : ' Keep original product counts,'} 
              {extractionSettings.updateImages ? ' Update category images.' : ' Keep original category images.'}
            </Alert>
            
            {error && (
              <Alert color="danger" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Button 
              color="success" 
              size="lg" 
              variant="solid" 
              onClick={extractAndSaveCategories}
              disabled={isExtracting}
              startDecorator={isExtracting ? <CircularProgress size="sm" /> : <UploadIcon />}
              sx={{ mb: 3, width: '100%' }}
            >
              {isExtracting ? 'Extracting Categories...' : 'Extract Categories from Products'}
            </Button>
            
            {extractionResult.success && (
              <Box>
                <Alert color="success" sx={{ mb: 3 }}>
                  {extractionResult.message}
                </Alert>
                
                {extractionResult.categories.length > 0 && (
                  <>
                    <Typography level="h5" sx={{ mb: 2, mt: 4 }}>
                      Changes ({extractionResult.categories.length})
                    </Typography>
                    
                    <Sheet 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 'md',
                        overflow: 'hidden',
                        maxHeight: 300,
                        overflowY: 'auto'
                      }}
                    >
                      <Table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>ID</th>
                            <th>Count</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractionResult.categories.map(category => (
                            <tr key={category.id}>
                              <td>
                                <Typography fontWeight="md">{category.name}</Typography>
                              </td>
                              <td>
                                <Typography level="body-sm" sx={{ fontFamily: 'monospace' }}>
                                  {category.id}
                                </Typography>
                              </td>
                              <td>{category.count || 0}</td>
                              <td>
                                <Chip 
                                  size="sm" 
                                  color={category.createdAt ? 'success' : 'primary'}
                                >
                                  {category.createdAt ? 'Created' : 'Updated'}
                                </Chip>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Sheet>
                  </>
                )}
              </Box>
            )}
          </Box>
        </TabPanel>
      </Tabs>
      
      {/* Category Form Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalDialog
          aria-labelledby="category-modal-title"
          size="md"
        >
          <ModalClose />
          <Typography id="category-modal-title" level="h4">
            {modalMode === 'create' ? 'Create New Category' : 
             modalMode === 'edit' ? 'Edit Category' : 'Delete Category'}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {modalMode === 'delete' ? (
            <Box sx={{ my: 3 }}>
              <Alert color="danger" sx={{ mb: 3 }}>
                Are you sure you want to delete the category "{selectedCategory?.name}"? 
                <br />
                This action cannot be undone.
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="plain" 
                  color="neutral" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  color="danger" 
                  onClick={handleDeleteCategory}
                >
                  Delete Category
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ my: 2 }}>
              <FormControl required sx={{ mb: 2 }}>
                <FormLabel>Category Name</FormLabel>
                <Input 
                  name="name"
                  value={categoryForm.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Indoor Plants"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Slug</FormLabel>
                <Input 
                  name="slug"
                  value={categoryForm.slug}
                  onChange={handleFormChange}
                  placeholder="e.g. indoor-plants"
                  helperText="URL-friendly identifier, auto-generated from name if left blank"
                />
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Image URL</FormLabel>
                <Input 
                  name="imageUrl"
                  value={categoryForm.imageUrl}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                />
                
                {categoryForm.imageUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Typography level="body-sm" sx={{ mb: 1 }}>Image Preview:</Typography>
                    <AspectRatio ratio="16/9" sx={{ maxWidth: 300, borderRadius: 'md', overflow: 'hidden' }}>
                      <img 
                        src={categoryForm.imageUrl} 
                        alt="Category preview" 
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                        }}
                      />
                    </AspectRatio>
                  </Box>
                )}
              </FormControl>
              
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Product Count</FormLabel>
                <Input 
                  name="count"
                  type="number"
                  value={categoryForm.count}
                  onChange={handleFormChange}
                  min={0}
                />
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  variant="plain" 
                  color="neutral" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={modalMode === 'create' ? handleCreateCategory : handleUpdateCategory}
                >
                  {modalMode === 'create' ? 'Create Category' : 'Update Category'}
                </Button>
              </Box>
            </Box>
          )}
        </ModalDialog>
      </Modal>
      
      {/* Extraction Settings Modal */}
      <Modal open={showSettingsModal} onClose={() => setShowSettingsModal(false)}>
        <ModalDialog
          aria-labelledby="extraction-settings-modal"
          size="md"
        >
          <ModalClose />
          <Typography id="extraction-settings-modal" level="h4">
            Category Extraction Settings
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ my: 2 }}>
            <FormControl sx={{ mb: 3 }}>
              <FormLabel>Existing Categories</FormLabel>
              <Select
                value={extractionSettings.overwriteExisting ? "overwrite" : "keep"}
                onChange={(_, value) => setExtractionSettings({
                  ...extractionSettings,
                  overwriteExisting: value === "overwrite"
                })}
              >
                <Option value="keep">Keep existing categories</Option>
                <Option value="overwrite">Overwrite existing categories</Option>
              </Select>
              <Typography level="body-sm" sx={{ mt: 1, color: 'text.tertiary' }}>
                When a category already exists, should it be overwritten or kept?
              </Typography>
            </FormControl>
            
            <FormControl sx={{ mb: 3 }}>
              <FormLabel>Product Counts</FormLabel>
              <Select
                value={extractionSettings.updateCounts ? "update" : "keep"}
                onChange={(_, value) => setExtractionSettings({
                  ...extractionSettings,
                  updateCounts: value === "update"
                })}
              >
                <Option value="update">Update product counts</Option>
                <Option value="keep">Keep original product counts</Option>
              </Select>
              <Typography level="body-sm" sx={{ mt: 1, color: 'text.tertiary' }}>
                Should product counts be updated based on current products?
              </Typography>
            </FormControl>
            
            <FormControl sx={{ mb: 3 }}>
              <FormLabel>Category Images</FormLabel>
              <Select
                value={extractionSettings.updateImages ? "update" : "keep"}
                onChange={(_, value) => setExtractionSettings({
                  ...extractionSettings,
                  updateImages: value === "update"
                })}
              >
                <Option value="update">Update category images from products</Option>
                <Option value="keep">Keep original category images</Option>
              </Select>
              <Typography level="body-sm" sx={{ mt: 1, color: 'text.tertiary' }}>
                Should category images be updated from products? 
                Images will only be updated if the category has no image or uses a placeholder.
              </Typography>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="plain" 
              color="neutral" 
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowSettingsModal(false)}>
              Save Settings
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default CategoryManager;