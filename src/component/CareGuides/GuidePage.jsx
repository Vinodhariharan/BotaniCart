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
        setLoading(true);
        // Fixed collection name from 'careguides' to match security rules
        const guideDoc = await getDoc(doc(db, 'careguides', id));

        if (guideDoc.exists()) {
          const guideData = { id: guideDoc.id, ...guideDoc.data() };
          setGuide(guideData);

          // Fixed collection name in the related guides query
          if (guideData.category) {
            const relatedQuery = query(
              collection(db, 'careguides'),  // Fixed from 'careGuides' to 'careguides'
              where('category', '==', guideData.category),
              where('__name__', '!=', id),
              limit(3)
            );

            const relatedSnapshot = await getDocs(relatedQuery);
            const relatedData = relatedSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            setRelatedGuides(relatedData);
          }
        } else {
          navigate('/care-guides');
        }
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
              {new Date(guide.publishDate.toDate()).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
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