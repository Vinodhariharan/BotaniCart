import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../auth'; // Adjust the path to your firebase config file
import { 
  Sheet,
  Table,
  Typography,
  Button,
  Input,
  Box,
  Checkbox,
  IconButton,
  Chip,
  Tooltip,
  Divider,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
  Select,
  Option,
  Slider
} from '@mui/joy';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import { Filter, MenuBook, Spa, Pets, EmojiNature } from '@mui/icons-material';

const CareGuideList = () => {
  const [careGuides, setCareGuides] = useState([]);
  const [allCareGuides, setAllCareGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCareGuide, setSelectedCareGuide] = useState(null);
  const [careGuideFlags, setCareGuideFlags] = useState({
    featured: false,
    beginner: false,
    seasonal: false
  });
  const [categories, setCategories] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read all filters from URL params
  const getFiltersFromParams = () => {
    return {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      difficulty: searchParams.get('difficulty') || '',
      featured: searchParams.get('featured') === 'true',
      beginner: searchParams.get('beginner') === 'true',
      seasonal: searchParams.get('seasonal') === 'true',
    };
  };

  // Set initial filter states from URL
  const currentFilters = getFiltersFromParams();
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category);
  const [selectedDifficulty, setSelectedDifficulty] = useState(currentFilters.difficulty);
  const [statusFilters, setStatusFilters] = useState({
    featured: currentFilters.featured,
    beginner: currentFilters.beginner,
    seasonal: currentFilters.seasonal
  });

  useEffect(() => {
    const fetchCareGuides = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'careguides'));
        const careGuidesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setAllCareGuides(careGuidesData || []);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(careGuidesData.map(g => g.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        // Extract unique difficulty levels
        const uniqueDifficulties = [...new Set(careGuidesData.map(g => g.difficulty).filter(Boolean))];
        setDifficultyLevels(uniqueDifficulties);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching care guides:", err);
        setLoading(false);
      }
    };
    fetchCareGuides();
  }, []);

  // Update URL params when filters change
  const updateUrlParams = (newFilters) => {
    const updatedParams = new URLSearchParams();
    
    if (newFilters.search) updatedParams.set('search', newFilters.search);
    if (newFilters.category) updatedParams.set('category', newFilters.category);
    if (newFilters.difficulty) updatedParams.set('difficulty', newFilters.difficulty);
    if (newFilters.featured) updatedParams.set('featured', 'true');
    if (newFilters.beginner) updatedParams.set('beginner', 'true');
    if (newFilters.seasonal) updatedParams.set('seasonal', 'true');
    
    setSearchParams(updatedParams);
  };

  // Apply all filters
  useEffect(() => {
    if (allCareGuides.length === 0) return;
    
    const filters = getFiltersFromParams();
    
    const filtered = allCareGuides.filter(guide => {
      // Text search filter
      const matchesSearch = !filters.search || 
        guide.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        guide.category?.toLowerCase().includes(filters.search.toLowerCase()) ||
        guide.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      // Category filter
      const matchesCategory = !filters.category || guide.category === filters.category;
      
      // Difficulty filter
      const matchesDifficulty = !filters.difficulty || guide.difficulty === filters.difficulty;
      
      // Status filters
      const matchesFeatured = !filters.featured || guide.featured;
      const matchesBeginner = !filters.beginner || guide.beginner;
      const matchesSeasonal = !filters.seasonal || guide.seasonal;
      
      return matchesSearch && matchesCategory && matchesDifficulty && 
             matchesFeatured && matchesBeginner && matchesSeasonal;
    });
    
    setCareGuides(filtered);
  }, [allCareGuides, searchParams]);

  const handleApplyFilters = () => {
    updateUrlParams({
      search: searchTerm,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      featured: statusFilters.featured,
      beginner: statusFilters.beginner,
      seasonal: statusFilters.seasonal
    });
    
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setStatusFilters({
      featured: false,
      beginner: false,
      seasonal: false
    });
    
    setSearchParams(new URLSearchParams());
  };

  const handleEdit = (id) => {
    navigate(`/admin/update-careguide/${id}`);
  };

  const openFlagsModal = (careGuide) => {
    setSelectedCareGuide(careGuide);
    setCareGuideFlags({
      featured: careGuide.featured || false,
      beginner: careGuide.beginner || false,
      seasonal: careGuide.seasonal || false
    });
    setShowModal(true);
  };

  const handleSaveFlags = async () => {
    if (!selectedCareGuide) return;
    
    try {
      const careGuideRef = doc(db, 'careguides', selectedCareGuide.id);
      await updateDoc(careGuideRef, {
        featured: careGuideFlags.featured,
        beginner: careGuideFlags.beginner,
        seasonal: careGuideFlags.seasonal,
      });
      
      // Update local state to reflect changes
      const updatedCareGuides = allCareGuides.map(g => 
        g.id === selectedCareGuide.id 
          ? { ...g, ...careGuideFlags } 
          : g
      );
      
      setAllCareGuides(updatedCareGuides);
      
      // Re-apply filters to updated care guide list
      const filters = getFiltersFromParams();
      setCareGuides(updatedCareGuides.filter(guide => {
        // Reapply all the filters
        // Text search filter
        const matchesSearch = !filters.search || 
          guide.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          guide.category?.toLowerCase().includes(filters.search.toLowerCase()) ||
          guide.description?.toLowerCase().includes(filters.search.toLowerCase());
        
        // Category filter
        const matchesCategory = !filters.category || guide.category === filters.category;
        
        // Difficulty filter
        const matchesDifficulty = !filters.difficulty || guide.difficulty === filters.difficulty;
        
        // Status filters
        const matchesFeatured = !filters.featured || guide.featured;
        const matchesBeginner = !filters.beginner || guide.beginner;
        const matchesSeasonal = !filters.seasonal || guide.seasonal;
        
        return matchesSearch && matchesCategory && matchesDifficulty && 
              matchesFeatured && matchesBeginner && matchesSeasonal;
      }));
      
      setShowModal(false);
    } catch (error) {
      console.error("Error updating care guide flags:", error);
    }
  };

  // Handle search input with URL params
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    const currentParams = getFiltersFromParams();
    if (value) {
      currentParams.search = value;
    } else {
      delete currentParams.search;
    }
    
    updateUrlParams(currentParams);
  };

  // Get active filter count (excluding search)
  const getActiveFilterCount = () => {
    const filters = getFiltersFromParams();
    let count = 0;
    
    if (filters.category) count++;
    if (filters.difficulty) count++;
    if (filters.featured) count++;
    if (filters.beginner) count++;
    if (filters.seasonal) count++;
    
    return count;
  };

  return (
    <Sheet 
      variant="outlined" 
      sx={{ 
        width: '100%', 
        p: 4,
        borderRadius: 'md',
        boxShadow: 'sm'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography level="h4">Care Guide List</Typography>
        <Button 
          onClick={() => navigate('/admin/add-careguide')} 
          size="md"
          color="primary"
          startDecorator={<MenuBook />}
        >
          Add New Care Guide
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          <Input
            placeholder="Search care guides by title, category or description..."
            value={searchTerm}
            onChange={handleSearch}
            startDecorator={<SearchIcon />}
            size="lg"
            sx={{ width: '100%' }}
          />
        </Box>
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<FilterAltIcon />}
          onClick={() => setShowFilters(!showFilters)}
          endDecorator={getActiveFilterCount() > 0 && (
            <Chip size="sm" variant="solid" color="primary">
              {getActiveFilterCount()}
            </Chip>
          )}
        >
          Filters
        </Button>
      </Box>
      
      {/* Advanced Filters Panel */}
      {showFilters && (
        <Sheet 
          variant="outlined" 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 'md',
            bgcolor: 'background.level1' 
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography level="title-md">Advanced Filters</Typography>
            <IconButton size="sm" variant="plain" onClick={() => setShowFilters(false)}>
              <ClearIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Category Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <FormLabel>Plant Category</FormLabel>
              <Select 
                placeholder="All Categories" 
                value={selectedCategory}
                onChange={(_, val) => setSelectedCategory(val)}
                sx={{ width: '100%' }}
                startDecorator={<EmojiNature />}
              >
                <Option value="">All Categories</Option>
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </FormControl>
            
            {/* Difficulty Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <FormLabel>Care Difficulty</FormLabel>
              <Select 
                placeholder="All Difficulty Levels" 
                value={selectedDifficulty}
                onChange={(_, val) => setSelectedDifficulty(val)}
                sx={{ width: '100%' }}
                startDecorator={<Spa />}
              >
                <Option value="">All Difficulty Levels</Option>
                {difficultyLevels.map(difficulty => (
                  <Option key={difficulty} value={difficulty}>{difficulty}</Option>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          {/* Status Filters */}
          <Typography level="title-sm" sx={{ mt: 3, mb: 2 }}>Guide Status</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              variant={statusFilters.featured ? "solid" : "soft"}
              color={statusFilters.featured ? "warning" : "neutral"}
              startDecorator={<StarIcon fontSize="small" />}
              onClick={() => setStatusFilters({...statusFilters, featured: !statusFilters.featured})}
            >
              Featured
            </Chip>
            <Chip
              variant={statusFilters.beginner ? "solid" : "soft"}
              color={statusFilters.beginner ? "success" : "neutral"}
              startDecorator={<Pets fontSize="small" />}
              onClick={() => setStatusFilters({...statusFilters, beginner: !statusFilters.beginner})}
            >
              Beginner Friendly
            </Chip>
            <Chip
              variant={statusFilters.seasonal ? "solid" : "soft"}
              color={statusFilters.seasonal ? "primary" : "neutral"}
              startDecorator={<NewReleasesIcon fontSize="small" />}
              onClick={() => setStatusFilters({...statusFilters, seasonal: !statusFilters.seasonal})}
            >
              Seasonal
            </Chip>
          </Box>
          
          {/* Filter Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              variant="plain" 
              color="neutral" 
              onClick={handleClearFilters}
            >
              Clear All
            </Button>
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </Box>
        </Sheet>
      )}
      
      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {currentFilters.category && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="primary"
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setSelectedCategory('');
                const params = new URLSearchParams(searchParams);
                params.delete('category');
                setSearchParams(params);
              }}
            >
              Category: {currentFilters.category}
            </Chip>
          )}
          
          {currentFilters.difficulty && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="primary"
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setSelectedDifficulty('');
                const params = new URLSearchParams(searchParams);
                params.delete('difficulty');
                setSearchParams(params);
              }}
            >
              Difficulty: {currentFilters.difficulty}
            </Chip>
          )}
          
          {currentFilters.featured && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="warning"
              startDecorator={<StarIcon fontSize="small" />}
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setStatusFilters({...statusFilters, featured: false});
                const params = new URLSearchParams(searchParams);
                params.delete('featured');
                setSearchParams(params);
              }}
            >
              Featured
            </Chip>
          )}
          
          {currentFilters.beginner && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="success"
              startDecorator={<Pets fontSize="small" />}
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setStatusFilters({...statusFilters, beginner: false});
                const params = new URLSearchParams(searchParams);
                params.delete('beginner');
                setSearchParams(params);
              }}
            >
              Beginner Friendly
            </Chip>
          )}
          
          {currentFilters.seasonal && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="primary"
              startDecorator={<NewReleasesIcon fontSize="small" />}
              endDecorator={<ClearIcon fontSize="small" />}
              onClick={() => {
                setStatusFilters({...statusFilters, seasonal: false});
                const params = new URLSearchParams(searchParams);
                params.delete('seasonal');
                setSearchParams(params);
              }}
            >
              Seasonal
            </Chip>
          )}
          
          {getActiveFilterCount() > 0 && (
            <Chip 
              size="sm" 
              variant="soft" 
              color="danger"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Chip>
          )}
        </Box>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading care guides...</Typography>
        </Box>
      ) : careGuides.length > 0 ? (
        <Table 
          borderAxis="both"
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
              <th>Title</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {careGuides.map(guide => (
              <tr key={guide.id}>
                <td>
                  <Typography fontWeight="md">{guide.title}</Typography>
                </td>
                <td>{guide.category}</td>
                <td>{guide.difficulty}</td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {guide.featured && (
                      <Chip 
                        color="warning" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<StarIcon fontSize="small" />}
                      >
                        Featured
                      </Chip>
                    )}
                    {guide.beginner && (
                      <Chip 
                        color="success" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<Pets fontSize="small" />}
                      >
                        Beginner
                      </Chip>
                    )}
                    {guide.seasonal && (
                      <Chip 
                        color="primary" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<NewReleasesIcon fontSize="small" />}
                      >
                        Seasonal
                      </Chip>
                    )}
                    {!guide.featured && !guide.beginner && !guide.seasonal && (
                      <Chip 
                        color="neutral" 
                        variant="soft" 
                        size="sm"
                      >
                        Standard
                      </Chip>
                    )}
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit care guide details">
                      <IconButton 
                        variant="outlined" 
                        color="neutral" 
                        onClick={() => handleEdit(guide.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Set guide status flags">
                      <IconButton 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => openFlagsModal(guide)}
                      >
                        <Filter />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>No care guides found matching your criteria. Try adjusting your filters.</Typography>
        </Box>
      )}
      
      {/* Care Guide Flags Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalDialog
          aria-labelledby="careguide-flags-modal"
          size="md"
        >
          <ModalClose />
          <Typography id="careguide-flags-modal" level="h4">
            Care Guide Visibility Settings
          </Typography>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            {selectedCareGuide?.title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ my: 2 }}>
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={careGuideFlags.featured} 
                label="Featured"
                onChange={(e) => setCareGuideFlags({...careGuideFlags, featured: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  Featured guides appear in the featured section on home page
                </Typography>
              </FormLabel>
            </FormControl>
            
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={careGuideFlags.beginner} 
                label="Beginner Friendly"
                onChange={(e) => setCareGuideFlags({...careGuideFlags, beginner: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  Beginner friendly guides are highlighted for new plant owners
                </Typography>
              </FormLabel>
            </FormControl>
            
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={careGuideFlags.seasonal} 
                label="Seasonal"
                onChange={(e) => setCareGuideFlags({...careGuideFlags, seasonal: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  Seasonal guides appear in the seasonal care section
                </Typography>
              </FormLabel>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFlags}>
              Save Changes
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
};

export default CareGuideList;