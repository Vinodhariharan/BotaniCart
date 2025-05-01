import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemContent,
  Card,
  CardContent,
  Grid
} from '@mui/joy';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LightModeIcon from '@mui/icons-material/LightMode';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedGuides, setRelatedGuides] = useState([]);
  
  useEffect(() => {
    const fetchGuide = async () => {
      try {
        // setLoading(true);
        // const guideDoc = await getDoc(doc(db, 'careGuides', id));
        
        // if (guideDoc.exists()) {
        //   const guideData = { id: guideDoc.id, ...guideDoc.data() };
        const temp = {
            // Basic Information
            title: "Complete Care Guide for Monstera Deliciosa",
            description: "Learn how to care for your Monstera Deliciosa, from watering schedules to propagation techniques.",
            category: "Tropical Plants",
            difficulty: "Moderate",  // Easy, Moderate, Advanced
            imageURL: "https://orchideeen-shop.nl/en/collections/monstera-deliciosa-variegata-albo-hole-plant",
            publishDate: "date",
            author: "Plant Expert Name",
            
            // Quick Tips (optional)
            quickTips: ["water", "light", "temperature", "fertilizer"],
            wateringTips: "Allow top 2-3 inches of soil to dry out between waterings",
            lightTips: "Bright, indirect light. Can tolerate some direct morning sun",
            temperatureTips: "65-85°F (18-29°C). Keep away from cold drafts",
            fertilizerTips: "Feed monthly during spring and summer with balanced fertilizer",
            
            // Content (array of sections)
            content: [
              {
                title: "Introduction to Monstera Deliciosa",
                text: "The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a popular tropical houseplant native to the rainforests of Central America. Known for its distinctive split leaves, this plant can add a dramatic tropical touch to any indoor space.\n\nMonsteras are relatively easy to care for and can grow quite large when given the right conditions, making them a stunning statement piece in your home.",
                imageURL: "https://example.com/monstera-introduction.jpg",
                imageCaption: "A mature Monstera Deliciosa with fenestrated leaves"
              },
              {
                title: "Watering",
                text: "Monstera Deliciosa prefers a consistent watering schedule. Wait until the top 2-3 inches of soil are dry before watering thoroughly. This usually means watering once a week, but this can vary depending on your home's conditions.\n\nDuring winter, reduce watering frequency as growth slows down. Always ensure your pot has drainage holes to prevent root rot from overwatering.",
                imageURL: "https://example.com/monstera-watering.jpg",
                imageCaption: "Proper watering technique for Monstera"
              },
              // Additional sections like Light, Soil, Humidity, etc.
            ],
            
            // Expert Tips
            expertTip: "For fuller growth, rotate your Monstera regularly to ensure all sides receive equal light. This prevents it from growing lopsided as it reaches toward the light source.",
            expertName: "Maria Garcia",
            expertTitle: "Tropical Plant Specialist",
            
            // Common Problems and Solutions
            commonProblems: [
              {
                problem: "Yellow Leaves",
                solution: "Usually indicates overwatering. Check soil moisture and adjust your watering schedule. Make sure the pot has proper drainage."
              },
              {
                problem: "Brown Leaf Edges",
                solution: "Often caused by low humidity. Increase humidity by misting regularly, using a humidifier, or placing the plant on a pebble tray with water."
              },
              {
                problem: "No Leaf Fenestration (Holes/Splits)",
                solution: "Young plants don't have splits in leaves. Ensure adequate light and proper care for mature growth. Leaves will naturally develop fenestrations as the plant matures."
              }
            ],
            
            // Related Products (optional)
            relatedProducts: ["productId1", "productId2"]
          }
          setGuide(temp);
          
        //   // Fetch related guides in the same category
        //   if (guideData.category) {
        //     const relatedQuery = query(
        //       collection(db, 'careGuides'),
        //       where('category', '==', guideData.category),
        //       where('__name__', '!=', id),
        //       limit(3)
        //     );
            
        //     const relatedSnapshot = await getDocs(relatedQuery);
        //     const relatedData = relatedSnapshot.docs.map(doc => ({
        //       id: doc.id,
        //       ...doc.data()
        //     }));
            
        //     setRelatedGuides(relatedData);
        //   }
        // } else {
        //   navigate('/care-guides');
        // }
      } catch (err) {
        console.error('Error fetching guide:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuide();
  }, [id, navigate]);
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading guide...</Typography>
      </Container>
    );
  }
  
  if (!guide) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Guide not found.</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box 
        component={Link} 
        to="/care-guides" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3, 
          color: 'text.secondary',
          textDecoration: 'none',
          '&:hover': { color: 'primary.main' }
        }}
      >
        <ArrowBackIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
        <Typography level="body-sm">Back to Care Guides</Typography>
      </Box>
      
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip color="success" variant="soft">{guide.category}</Chip>
          {guide.difficulty && (
            <Chip 
              color={
                guide.difficulty === 'Easy' ? 'success' :
                guide.difficulty === 'Moderate' ? 'warning' : 'danger'
              }
              variant="soft"
            >
              {guide.difficulty} Care
            </Chip>
          )}
          {guide.publishDate && (
            <Chip variant="outlined" color="neutral">
              {/* {new Date(guide.publishDate.toDate()).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })} */}
              Date
            </Chip>
          )}
        </Box>
        
        <Typography 
          level="h1" 
          sx={{ 
            mb: 3, 
            fontFamily: 'League Spartan, sans-serif',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          {guide.title}
        </Typography>
        
        <Typography level="body-lg" sx={{ mb: 4, maxWidth: '800px' }}>
          {guide.description}
        </Typography>
      
        {guide.imageURL && (
          <Box 
            sx={{ 
              width: '100%',
              height: { xs: '200px', sm: '300px', md: '400px' },
              borderRadius: 'lg',
              overflow: 'hidden',
              mb: 4
            }}
          >
            <img 
              src={guide.imageURL} 
              alt={guide.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}
        
        {guide.quickTips && guide.quickTips.length > 0 && (
          <Box 
            sx={{ 
              backgroundColor: 'background.level1',
              borderRadius: 'lg',
              p: 3,
              mb: 4
            }}
          >
            <Typography level="h3" sx={{ mb: 2 }}>
              Quick Care Guide
            </Typography>
            <Grid container spacing={2}>
              {guide.quickTips.includes('water') && (
                <Grid xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WaterDropIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography level="title-md">Water</Typography>
                  </Box>
                  <Typography level="body-sm">{guide.wateringTips || "Keep soil moist but not soggy."}</Typography>
                </Grid>
              )}
              {guide.quickTips.includes('light') && (
                <Grid xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LightModeIcon sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography level="title-md">Light</Typography>
                  </Box>
                  <Typography level="body-sm">{guide.lightTips || "Bright indirect light is best."}</Typography>
                </Grid>
              )}
              {guide.quickTips.includes('temperature') && (
                <Grid xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ThermostatIcon sx={{ color: 'danger.main', mr: 1 }} />
                    <Typography level="title-md">Temperature</Typography>
                  </Box>
                  <Typography level="body-sm">{guide.temperatureTips || "65-80°F (18-27°C) is ideal."}</Typography>
                </Grid>
              )}
              {guide.quickTips.includes('fertilizer') && (
                <Grid xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalFloristIcon sx={{ color: 'success.main', mr: 1 }} />
                    <Typography level="title-md">Fertilizer</Typography>
                  </Box>
                  <Typography level="body-sm">{guide.fertilizerTips || "Feed monthly during growing season."}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
        
        <Box sx={{ mb: 5 }}>
          {guide.content && guide.content.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              {section.title && (
                <Typography level="h2" sx={{ mb: 2 }}>
                  {section.title}
                </Typography>
              )}
              <Typography sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                {section.text}
              </Typography>
              {section.imageURL && (
                <Box 
                  sx={{ 
                    width: '100%',
                    maxWidth: '600px',
                    borderRadius: 'md',
                    overflow: 'hidden',
                    my: 3
                  }}
                >
                  <img 
                    src={section.imageURL} 
                    alt={section.title || guide.title} 
                    style={{ width: '100%', height: 'auto' }}
                  />
                  {section.imageCaption && (
                    <Typography 
                      level="body-xs" 
                      sx={{ 
                        mt: 1,
                        fontStyle: 'italic',
                        color: 'text.secondary'
                      }}
                    >
                      {section.imageCaption}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
        
        {guide.expertTip && (
          <Box 
            sx={{ 
              backgroundColor: 'background.level1',
              borderRadius: 'lg',
              p: 3,
              mb: 5,
              display: 'flex',
              alignItems: 'flex-start'
            }}
          >
            <FormatQuoteIcon 
              sx={{ 
                color: 'primary.main', 
                fontSize: '2rem',
                mr: 2
              }} 
            />
            <Box>
              <Typography level="title-md" sx={{ mb: 1 }}>Expert Tip</Typography>
              <Typography sx={{ fontStyle: 'italic' }}>
                "{guide.expertTip}"
              </Typography>
              {guide.expertName && (
                <Typography level="body-sm" sx={{ mt: 1, color: 'text.secondary' }}>
                  — {guide.expertName}, {guide.expertTitle || 'Plant Specialist'}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        
        {guide.commonProblems && guide.commonProblems.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Typography level="h2" sx={{ mb: 3 }}>Common Problems & Solutions</Typography>
            <List>
              {guide.commonProblems.map((problem, index) => (
                <ListItem 
                  key={index}
                  sx={{ 
                    backgroundColor: index % 2 === 0 ? 'background.level1' : 'transparent',
                    borderRadius: 'md',
                    mb: 2
                  }}
                >
                  <ListItemContent>
                    <Typography level="title-md" sx={{ mb: 1 }}>
                      {problem.problem}
                    </Typography>
                    <Typography level="body-sm">
                      {problem.solution}
                    </Typography>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {relatedGuides.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Divider sx={{ mb: 4 }} />
            <Typography level="h2" sx={{ mb: 3 }}>Related Care Guides</Typography>
            <Grid container spacing={3}>
              {relatedGuides.map((related) => (
                <Grid xs={12} sm={6} md={4} key={related.id}>
                  <Card 
                    component={Link}
                    to={`/care-guides/${related.id}`}
                    sx={{ 
                      height: '100%', 
                      textDecoration: 'none',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 'lg'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', height: '160px' }}>
                      <img 
                        src={related.imageURL || '/placeholder-plant.jpg'} 
                        alt={related.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography level="h3" sx={{ fontSize: '1.1rem', mb: 1 }}>
                        {related.title}
                      </Typography>
                      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        {related.description.substring(0, 80)}...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GuideDetail;