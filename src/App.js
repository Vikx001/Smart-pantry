// src/App.js

import React, { useState, useEffect, useRef } from 'react';
import {
  ThemeProvider,
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { pastelTheme, PastelBackgroundStyle } from './theme/pastelTheme';
import Sidebar from './components/Sidebar'; 
import ItemGrid from './components/ItemGrid';
import RecipeGrid from './components/RecipeGrid';
import StatCard from './components/StatCard';
import TabPanel from './components/TabPanel';
import { getCountdown } from './utils/countdown';
import { predictExpiryDate } from './utils/predictExpiryDate';
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, ChartTooltip, Legend);

const SPOONACULAR_KEY = process.env.REACT_APP_SPOONACULAR_KEY;
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

const ECOMMERCE_ENDPOINT = 'https:/amazon.com/buy';
const DONATION_ENDPOINT = 'https://example.com/donate';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

function App() {
  const [clockTime, setClockTime] = useState(new Date());
  const [familyMembers, setFamilyMembers] = useState(['Alice', 'Bob']);
  const [currentUser, setCurrentUser] = useState('Alice');
  const [language, setLanguage] = useState('en');
  const [items, setItems] = useState([]);
  const [inputName, setInputName] = useState('');
  const [inputExpiry, setInputExpiry] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [inputCategory, setInputCategory] = useState('Other');
  const [imageSearchResults, setImageSearchResults] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [typedQuery, setTypedQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(5);
  const prevClassificationsRef = useRef({});
  const [badges, setBadges] = useState([]);
  const wastedCounts = useRef({});
  const [donatedItems, setDonatedItems] = useState([]);
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const supportedCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('smartPantryCurrency') || 'USD'
  );
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥' };
  const currencySymbol = currencySymbols[currency] || currency;
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [toBuyOpen, setToBuyOpen] = useState(false);
  const [toBuyItems, setToBuyItems] = useState([]); 
  const [toBuyName, setToBuyName] = useState('');
  const [toBuyQty, setToBuyQty] = useState('');

  const toBuyChartData = {
    labels: toBuyItems.map((item) => item.name),
    datasets: [
      {
        label: 'Quantity',
        data: toBuyItems.map((item) => item.qty),
        backgroundColor: 'rgba(255, 159, 64, 0.5)' 
      }
    ]
  };

  const toBuyChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'TO BUY Items' }
    }
  };

  

  useEffect(() => {
    const interval = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedItems = localStorage.getItem('smartPantryItems');
    if (storedItems) setItems(JSON.parse(storedItems));
    const storedBadges = localStorage.getItem('smartPantryBadges');
    if (storedBadges) setBadges(JSON.parse(storedBadges));
    const storedDonated = localStorage.getItem('smartPantryDonated');
    if (storedDonated) setDonatedItems(JSON.parse(storedDonated));
  }, []);

  useEffect(() => {
    localStorage.setItem('smartPantryItems', JSON.stringify(items));
    localStorage.setItem('smartPantryBadges', JSON.stringify(badges));
    localStorage.setItem('smartPantryDonated', JSON.stringify(donatedItems));
    if (items.length > 0) {
      fetchRecipes(recipeCount);
    } else {
      setRecipes([]);
    }
    // eslint-disable-next-line
  }, [items, recipeCount, badges, donatedItems]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newClassifications = {};
    items.forEach((item) => {
      newClassifications[item.id] = classifyItem(item.expiry, currentTime);
    });
    Object.keys(newClassifications).forEach((id) => {
      const oldClass = prevClassificationsRef.current[id];
      const newClass = newClassifications[id];
      if (oldClass && oldClass !== newClass) {
        showNotification(`Item "${getItemNameById(id)}" is now ${newClass.toUpperCase()}`);
      }
    });
    prevClassificationsRef.current = newClassifications;
  }, [items, currentTime]);

  useEffect(() => {
    const throwItemsCount = items.filter(
      (i) => classifyItem(i.expiry, currentTime) === 'throw'
    ).length;
    if (throwItemsCount === 0 && items.length > 0 && !badges.includes('Zero Waste Week')) {
      setBadges((prev) => [...prev, 'Zero Waste Week']);
      showNotification('Congrats! You earned the "Zero Waste Week" badge!');
    }
  }, [items, badges, currentTime]);

  useEffect(() => {
    localStorage.setItem('smartPantryCurrency', currency);
  }, [currency]);

  useEffect(() => {
    if (typedQuery.length > 2) {
      fetchItemImages(typedQuery);
    } else {
      setImageSearchResults([]);
    }
  }, [typedQuery]);

  function classifyItem(expiryDate, now) {
    const expiry = new Date(expiryDate);
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return 'throw';
    if (diffDays <= 2) return 'keep eye';
    return 'safe';
  }

  function getItemNameById(id) {
    const found = items.find((i) => i.id.toString() === id.toString());
    return found ? found.name : 'Unknown';
  }

  const handleAddItem = () => {
    if (!inputName.trim() || !inputExpiry.trim()) return;
    const parsedPrice = parseFloat(inputPrice) || 0;
    const newItem = {
      id: Date.now(),
      owner: currentUser,
      name: inputName.trim(),
      expiry: inputExpiry,
      price: parsedPrice,
      imageUrl: selectedImageUrl || null,
      category: inputCategory || 'Other'
    };
    setItems((prev) => [...prev, newItem]);
    setInputName('');
    setInputExpiry('');
    setInputPrice('');
    setInputCategory('Other');
    setSelectedImageUrl(null);
    setImageSearchResults([]);
  };

  const handleRemoveItem = (id) => {
    const itemToRemove = items.find((item) => item.id === id);
    if (classifyItem(itemToRemove.expiry, currentTime) === 'throw') {
      wastedCounts.current[itemToRemove.name] =
        (wastedCounts.current[itemToRemove.name] || 0) + 1;
      if (wastedCounts.current[itemToRemove.name] >= 3) {
        showNotification(
          `You’ve thrown away ${itemToRemove.name} multiple times. Consider buying smaller amounts!`
        );
      }
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditItem = (item) => {
    setEditItem({ ...item });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editItem.name.trim() || !editItem.expiry.trim()) return;
    const updatedPrice = parseFloat(editItem.price) || 0;
    setItems((prev) =>
      prev.map((i) => (i.id === editItem.id ? { ...editItem, price: updatedPrice } : i))
    );
    setEditDialogOpen(false);
  };

  const handleDonateItem = async (item) => {
    setItems((prev) => prev.filter((it) => it.id !== item.id));
    setDonatedItems((prev) => [...prev, item]);
    showNotification(`Item "${item.name}" donated successfully!`);
  };

  const handleBuyItem = async (item) => {
    showNotification(`Reordered "${item.name}" from e-commerce store!`);
  };

  const handleNameChange = (e) => {
    setInputName(e.target.value);
    setTypedQuery(e.target.value);
  };

  const fetchItemImages = async (query) => {
    if (!query) return;
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=5&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      setImageSearchResults(data.results || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  async function fetchRecipes(count) {
    try {
      const query = items.map((item) => item.name).join(',');
      if (!query) return;
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
          query
        )}&number=${count}&apiKey=${SPOONACULAR_KEY}`
      );
      const data = await response.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }

  const handleLoadMoreRecipes = () => setRecipeCount((prev) => prev + 5);

  const publishCommunityRecipe = () => {
    setCommunityRecipes((prev) => [
      ...prev,
      { title: 'User Homemade Pasta', id: Date.now(), user: currentUser }
    ]);
    showNotification('Community recipe published!');
  };

  const loadCommunityRecipes = () => {
    setCommunityRecipes([
      { title: 'Banana Bread by Chef X', id: 111, user: 'Chef X' },
      { title: 'Vegan Salad by Chef Y', id: 222, user: 'Chef Y' }
    ]);
    showNotification('Community recipes loaded!');
  };

  const handleOpenRecipeDetails = async (recipeId) => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_KEY}`
      );
      const data = await response.json();
      setSelectedRecipe(data);
      setRecipeDialogOpen(true);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  };

  const handleCloseRecipeDialog = () => {
    setRecipeDialogOpen(false);
    setSelectedRecipe(null);
  };

  const handleCategoryFilterChange = (event) => {
    setSelectedCategoryFilter(event.target.value);
  };

  // Classification repeated for clarity
  function classifyItemAgain(expiryDate, now) {
    const expiry = new Date(expiryDate);
    const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return 'throw';
    if (diffDays <= 2) return 'keep eye';
    return 'safe';
  }

  const filteredItems = items.filter((i) => {
    if (selectedCategoryFilter === 'All') return true;
    return i.category === selectedCategoryFilter;
  });

  const throwItems = filteredItems.filter(
    (i) => classifyItemAgain(i.expiry, currentTime) === 'throw'
  );
  const keepEyeItems = filteredItems.filter(
    (i) => classifyItemAgain(i.expiry, currentTime) === 'keep eye'
  );
  const safeItems = filteredItems.filter(
    (i) => classifyItemAgain(i.expiry, currentTime) === 'safe'
  );

  const totalThrowValue = throwItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const totalKeepEyeValue = keepEyeItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const totalSafeValue = safeItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const totalInventoryValue = totalThrowValue + totalKeepEyeValue + totalSafeValue;

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3'],
    datasets: [
      {
        label: 'Money Wasted',
        data: [20, 5, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        label: 'Money Safe',
        data: [80, 120, 150],
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weekly Stats' }
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      alert('Web Speech API not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.lang = language;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      parseVoiceInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  function parseVoiceInput(transcript) {
    setInputName(transcript);
    showNotification(`Heard: "${transcript}" (Please fill in expiry/price)`);
  }

  function showNotification(message) {
    setNotificationMessage(message);
    setNotificationOpen(true);
  }

  const handleCloseNotification = () => {
    setNotificationOpen(false);
    setNotificationMessage('');
  };

  
  const handleOpenToBuy = () => {
    setToBuyOpen(true);
  };

  
  const handleCloseToBuy = () => {
    setToBuyOpen(false);
  };

  
  const handleAddToBuyItem = () => {
    if (!toBuyName.trim()) return;
    const qtyNum = parseFloat(toBuyQty) || 0;
    setToBuyItems((prev) => [...prev, { name: toBuyName, qty: qtyNum }]);
    setToBuyName('');
    setToBuyQty('');
  };

  return (
    <ThemeProvider theme={pastelTheme}>
      <Box sx={PastelBackgroundStyle}>

        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar onOpenToBuy={handleOpenToBuy} />
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
              <Typography variant="h4" gutterBottom align="center">
                Smart Pantry (Pastel Version)
              </Typography>

              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: 'primary.light',
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="subtitle1">
                    {clockTime.toLocaleTimeString()}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1">LIVE</Typography>
                    <Box
                      sx={{
                        backgroundColor: 'secondary.main',
                        width: 10,
                        height: 10,
                        borderRadius: '50%'
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {badges.length > 0 && (
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mb={2}>
                  {badges.map((badge) => (
                    <Chip key={badge} label={badge} color="secondary" variant="outlined" />
                  ))}
                </Box>
              )}

              <Box display="flex" justifyContent="center" gap={2} mb={2} flexWrap="wrap">
                <FormControl size="small">
                  <InputLabel>Currency</InputLabel>
                  <Select
                    label="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    sx={{ width: 120 }}
                  >
                    {supportedCurrencies.map((cur) => (
                      <MenuItem key={cur} value={cur}>
                        {cur}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Tooltip title="Speak item details">
                  <Button
                    variant="contained"
                    color={isListening ? 'secondary' : 'primary'}
                    onClick={startListening}
                  >
                    {isListening ? 'Listening...' : 'Voice Input'}
                  </Button>
                </Tooltip>
              </Box>

              <Box
                display="flex"
                gap={2}
                mb={4}
                flexWrap="wrap"
                justifyContent="center"
                sx={{
                  backgroundColor: 'background.paper',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
                }}
              >
                <TextField
                  label="Item Name"
                  variant="outlined"
                  value={inputName}
                  onChange={handleNameChange}
                />
                <TextField
                  label="Expiry Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={inputExpiry}
                  onChange={(e) => setInputExpiry(e.target.value)}
                />
                <TextField
                  label={`Price (${currencySymbol})`}
                  variant="outlined"
                  type="number"
                  inputProps={{ step: '0.01' }}
                  value={inputPrice}
                  onChange={(e) => setInputPrice(e.target.value)}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={inputCategory}
                    onChange={(e) => setInputCategory(e.target.value)}
                  >
                    <MenuItem value="Vegetables">Vegetables</MenuItem>
                    <MenuItem value="Meat">Meat</MenuItem>
                    <MenuItem value="Dairy">Dairy</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" onClick={() => fetchItemImages(inputName)}>
                  Search Images
                </Button>
                <Button variant="contained" color="primary" onClick={handleAddItem}>
                  Add Item
                </Button>

                {imageSearchResults.length > 0 && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Select an Image:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {imageSearchResults.map((img) => (
                        <Box
                          key={img.id}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => setSelectedImageUrl(img.urls.small)}
                        >
                          <img
                            src={img.urls.thumb}
                            alt={img.alt_description}
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {selectedImageUrl && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Selected Image Preview:
                    </Typography>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={selectedImageUrl}
                        alt="Selected"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  justifyContent: 'center',
                  mb: 4
                }}
              >
                <StatCard
                  title="Money Wasted"
                  value={`${currencySymbol}${totalThrowValue.toFixed(2)}`}
                />
                <StatCard
                  title="Money at Risk"
                  value={`${currencySymbol}${totalKeepEyeValue.toFixed(2)}`}
                />
                <StatCard
                  title="Money Safe"
                  value={`${currencySymbol}${totalSafeValue.toFixed(2)}`}
                />
                <StatCard
                  title="Total Inventory"
                  value={`${currencySymbol}${totalInventoryValue.toFixed(2)}`}
                />
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pantry Insights (Click to Expand)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Bar data={chartData} options={chartOptions} />
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Box display="flex" justifyContent="center" gap={2} mt={4}>
                <FormControl size="small">
                  <InputLabel>Filter Category</InputLabel>
                  <Select
                    label="Filter Category"
                    value={selectedCategoryFilter}
                    onChange={handleCategoryFilterChange}
                    sx={{ width: 150 }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Vegetables">Vegetables</MenuItem>
                    <MenuItem value="Meat">Meat</MenuItem>
                    <MenuItem value="Dairy">Dairy</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                centered
                textColor="primary"
                indicatorColor="secondary"
                sx={{ mt: 2, mb: 2 }}
              >
                <Tab label={`Throw (${throwItems.length})`} />
                <Tab label={`Keep Eye (${keepEyeItems.length})`} />
                <Tab label={`Safe (${safeItems.length})`} />
              </Tabs>

              <TabPanel value={selectedTab} index={0}>
                {throwItems.length === 0 ? (
                  <Typography>No expired items yet.</Typography>
                ) : (
                  <ItemGrid
                    items={throwItems}
                    now={currentTime}
                    currencySymbol={currencySymbol}
                    onRemove={handleRemoveItem}
                    onEdit={handleEditItem}
                    onDonate={handleDonateItem}
                    onBuy={handleBuyItem}
                  />
                )}
              </TabPanel>

              <TabPanel value={selectedTab} index={1}>
                {keepEyeItems.length === 0 ? (
                  <Typography>No items near expiry.</Typography>
                ) : (
                  <ItemGrid
                    items={keepEyeItems}
                    now={currentTime}
                    currencySymbol={currencySymbol}
                    onRemove={handleRemoveItem}
                    onEdit={handleEditItem}
                    onDonate={handleDonateItem}
                    onBuy={handleBuyItem}
                  />
                )}
              </TabPanel>

              <TabPanel value={selectedTab} index={2}>
                {safeItems.length === 0 ? (
                  <Typography>No safe items. Add something above!</Typography>
                ) : (
                  <ItemGrid
                    items={safeItems}
                    now={currentTime}
                    currencySymbol={currencySymbol}
                    onRemove={handleRemoveItem}
                    onEdit={handleEditItem}
                    onDonate={handleDonateItem}
                    onBuy={handleBuyItem}
                  />
                )}
              </TabPanel>

              <Box mt={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Recipe Suggestions (showing {recipes.length}/{recipeCount})
                </Typography>
                {recipes.length === 0 ? (
                  <Typography>Add items to see recipe suggestions.</Typography>
                ) : (
                  <RecipeGrid recipes={recipes} onViewDetails={handleOpenRecipeDetails} />
                )}
                {recipes.length > 0 && (
                  <Box mt={2}>
                    <Button variant="outlined" onClick={handleLoadMoreRecipes}>
                      Load More
                    </Button>
                  </Box>
                )}
              </Box>

              <Box mt={4}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Community Recipes
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <Button variant="contained" onClick={publishCommunityRecipe}>
                    Publish My Recipe
                  </Button>
                  <Button variant="outlined" onClick={loadCommunityRecipes}>
                    Load Community Recipes
                  </Button>
                </Box>
                {communityRecipes.length === 0 ? (
                  <Typography>No community recipes yet.</Typography>
                ) : (
                  communityRecipes.map((r) => (
                    <Typography key={r.id} variant="body1" sx={{ mt: 1 }}>
                      {r.title} <i>(shared by {r.user})</i>
                    </Typography>
                  ))
                )}
              </Box>

              <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Pantry Item</DialogTitle>
                {editItem && (
                  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                      label="Item Name"
                      variant="outlined"
                      value={editItem.name}
                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                    />
                    <TextField
                      label="Expiry Date"
                      type="date"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      value={editItem.expiry}
                      onChange={(e) => setEditItem({ ...editItem, expiry: e.target.value })}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Predicted Expiry: {predictExpiryDate(editItem.expiry)}
                    </Typography>
                    <TextField
                      label={`Price (${currencySymbol})`}
                      variant="outlined"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      value={editItem.price}
                      onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                    />
                    <TextField
                      label="Category"
                      variant="outlined"
                      value={editItem.category}
                      onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    />
                  </DialogContent>
                )}
                <DialogActions>
                  <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                  <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                    Save
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog open={recipeDialogOpen} onClose={handleCloseRecipeDialog} fullWidth>
                <DialogTitle>Recipe Details</DialogTitle>
                {selectedRecipe && (
                  <DialogContent dividers>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {selectedRecipe.title}
                    </Typography>
                    <Typography gutterBottom>Servings: {selectedRecipe.servings}</Typography>
                    <Typography gutterBottom>
                      Ready in {selectedRecipe.readyInMinutes} minutes
                    </Typography>
                    {selectedRecipe.image && (
                      <Box
                        component="img"
                        src={selectedRecipe.image}
                        alt={selectedRecipe.title}
                        sx={{ width: '100%', mb: 2, borderRadius: 2 }}
                      />
                    )}
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Instructions
                    </Typography>
                    <Typography
                      variant="body2"
                      dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
                    />
                  </DialogContent>
                )}
                <DialogActions>
                  <Button onClick={handleCloseRecipeDialog}>Close</Button>
                </DialogActions>
              </Dialog>

              <Snackbar
                open={notificationOpen}
                autoHideDuration={4000}
                onClose={handleCloseNotification}
              >
                <Alert
                  onClose={handleCloseNotification}
                  severity="info"
                  sx={{ width: '100%' }}
                >
                  {notificationMessage}
                </Alert>
              </Snackbar>
            </Container>
          </Box>
        </Box>

        {/* TO BUY DIALOG with chart */}
        <Dialog open={toBuyOpen} onClose={handleCloseToBuy} fullWidth maxWidth="sm">
          <DialogTitle>TO BUY</DialogTitle>
          <DialogContent dividers>
            {/* The chart for toBuyItems */}
            {toBuyItems.length === 0 ? (
              <Typography variant="body2" gutterBottom>
                No items yet. Add some below!
              </Typography>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Bar data={toBuyChartData} options={toBuyChartOptions} />
              </Box>
            )}

            {/* A small form for adding line items */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
              <TextField
                label="Item Name"
                value={toBuyName}
                onChange={(e) => setToBuyName(e.target.value)}
              />
              <TextField
                label="Qty"
                type="number"
                sx={{ width: 80 }}
                value={toBuyQty}
                onChange={(e) => setToBuyQty(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddToBuyItem}>
                Add
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseToBuy}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;
