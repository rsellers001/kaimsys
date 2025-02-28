import React from 'react';
import { Box } from '@mui/material';
import logoImage from '../assets/logo.png';

export const Logo = ({ height = 40 }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        component="img"
        src={logoImage}
        alt="KAiM Systems"
        sx={{
          height: height,
          width: 'auto',
          display: 'block',
          filter: 'brightness(1)',
          transition: 'filter 0.3s ease',
          '&:hover': {
            filter: 'brightness(1.2)'
          }
        }}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      <Box
        sx={{
          display: 'inline',
          color: 'primary.main',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          ml: 1
        }}
      >
        KAiM Systems
      </Box>
    </Box>
  );
};
