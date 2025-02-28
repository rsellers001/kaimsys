import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function About() {
  return (
    <Container>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ py: 4 }}
      >
        <Typography variant="h2" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" paragraph>
          We are a leading provider of AI solutions, dedicated to helping businesses leverage
          the power of artificial intelligence to achieve their goals.
        </Typography>
      </MotionBox>
    </Container>
  );
}

export default About;
