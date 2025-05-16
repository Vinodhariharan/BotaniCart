import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Button, Chip, AspectRatio } from '@mui/joy';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const FeaturedPlantGuides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        
        // Create query to get only 2 most recent guides
        const guidesQuery = query(
          collection(db, 'careguides'),
          orderBy('publishDate', 'desc'),
          limit(2)
        );
        
        const snapshot = await getDocs(guidesQuery);
        const guidesData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        setGuides(guidesData);
      } catch (err) {
        console.error('Error fetching featured care guides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading featured guides...</Typography>;
  }

  return (
    <Box sx={{ py: 6, px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography level="h2" sx={{ mb: 1, fontFamily: 'League Spartan, sans-serif' }}>
            Featured Plant Care
          </Typography>
          <Typography level="body-md" sx={{ color: 'text.secondary', maxWidth: '600px' }}>
            Expert tips to help your plants thrive. Check out these guides for healthy, beautiful plants.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/care-guides"
          variant="outlined"
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          View All Guides
        </Button>
      </Box>

      {guides.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {guides.map((guide) => (
            <Card
              key={guide.id}
              sx={{
                flex: 1,
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
          ))}
        </Box>
      ) : (
        <Typography sx={{ p: 3 }}>
          No plant care guides available at the moment.
        </Typography>
      )}
      
      <Box sx={{ mt: 4, display: { xs: 'flex', sm: 'none' }, justifyContent: 'center' }}>
        <Button
          component={Link}
          to="/care-guides"
          variant="outlined"
        >
          View All Guides
        </Button>
      </Box>
    </Box>
  );
};

export default FeaturedPlantGuides;