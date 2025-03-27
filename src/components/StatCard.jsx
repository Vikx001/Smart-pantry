// src/components/StatCard.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

function StatCard({ title, value }) {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        p: 2,
        borderRadius: 1,
        minWidth: 120,
        textAlign: 'center',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  );
}

export default StatCard;
