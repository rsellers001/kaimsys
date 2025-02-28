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
              Transform Your Business with AI
            </MotionTypography>
            <MotionTypography
              variant="h5"
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Harness the power of artificial intelligence to drive growth and innovation
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
              title: 'AI Solutions',
              description: 'Custom AI solutions tailored to your business needs'
            },
            {
              title: 'Data Analytics',
              description: 'Transform your data into actionable insights'
            },
            {
              title: 'Process Automation',
              description: 'Streamline operations with intelligent automation'
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
