// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Card, CardContent } from '@mui/material';

function Sidebar({ onOpenToBuy }) {
  // Example pastel color for sidebar distinct from your main theme
  const sidebarBgColor = '#C7CEEA'; // pastel lavender

  // A few rotating tips/fun facts
  const tips = [
    "Freeze leftover veggies to make stock later!",
    "Use fruit scraps for tasty infused water!",
    "Plan meals to avoid overbuying. Less waste, more savings!",
    "Compost your peels to enrich soil naturally!",
    "Store herbs upright in water to keep them fresher longer!"
  ];

  // We'll pick one at random on each load
  const [tip, setTip] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);

  return (
    <Box
      sx={{
        width: 220,
        backgroundColor: sidebarBgColor,
        color: 'text.primary',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 6px rgba(0,0,0,0.05)'
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Navigation
      </Typography>

      {/* Simple Nav List */}
      <List>
        <ListItemButton>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Pantry" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Recipes" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Community" />
        </ListItemButton>

        {/* "TO BUY" nav item calls onOpenToBuy when clicked */}
        <ListItemButton onClick={onOpenToBuy}>
          <ListItemText primary="TO BUY" />
        </ListItemButton>
      </List>

      {/* Tip of the Day / Fun Fact Card */}
      <Card sx={{ mt: 3, backgroundColor: 'rgba(255,255,255,0.5)' }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Tip of the Day
          </Typography>
          <Typography variant="body2">
            {tip}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Sidebar;
