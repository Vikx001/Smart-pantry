// src/components/ItemGrid.jsx
import React from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography
} from '@mui/material';

import { getCountdown } from '../utils/countdown';
import { predictExpiryDate } from '../utils/predictExpiryDate';

function ItemGrid({ items, now, currencySymbol, onRemove, onEdit, onDonate, onBuy }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
      gap={2}
    >
      {items.map((item) => {
        const countdown = getCountdown(item.expiry, now);
        const predictedExp = predictExpiryDate(item.expiry);

        return (
          <Card
            key={item.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {item.imageUrl && (
              <CardMedia
                component="img"
                height="140"
                image={item.imageUrl}
                alt={item.name}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <CardContent>
              <Typography fontWeight="bold" color="primary">
                {item.name}
              </Typography>
              <Typography variant="body2">
                Owner: {item.owner}
              </Typography>
              <Typography variant="body2">
                Category: {item.category}
              </Typography>
              <Typography variant="body2">
                Expires on: {item.expiry}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time left: {countdown}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Predicted Expiry: {predictedExp}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Price: {currencySymbol}
                {item.price?.toFixed(2)}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => onEdit(item)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ mr: 1 }}
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </Button>
              </Box>
              <Box>
                {onDonate && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => onDonate(item)}
                  >
                    Donate
                  </Button>
                )}
                {onBuy && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => onBuy(item)}
                  >
                    Buy
                  </Button>
                )}
              </Box>
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
}

export default ItemGrid;
