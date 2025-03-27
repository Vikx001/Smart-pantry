// src/utils/predictExpiryDate.js
export function predictExpiryDate(originalExpiry) {
    // Demo logic: subtract 1 day from the user input expiry
    const date = new Date(originalExpiry);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0]; // Return as YYYY-MM-DD
  }
  