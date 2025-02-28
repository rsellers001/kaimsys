import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function Services() {
  return (
    <Container>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ py: 4 }}
      >
        <Typography variant="h2" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="body1" paragraph>
          Discover our comprehensive range of AI and automation services designed to
          transform your business operations.
        </Typography>
      </MotionBox>
    </Container>
  );
}

export default Services;
