import * as React from 'react';
import { Container, Drawer, IconButton, List, ListItemButton, Typography, Input } from '@mui/material';
import { Search, Menu } from '@mui/icons-material';
import { ModalClose } from '@mui/joy';

// import './MegaMenu.css'; // Import your CSS file for styling

// Define your MegaMenu component
const MegaMenu = () => {
  const [open, setOpen] = React.useState(false);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div>
      <IconButton variant="outlined" color="inherit" onClick={handleToggleDrawer} className="menu-icon">
        <Menu />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={handleToggleDrawer}>
        <ModalClose/>
      <IconButton variant="outlined" color="inherit" onClick={handleToggleDrawer}   >
        <Menu />
      </IconButton>
        <Container>
          <div className="dropdown-container">
            <Input
              size="sm"
              placeholder="Search"
              variant="plain"
              endDecorator={<Search />}
              slotProps={{
                input: {
                  'aria-label': 'Search anything',
                },
              }}
              className="search-input"
            />

            <List className="menu-list">
              <ListItemButton className="menu-item" sx={{ fontWeight: 'lg' }}>
                Home
              </ListItemButton>
              <ListItemButton className="menu-item">About</ListItemButton>
              <ListItemButton className="menu-item">Studio</ListItemButton>
              <ListItemButton className="menu-item">Contact</ListItemButton>

              {/* Dropdown for Plants */}
              <ListItemButton className="menu-item dropdown">
                <Typography className="desktop-link">Plants</Typography>
                <List className="sub-menu">
                  <ListItemButton>
                    <a className='pagemaps' href='/productList/flowers'>Flowers</a>
                  </ListItemButton>
                  <ListItemButton>
                    <a className='pagemaps' href='/productList/shrubs'>Shrubs</a>
                  </ListItemButton>
                  <ListItemButton>
                    <a className='pagemaps' href='/productList/trees'>Trees</a>
                  </ListItemButton>
                  <ListItemButton>
                    <a className='pagemaps' href='/productList/indoorPlants'>Indoor Plants</a>
                  </ListItemButton>
                  <ListItemButton>
                    <a className='pagemaps' href='/productList/seeds'>Seeds (Flower, Vegetable, Herb)</a>
                  </ListItemButton>
                </List>
              </ListItemButton>

              {/* Dropdown for Tools */}
              <ListItemButton className="menu-item dropdown">
                <Typography className="desktop-link">Tools</Typography>
                <List className="sub-menu">
                  <ListItemButton>
                    <a className='pagemaps' href='/productList/EssentialTools'>Essential Tools</a>
                  </ListItemButton>
                  <ListItemButton>
                    <a className='pagemaps' href='/productList/HelpfulTools'>Helpful Tools</a>
                  </ListItemButton>
                  <ListItemButton>
                    <a className='pagemaps' href='/productList/UsefulTools'>Useful Tools</a>
                  </ListItemButton>
                </List>
              </ListItemButton>

              {/* Dropdown for Containers */}
              <ListItemButton className="menu-item dropdown">
                <Typography className="desktop-link">Containers</Typography>
                <List className="sub-menu">
                  {/* Add container-specific items as needed */}
                </List>
              </ListItemButton>

              {/* Dropdown for Fertilizers */}
              <ListItemButton className="menu-item dropdown">
                <Typography className="desktop-link">Fertilizers</Typography>
                <List className="sub-menu">
                  {/* Add fertilizer-specific items as needed */}
                </List>
              </ListItemButton>
            </List>
          </div>
        </Container>
      </Drawer>
    </div>
  );
};

export default MegaMenu;
