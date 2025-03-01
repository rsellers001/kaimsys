import React from 'react';
import { Container, Typography } from '@mui/material';
import ComplianceChat from '../components/ComplianceChat';

const ComplianceAssistant = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Compliance Standards Assistant
      </Typography>
      <ComplianceChat />
    </Container>
  );
};

export default ComplianceAssistant;
