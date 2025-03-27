// src/components/RecipeGrid.jsx
import React from 'react';
import { Box, Card, CardMedia, CardContent, CardActions, Button, Typography } from '@mui/material';

function RecipeGrid({ recipes, onViewDetails }) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
      gap={2}
    >
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <CardMedia
            component="img"
            height="140"
            image={recipe.image}
            alt={recipe.title}
          />
          <CardContent>
            <Typography fontWeight="bold">{recipe.title}</Typography>
            <Typography variant="body2">
              Used: {recipe.usedIngredientCount} | Missing: {recipe.missedIngredientCount}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => onViewDetails(recipe.id)}>
              View Details
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}

export default RecipeGrid;
