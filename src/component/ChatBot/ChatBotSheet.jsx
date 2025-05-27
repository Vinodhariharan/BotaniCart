import * as React from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  Sheet,
  Typography,
  IconButton,
  List,
  ListItem,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  Card,
  Avatar,
  Tooltip,
  Badge,
  Alert,
} from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import RecommendedProductCard from './RecommendedProductCard';
import { v4 as uuidv4 } from 'uuid';

// Simple markdown parser
const parseMarkdown = (text) => {
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/`(.*?)`/g, '<code style="background: #f0f4f8; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #0f172a;">$1</code>');
  text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" style="color: #2563eb; text-decoration: underline;">$1</a>');
  text = text.replace(/^### (.*$)/gm, '<h3 style="margin: 12px 0 6px 0; font-size: 1.1em; font-weight: 600; font-family: \'League Spartan\', sans-serif; color: #1e293b;">$1</h3>');
  text = text.replace(/^## (.*$)/gm, '<h2 style="margin: 16px 0 8px 0; font-size: 1.2em; font-weight: 600; font-family: \'League Spartan\', sans-serif; color: #1e293b;">$1</h2>');
  text = text.replace(/^# (.*$)/gm, '<h1 style="margin: 20px 0 10px 0; font-size: 1.3em; font-weight: 700; font-family: \'League Spartan\', sans-serif; color: #1e293b;">$1</h1>');
  
  // Simple bullet points
  const lines = text.split('\n');
  let inList = false;
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = /^[\s]*[-*]\s+(.*)/.test(line);
    
    if (isListItem) {
      const content = line.replace(/^[\s]*[-*]\s+(.*)/, '$1');
      if (!inList) {
        processedLines.push('<ul style="margin: 8px 0; padding-left: 16px;">');
        inList = true;
      }
      processedLines.push(`<li style="margin: 2px 0; color: #475569;">${content}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  text = processedLines.join('\n');
  text = text.replace(/\n\n/g, '<br><br>');
  text = text.replace(/\n/g, '<br>');
  
  return text;
};

// Simple chat message component
const ChatMessage = ({ message, onCopy }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        mb: 2,
        px: { xs: 1, sm: 0 },
      }}
    >
      {message.sender === 'bot' && (
        <Avatar
          size="sm"
          sx={{
            mr: { xs: 1, sm: 1.5 },
            bgcolor: '#10b981',
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            flexShrink: 0,
          }}
        >
          <SmartToyIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
        </Avatar>
      )}

      <Card
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: { xs: 16, sm: 20 },
          maxWidth: { xs: '85%', sm: '80%' },
          minWidth: { xs: '200px', sm: 'auto' },
          bgcolor: message.sender === 'user' ? '#2563eb' : '#ffffff',
          color: message.sender === 'user' ? 'white' : '#334155',
          border: message.sender === 'user' ? 'none' : '1px solid #e2e8f0',
          boxShadow: message.sender === 'user' 
            ? '0 4px 12px rgba(37, 99, 235, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        {message.sender === 'bot' ? (
          <Box
            sx={{
              lineHeight: 1.6,
              fontSize: { xs: '14px', sm: '15px' },
              color: '#475569',
              '& h1, & h2, & h3': { 
                fontFamily: 'League Spartan, sans-serif',
                lineHeight: 1.3,
                color: '#1e293b',
              },
              '& ul': { margin: '8px 0', paddingLeft: '16px' },
              '& li': { margin: '4px 0' },
              '& strong': { color: '#1e293b', fontWeight: 600 },
              '& em': { color: '#64748b' },
            }}
            dangerouslySetInnerHTML={{
              __html: parseMarkdown(message.text)
            }}
          />
        ) : (
          <Typography 
            level="body-sm" 
            sx={{ 
              fontSize: { xs: '14px', sm: '15px' },
              lineHeight: 1.5,
              color: 'inherit',
            }}
          >
            {message.text}
          </Typography>
        )}

        {/* Copy button for bot messages */}
        {message.sender === 'bot' && (
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title={copied ? "Copied!" : "Copy message"} size="sm">
              <IconButton
                size="sm"
                variant="plain"
                onClick={handleCopy}
                sx={{ 
                  minHeight: { xs: 20, sm: 24 }, 
                  minWidth: { xs: 20, sm: 24 },
                  opacity: 0.6,
                  color: '#64748b',
                  '&:hover': { 
                    opacity: 1,
                    bgcolor: '#f1f5f9',
                  }
                }}
              >
                <ContentCopyIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Card>

      {message.sender === 'user' && (
        <Avatar
          size="sm"
          sx={{
            ml: { xs: 1, sm: 1.5 },
            bgcolor: '#f59e0b',
            width: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            flexShrink: 0,
          }}
        >
          <PersonIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
        </Avatar>
      )}
    </Box>
  );
};

// Simple typing indicator
const TypingIndicator = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: { xs: 1, sm: 0 } }}>
    <Avatar
      size="sm"
      sx={{
        mr: { xs: 1, sm: 1.5 },
        bgcolor: '#10b981',
        width: { xs: 28, sm: 32 },
        height: { xs: 28, sm: 32 },
      }}
    >
      <SmartToyIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
    </Avatar>
    <Card
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: { xs: 16, sm: 20 },
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        border: '1px solid #e2e8f0',
        bgcolor: '#ffffff',
      }}
    >
      <Typography 
        level="body-sm" 
        sx={{ 
          fontSize: { xs: '13px', sm: '14px' }, 
          color: '#64748b',
          fontStyle: 'italic',
        }}
      >
        AI is thinking...
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: { xs: 3, sm: 4 },
              height: { xs: 3, sm: 4 },
              borderRadius: '50%',
              bgcolor: '#10b981',
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${i * 0.16}s`,
              '@keyframes bounce': {
                '0%, 80%, 100%': { transform: 'scale(0)' },
                '40%': { transform: 'scale(1)' },
              },
            }}
          />
        ))}
      </Box>
    </Card>
  </Box>
);

