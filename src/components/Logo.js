import React from 'react';
import { Box } from '@mui/material';

export const Logo = ({ height = 40 }) => {
  return (
    <Box
      component="img"
      src="/logo.png"
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
    />
  );
};
