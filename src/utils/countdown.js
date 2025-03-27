// src/utils/countdown.js
export function getCountdown(expiryDate, now = new Date()) {
    const diff = new Date(expiryDate) - now;
    if (diff <= 0) return 'Expired';
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
  
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  