// Product recommendations sidebar
const ProductSidebar = ({ products, setaddtoCartSnack, onFullscreen, hasNewProducts, isMobile }) => {
  if (isMobile) {
    // On mobile, don't show sidebar - products will be shown in fullscreen only
    return null;
  }

  if (!products || products.length === 0) {
    return (
      <Box
        sx={{
          width: 280,
          borderLeft: '1px solid #e2e8f0',
          bgcolor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: 48, color: '#94a3b8' }} />
        <Typography 
          level="body-sm" 
          sx={{ 
            textAlign: 'center', 
            color: '#64748b',
            fontFamily: 'League Spartan, sans-serif',
            fontWeight: 500,
          }}
        >
          Product recommendations will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 280,
        borderLeft: '1px solid #e2e8f0',
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            level="h6" 
            sx={{ 
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#1e293b',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 20, color: '#10b981' }} />
            Recommended
            {hasNewProducts && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#10b981',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              />
            )}
          </Typography>
          <IconButton
            size="sm"
            variant="outlined"
            onClick={onFullscreen}
            sx={{
              minHeight: 28,
              minWidth: 28,
              borderRadius: '50%',
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f1f5f9',
              }
            }}
          >
            <FullscreenIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
        <Typography 
          level="body-xs" 
          sx={{ 
            color: '#64748b',
            mt: 0.5,
            fontFamily: 'League Spartan, sans-serif',
          }}
        >
          {products.length} product{products.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Scrollable product list */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 1,
          '&::-webkit-scrollbar': { 
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(100, 116, 139, 0.3)',
            borderRadius: '3px',
          },
        }}
      >
        <Stack spacing={1}>
          {products.map((product, index) => (
            <Box
              key={product.id || index}
              sx={{
                animation: hasNewProducts && index >= products.length - 3 ? 'slideInRight 0.3s ease-out' : 'none',
                '@keyframes slideInRight': {
                  from: { opacity: 0, transform: 'translateX(20px)' },
                  to: { opacity: 1, transform: 'translateX(0)' },
                },
              }}
            >
              <RecommendedProductCard 
                product={product} 
                setaddtoCartSnack={setaddtoCartSnack} 
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

// Full screen product view modal
const FullscreenProductView = ({ open, onClose, products, setaddtoCartSnack }) => {
  if (!open) return null;

  return (
    <Sheet
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1400,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2 },
      }}
      onClick={onClose}
    >
      <Card
        sx={{
          width: '100%',
          height: { xs: '100%', sm: '90%' },
          maxWidth: { xs: 'none', sm: 1200 },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#ffffff',
          borderRadius: { xs: 0, sm: 16 },
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box>
            <Typography 
              level="h4" 
              sx={{ 
                fontFamily: 'League Spartan, sans-serif',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#1e293b',
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: '#10b981' }} />
              Recommended Products
            </Typography>
            <Typography 
              level="body-sm" 
              sx={{ 
                color: '#64748b',
                mt: 0.5,
                fontFamily: 'League Spartan, sans-serif',
              }}
            >
              {products.length} product{products.length !== 1 ? 's' : ''} found for you
            </Typography>
          </Box>
          <IconButton
            variant="outlined"
            onClick={onClose}
            sx={{
              minHeight: { xs: 36, sm: 40 },
              minWidth: { xs: 36, sm: 40 },
              borderRadius: '50%',
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f1f5f9',
              }
            }}
          >
            <FullscreenExitIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>
        </Box>

        {/* Product grid */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: { xs: 2, sm: 3 },
            '&::-webkit-scrollbar': { 
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(100, 116, 139, 0.3)',
              borderRadius: '4px',
            },
          }}
        >
          {products.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                height: '100%',
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: { xs: 48, sm: 64 }, color: '#94a3b8' }} />
              <Typography 
                level="h6" 
                sx={{ 
                  color: '#64748b',
                  fontFamily: 'League Spartan, sans-serif',
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                No products recommended yet
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              {products.map((product, index) => (
                <RecommendedProductCard 
                  key={product.id || index}
                  product={product} 
                  setaddtoCartSnack={setaddtoCartSnack} 
                />
              ))}
            </Box>
          )}
        </Box>
      </Card>
    </Sheet>
  );
};

export default function ChatbotSheet({ open, onClose, user, setaddtoCartSnack }) {
  const [messages, setMessages] = React.useState([]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [messageCount, setMessageCount] = React.useState(0);
  const [allRecommendedProducts, setAllRecommendedProducts] = React.useState([]);
  const [hasNewProducts, setHasNewProducts] = React.useState(false);
  const [fullscreenView, setFullscreenView] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const chatContainerRef = React.useRef(null);

  // Check if mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate session ID (without localStorage for artifacts)
  const [sessionId, setSessionId] = React.useState(() => uuidv4());

  // Welcome message with disclaimer
  React.useEffect(() => {
    if (open && messages.length === 0) {
      const welcomeMessage = {
        sender: 'bot',
        text: `# Welcome to BotaniCart AI! 🌱

**⚠️ Preview Mode Notice**
This is a preview version of our AI assistant. Responses may not always be accurate and should be verified with reliable plant care sources.

**What I can help with:**
- Plant recommendations for your space
- Basic care guidance and tips
- General plant problem diagnosis
- Shopping assistance

**Please note:** Always consult with plant care experts for serious plant health issues.

What would you like to explore today?`,
        suggestedActions: [
          "Recommend plants for beginners",
          "Help with plant care",
          "Find low-light plants",
          "Diagnose plant problems"
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [open, messages.length]);

  // Auto-scroll chat
  React.useEffect(() => {
    if (chatContainerRef.current) {
      const scrollContainer = chatContainerRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const sendMessage = async (messageText, isSuggestedAction = false) => {
    if (!messageText.trim() && !isSuggestedAction) return;

    const newUserMessage = { sender: 'user', text: messageText };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage('');
    setLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const payload = {
        message: messageText,
        user_id: user?.uid || 'anonymous_user_' + uuidv4(),
        session_id: sessionId,
        message_count: messageCount + 1,
      };

      const response = await fetch('https://botanicart-ai-agent.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const newBotMessage = {
        sender: 'bot',
        text: data.response,
        productRecommendations: data.product_recommendations || [],
        suggestedActions: data.suggested_actions || [],
      };
      
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);

      // Handle product recommendations
      if (data.product_recommendations && data.product_recommendations.length > 0) {
        setAllRecommendedProducts(data.product_recommendations);
        setHasNewProducts(true);
        setTimeout(() => setHasNewProducts(false), 3000);
        
        // Auto-open fullscreen on mobile when products are recommended
        if (isMobile) {
          setFullscreenView(true);
        }
      } else if (data.product_recommendations && data.product_recommendations.length === 0) {
        setAllRecommendedProducts([]);
        setHasNewProducts(false);
      }

    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'bot',
          text: `## Connection Error 😕

I'm having trouble connecting right now. This could be due to:
- Network connectivity issues
- Server maintenance
- High traffic

**Please try:**
- Refreshing the page
- Checking your internet connection
- Trying again in a few moments

*Remember: This is a preview version and may experience occasional issues.*`,
          suggestedActions: ["Try again"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedActionClick = (action) => {
    sendMessage(action, true);
  };

  const clearChat = () => {
    setMessages([]);
    setMessageCount(0);
    setAllRecommendedProducts([]);
    setHasNewProducts(false);
    setSessionId(uuidv4());
  };

  const handleFullscreenToggle = () => {
    setFullscreenView(!fullscreenView);
  };

  // Show products button for mobile when there are products
  const showMobileProductsButton = isMobile && allRecommendedProducts.length > 0;

  return (
    <Sheet
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: { xs: '100%', sm: isMobile ? '100%' : 800 },
        height: { xs: '100%', sm: 600 },
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1300,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        borderTopLeftRadius: { xs: 0, sm: 12 },
        borderTopRightRadius: { xs: 0, sm: 12 },
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      {/* Disclaimer Alert - Only show on first load */}
      {messages.length <= 1 && (
        <Alert
          startDecorator={<InfoIcon />}
          variant="soft"
          color="warning"
          sx={{
            mx: 2,
            mt: 2,
            borderRadius: 8,
            fontSize: '13px',
            '& .MuiAlert-startDecorator': {
              fontSize: '16px',
            }
          }}
        >
          <Typography level="body-xs" sx={{ fontWeight: 500 }}>
            Preview Mode: Results may not be fully accurate. Please verify plant care advice.
          </Typography>
        </Alert>
      )}

      {/* Header */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: { xs: 1.5, sm: 2 },
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
          <Avatar
            size="sm"
            sx={{
              bgcolor: '#10b981',
              width: { xs: 32, sm: 36 },
              height: { xs: 32, sm: 36 },
            }}
          >
            <SmartToyIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </Avatar>
          <Box>
            <Typography 
              level="h6" 
              sx={{ 
                fontFamily: 'League Spartan, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '16px', sm: '18px' },
                color: '#1e293b',
              }}
            >
              BotaniCart AI
              <Chip 
                size="sm" 
                variant="soft" 
                color="warning"
                sx={{ 
                  ml: 1, 
                  fontSize: '10px',
                  fontWeight: 600,
                  py: 0.2,
                  px: 0.5,
                }}
              >
                PREVIEW
              </Chip>
            </Typography>
            <Typography 
              level="body-xs" 
              sx={{ 
                color: '#64748b',
                fontSize: { xs: '11px', sm: '12px' },
              }}
            >
              Plant care assistant
            </Typography>
          </Box>
        </Box>
        
        <Stack direction="row" spacing={1} alignItems="center">
          {showMobileProductsButton && (
            <Button 
              variant="soft" 
              size="sm"
              color="success"
              onClick={handleFullscreenToggle}
              startDecorator={<ShoppingCartIcon />}
              sx={{ 
                fontFamily: 'League Spartan, sans-serif',
                fontWeight: 500,
                fontSize: '12px',
              }}
            >
              {allRecommendedProducts.length}
              {hasNewProducts && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#ef4444',
                    ml: 0.5,
                    animation: 'pulse 2s infinite',
                  }}
                />
              )}
            </Button>
          )}
          
          <Button 
            variant="plain" 
            size="sm"
            onClick={clearChat}
            sx={{ 
              fontFamily: 'League Spartan, sans-serif',
              fontWeight: 500,
              color: '#64748b',
              fontSize: { xs: '12px', sm: '13px' },
              '&:hover': {
                bgcolor: '#f1f5f9',
              }
            }}
          >
            Clear
          </Button>
          <IconButton 
            variant="plain" 
            size="sm"
            onClick={onClose}
            sx={{
              color: '#64748b',
              '&:hover': {
                bgcolor: '#f1f5f9',
              }
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </IconButton>
        </Stack>
      </Box>

      {/* Main content area */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Chat area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Messages */}
          <Box
            ref={chatContainerRef}
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: { xs: 1, sm: 2 },
              bgcolor: '#f8fafc',
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
              '&::-webkit-scrollbar': { 
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(100, 116, 139, 0.3)',
                borderRadius: '3px',
              },
            }}
          >
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                <ChatMessage message={msg} />

                {/* Suggested Actions */}
                {msg.sender === 'bot' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <Box sx={{ 
                    mb: 2, 
                    display: 'flex', 
                    justifyContent: 'center',
                    px: { xs: 1, sm: 0 },
                  }}>
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      flexWrap="wrap" 
                      sx={{ 
                        maxWidth: { xs: '100%', sm: '80%' },
                        gap: { xs: 0.5, sm: 1 },
                      }}
                    >
                      {msg.suggestedActions.map((action, actionIndex) => (
                        <Chip
                          key={actionIndex}
                          variant="outlined"
                          size="sm"
                          onClick={() => handleSuggestedActionClick(action)}
                          sx={{ 
                            cursor: 'pointer',
                            fontFamily: 'League Spartan, sans-serif',
                            fontWeight: 500,
                            fontSize: { xs: '12px', sm: '13px' },
                            borderColor: '#cbd5e1',
                            color: '#475569',
                            '&:hover': { 
                              bgcolor: '#e2e8f0',
                              borderColor: '#94a3b8',
                            },
                            mb: { xs: 0.5, sm: 0 },
                          }}
                        >
                          {action}
                        </Chip>
                      ))}
                    </Stack>
                  </Box>
                )}
              </React.Fragment>
            ))}
            
            {loading && <TypingIndicator />}
          </Box>

          {/* Input Area */}
          <Box sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            bgcolor: '#ffffff', 
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.04)',
          }}>
            <FormControl>
              <Input
                placeholder="Ask about plants, care tips, or get recommendations..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(inputMessage);
                  }
                }}
                disabled={loading}
                endDecorator={
                  <IconButton
                    onClick={() => sendMessage(inputMessage)}
                    disabled={loading || !inputMessage.trim()}
                    color="primary"
                    variant="solid"
                    sx={{
                      borderRadius: '50%',
                      minHeight: { xs: 28, sm: 32 },
                      minWidth: { xs: 28, sm: 32 },
                      bgcolor: '#2563eb',
                      '&:hover': {
                        bgcolor: '#1d4ed8',
                      },
                      '&:disabled': {
                        bgcolor: '#cbd5e1',
                      }
                    }}
                  >
                    <SendIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                  </IconButton>
                }
                sx={{ 
                  borderRadius: { xs: 16, sm: 20 },
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: { xs: '14px', sm: '15px' },
                  minHeight: { xs: 44, sm: 48 },
                  '&:focus-within': {
                    bgcolor: '#ffffff',
                    borderColor: '#2563eb',
                    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                  },
                  '& input': {
                    py: { xs: 1, sm: 1.5 },
                  }
                }}
              />
            </FormControl>
            
            {/* Mobile hint */}
            {isMobile && (
              <Typography 
                level="body-xs" 
                sx={{ 
                  color: '#94a3b8',
                  textAlign: 'center',
                  mt: 1,
                  fontSize: '11px',
                }}
              >
                Tap products button above to view recommendations
              </Typography>
            )}
          </Box>
        </Box>

        {/* Desktop Product Sidebar */}
        <ProductSidebar 
          products={allRecommendedProducts} 
          setaddtoCartSnack={setaddtoCartSnack}
          onFullscreen={handleFullscreenToggle}
          hasNewProducts={hasNewProducts}
          isMobile={isMobile}
        />
      </Box>

      {/* Fullscreen Product View */}
      <FullscreenProductView
        open={fullscreenView}
        onClose={handleFullscreenToggle}
        products={allRecommendedProducts}
        setaddtoCartSnack={setaddtoCartSnack}
      />
    </Sheet>
  );
}