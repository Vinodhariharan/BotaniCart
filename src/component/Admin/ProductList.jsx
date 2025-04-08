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
  FormLabel
} from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import { Filter } from '@mui/icons-material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productFlags, setProductFlags] = useState({
    featured: false,
    popular: false,
    newArrival: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData || []); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/update-product/${id}`);
  };

  const openFlagsModal = (product) => {
    setSelectedProduct(product);
    setProductFlags({
      featured: product.featured || false,
      popular: product.popular || false,
      newArrival: product.newArrival || false
    });
    setShowModal(true);
  };

  const handleSaveFlags = async () => {
    if (!selectedProduct) return;
    
    try {
      const productRef = doc(db, 'products', selectedProduct.id);
      await updateDoc(productRef, {
        featured: productFlags.featured,
        popular: productFlags.popular,
        newArrival: productFlags.newArrival,
        // If implementing popular based on rating, you might want to add:
        // rating: productFlags.popular ? 5 : (selectedProduct.rating || 0),
        // If implementing newArrival based on timestamp, you might want to add:
        // createdAt: productFlags.newArrival ? new Date() : (selectedProduct.createdAt || new Date())
      });
      
      // Update local state to reflect changes
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...productFlags } 
          : p
      ));
      
      setShowModal(false);
    } catch (error) {
      console.error("Error updating product flags:", error);
    }
  };

  const filteredProducts = products.filter(product => 
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Typography level="h4">Product List</Typography>
        <Button 
          onClick={() => navigate('/admin/add-product')} 
          size="md"
          color="primary"
        >
          Add New Product
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Box sx={{ position: 'relative', flexGrow: 1 }}>
          <Input
            placeholder="Search products by title, category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startDecorator={<SearchIcon />}
            size="lg"
            sx={{ width: '100%' }}
          />
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Loading products...</Typography>
        </Box>
      ) : filteredProducts.length > 0 ? (
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
              <th>Price</th>
              <th>Status</th>
              <th style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <Typography fontWeight="md">{product.title}</Typography>
                </td>
                <td>{product.category}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.featured && (
                      <Chip 
                        color="warning" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<StarIcon fontSize="small" />}
                      >
                        Featured
                      </Chip>
                    )}
                    {product.popular && (
                      <Chip 
                        color="success" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<TrendingUpIcon fontSize="small" />}
                      >
                        Popular
                      </Chip>
                    )}
                    {product.newArrival && (
                      <Chip 
                        color="primary" 
                        variant="soft" 
                        size="sm" 
                        startDecorator={<NewReleasesIcon fontSize="small" />}
                      >
                        New
                      </Chip>
                    )}
                    {!product.featured && !product.popular && !product.newArrival && (
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
                    <Tooltip title="Edit product details">
                      <IconButton 
                        variant="outlined" 
                        color="neutral" 
                        onClick={() => handleEdit(product.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Set product status flags">
                      <IconButton 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => openFlagsModal(product)}
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
          <Typography>No products found matching your search.</Typography>
        </Box>
      )}
      
      {/* Product Flags Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <ModalDialog
          aria-labelledby="product-flags-modal"
          size="md"
        >
          <ModalClose />
          <Typography id="product-flags-modal" level="h4">
            Product Visibility Settings
          </Typography>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            {selectedProduct?.title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ my: 2 }}>
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={productFlags.featured} 
                label="Featured"
                onChange={(e) => setProductFlags({...productFlags, featured: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  Featured products appear in featured section on home page
                </Typography>
              </FormLabel>
            </FormControl>
            
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={productFlags.popular} 
                label="Popular"
                onChange={(e) => setProductFlags({...productFlags, popular: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  Popular products appear in trending section and get priority in search
                </Typography>
              </FormLabel>
            </FormControl>
            
            <FormControl orientation="horizontal" sx={{ gap: 2, alignItems: 'center', mb: 2 }}>
              <Checkbox 
                checked={productFlags.newArrival} 
                label="New Arrival"
                onChange={(e) => setProductFlags({...productFlags, newArrival: e.target.checked})}
              />
              <FormLabel>
                <Typography level="body-sm">
                  New arrivals appear in the new arrivals section
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

export default ProductList;