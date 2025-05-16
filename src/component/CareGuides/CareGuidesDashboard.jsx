import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Card, CardContent, Button, Chip, MenuItem, Input, AspectRatio } from '@mui/joy';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const CareGuides = () => {
  const [guides, setGuides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);

        // Create and execute query
        let guidesQuery = collection(db, 'careguides');
        if (selectedCategory !== 'all') {
          guidesQuery = query(guidesQuery, where('category', '==', selectedCategory));
        }
        guidesQuery = query(guidesQuery, orderBy('publishDate', 'desc'));

        const snapshot = await getDocs(guidesQuery);

        // Process guides data
        const guidesData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(guide =>
            searchTerm === '' ||
            guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchTerm.toLowerCase())
          );

        setGuides(guidesData);

        // Extract unique categories
        const uniqueCategories = [...new Set(
          guidesData.map(guide => guide.category).filter(Boolean)
        )];

        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching care guides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [selectedCategory, searchTerm]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <Typography level="h1" sx={{ mb: 2, fontFamily: 'League Spartan, sans-serif' }}>
          Plant Care Guides
        </Typography>
        <Typography sx={{ mb: 3, maxWidth: '800px' }}>
          Discover expert tips and comprehensive guides to help your plants thrive.
          From basic care to specialized techniques, our guides cover everything you need to know
          for healthy, beautiful plants in your home or garden.
        </Typography>

        {/* Search and filter */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={4}>
            <Input
              fullWidth
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: { xs: 2, sm: 0 } }}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            {/* <Input
              select
              fullWidth
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Filter by Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Input > */}
          </Grid>
        </Grid>

        {/* Featured guide */}
        {guides.length > 0 && (
          <Box
            sx={{
              mb: 6,
              borderRadius: 'lg',
              overflow: 'hidden',
              boxShadow: 'md',
              position: 'relative'
            }}
          >
            <Grid container>
              <Grid xs={12} md={6}>
                <Box
                  sx={{
                    height: { xs: '200px', md: '400px' },
                    overflow: 'hidden', // Ensures image doesn't overflow
                    borderRadius: 2,     // Optional styling
                  }}
                >
                  <img
                    src={guides[0].imageURL}
                    alt="Care Guide"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </Box>
              </Grid>


              <Grid xs={12} md={6}>
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Chip
                    color="primary"
                    variant="soft"
                    size="sm"
                    sx={{ mb: 2, alignSelf: 'flex-start' }}
                  >
                    Featured Guide
                  </Chip>
                  <Typography level="h2" sx={{ mb: 2 }}>
                    {guides[0].title}
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    {guides[0].description}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/care-guides/${guides[0].id}`}
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Read Full Guide
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* All guides */}
        <Grid container spacing={3}>
          {loading ? (
            <Typography sx={{ p: 3 }}>Loading guides...</Typography>
          ) : guides.length > 1 ? (
            guides.slice(1).map((guide) => (
              <Grid xs={12} sm={6} md={4} key={guide.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 'lg'
                    }
                  }}
                >
                  <AspectRatio
                    ratio="16/9"
                    sx={{
                      minWidth: { xs: '100%', md: '50%' },
                      borderRadius: 'md',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={guide.imageURL || '/placeholder-plant.jpg'}
                      alt={guide.title}
                      loading="lazy"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </AspectRatio>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        size="sm"
                        color="success"
                        variant="soft"
                      >
                        {guide.category}
                      </Chip>
                      {guide.difficulty && (
                        <Chip
                          size="sm"
                          color={
                            guide.difficulty === 'Easy' ? 'success' :
                              guide.difficulty === 'Moderate' ? 'warning' : 'danger'
                          }
                          variant="soft"
                          sx={{ ml: 1 }}
                        >
                          {guide.difficulty}
                        </Chip>
                      )}
                    </Box>
                    <Typography level="h3" sx={{ mb: 1, fontSize: '1.25rem' }}>
                      {guide.title}
                    </Typography>
                    <Typography level="body-sm" sx={{ mb: 2, color: 'text.secondary' }}>
                      {guide.description.substring(0, 100)}...
                    </Typography>
                    <Button
                      component={Link}
                      to={`/care-guides/${guide.id}`}
                      variant="soft"
                      color="primary"
                      sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                    >
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ p: 3 }}>
              {guides.length === 0 ? "No guides found matching your search." : ""}
            </Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default CareGuides;