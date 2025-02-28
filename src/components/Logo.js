import React from 'react';
import { Box, SvgIcon } from '@mui/material';

const KaimLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 200 60">
    <path
      fill="#0047BB"
      d="M20 16h4v28h-4zM40 16l-12 14 12 14h-5l-12-14 12-14zM50 16v28h-4V16zM65 16h4v28h-4zM85 30h-10v-4h10zM95 16v28h-4V16z"
    />
    <circle cx="15" cy="20" r="3" fill="#0047BB" />
    <circle cx="30" cy="15" r="3" fill="#0047BB" />
    <circle cx="40" cy="25" r="3" fill="#0047BB" />
    <circle cx="25" cy="30" r="3" fill="#0047BB" />
    <circle cx="10" cy="35" r="3" fill="#0047BB" />
    <path
      stroke="#0047BB"
      strokeWidth="2"
      fill="none"
      d="M15 20L30 15L40 25L25 30L10 35"
    />
  </SvgIcon>
);

export const Logo = ({ height = 40 }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <KaimLogo
        sx={{
          fontSize: height,
          color: 'primary.main',
          transition: 'filter 0.3s ease',
          '&:hover': {
            filter: 'brightness(1.2)'
          }
        }}
      />
      <Box
        sx={{
          color: 'primary.main',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          ml: 2
        }}
      >
        Systems
      </Box>
    </Box>
  );
};
