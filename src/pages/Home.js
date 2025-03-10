import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);

function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MotionTypography
              variant="h1"
              sx={{ mb: 3 }}
            >
              Welcome to KAiM Systems
            </MotionTypography>
            <MotionTypography
              variant="h5"
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Empowering businesses with intelligent solutions for tomorrow's challenges
            </MotionTypography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
            >
              Learn More
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* Services Section */}
      <Container sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {[
            {
              title: 'AI Consulting',
              description: 'Strategic AI implementation and digital transformation guidance'
            },
            {
              title: 'Custom Solutions',
              description: 'Tailored AI and automation solutions for your specific needs'
            },
            {
              title: 'Integration Services',
              description: 'Seamless integration of AI systems with your existing infrastructure'
            }
          ].map((service, index) => (
            <Grid item xs={12} md={4} key={service.title}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
