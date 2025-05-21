import React from 'react';
import { Link } from 'react-router-dom';
import MasonryImageList from './ImageGrid';
import { Typography, Sheet, List, ListItem, Button, Container, Box } from '@mui/joy';

function About() {
  return (
    <Sheet sx={{ p: 4, my: 4 }}>
      <Container maxWidth="lg">
        <Typography level="h1" textAlign="center" mb={4} sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
          About BotaniCart
        </Typography>
        <Typography level="body1" mb={3} sx={{ fontSize: '1.25rem' }}>
          Welcome to BotaniCart, where we believe your home is a living, breathing expression of your style, and every plant, pot, and accessory is a brushstroke in your personal botanical masterpiece. We're more than just a plant store; we're your partner in creating vibrant, green spaces that inspire and delight.
        </Typography>
        <Typography level="h2" mb={2}>
          Our Story:
        </Typography>
        <Typography level="body1" mb={3} sx={{ fontSize: '1.25rem' }}>
          Founded in 2022 by Vinod Hariharan R, BotaniCart emerged from a shared love for plants and a vision to make bringing nature indoors an accessible and enriching experience. What started as a small stall at the local farmer's market, filled with unique succulents and aromatic herbs, has grown into a thriving community for plant lovers everywhere.
        </Typography>
        <Typography level="h3" mb={2}>
          Discover the Joy of Gardening
        </Typography>
        {/* <MasonryImageList /> */}
        <Typography level="h2" mb={2}>
          More Than Just Foliage:
        </Typography>
        <Typography level="body1" mb={2} sx={{ fontSize: '1.25rem' }}>
          At BotaniCart, we're dedicated to providing you with more than just plants. We offer:
        </Typography>
        <List sx={{ mb: 3 }}>
          <ListItem sx={{ fontSize: '1.25rem', padding:'10px' }}>
            A diverse selection of plants: From easy-care air plants to statement-making cacti, we curate a collection to suit every taste and lifestyle.
          </ListItem>
          <ListItem sx={{ fontSize: '1.25rem', padding:'10px' }}>
            Unique pots and planters: Elevate your greenery with our range of hand-painted ceramics, stylish macrame hangers, and modern stands.
          </ListItem>
          <ListItem sx={{ fontSize: '1.25rem', padding:'10px' }}>
            Expert advice: Our knowledgeable team is here to help you choose the right plants and provide guidance on plant care.
          </ListItem>
          <ListItem sx={{ fontSize: '1.25rem', padding:'10px' }}>
            Workshops and events: Join us for hands-on workshops on terrarium building, macrame, and more.
          </ListItem>
        </List>
        <Typography level="h1" textAlign="center" mb={4} sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
          Cultivate Your Canvas with Nature's Hues - Start Creating at BotaniCart!
        </Typography>
        <Typography level="body1" textAlign="center" mb={3} sx={{ fontSize: '1.25rem' }}>
          Visit us today to explore our collection, get personalized advice, and bring the beauty of nature into your home.
        </Typography>
        <Box display="flex" justifyContent="center">
          <Button
            component={Link}
            to="/productList/flowers"
            variant="contained"
            size="lg"
            sx={{
              borderRadius: 'xl',
              px: 4,
              py: 2,
              backgroundColor: '#136c13', // Apply the requested color
              '&:hover': {
                backgroundColor: '#105a10', // Darken on hover for feedback
              },
            }}
          >
            Explore Our Collection
          </Button>
        </Box>
      </Container>
    </Sheet>
  );
}

export default About;