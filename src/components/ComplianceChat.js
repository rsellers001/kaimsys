import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Snackbar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Simple demo standards
const STANDARDS = [
  { id: 'nist', name: 'NIST 800.53' },
  { id: 'cobit', name: 'COBIT' },
  { id: 'sox', name: 'SOX' },
  { id: 'gdpr', name: 'GDPR' },
];

// Demo responses for each standard
const STANDARD_INFO = {
  nist: {
    title: "NIST 800.53",
    description: "Provides security and privacy controls for federal information systems and organizations.",
    responses: [
      "NIST 800.53 organizes security controls into 20 families, each focused on a specific aspect of security.",
      "Access Control (AC) in NIST 800.53 focuses on limiting system access to authorized users and processes.",
      "Audit and Accountability (AU) controls ensure that actions within systems can be traced to individuals.",
      "Configuration Management (CM) establishes baseline configurations and inventories of systems."
    ]
  },
  cobit: {
    title: "COBIT",
    description: "A framework created by ISACA for IT governance and management.",
    responses: [
      "COBIT 2019 is organized around 40 governance and management objectives.",
      "COBIT helps organizations optimize information and technology governance.",
      "The COBIT framework addresses the governance and management of information and technology.",
      "COBIT provides metrics and maturity models to measure the achievement of IT governance objectives."
    ]
  },
  sox: {
    title: "SOX",
    description: "The Sarbanes-Oxley Act regulates financial practice and corporate governance.",
    responses: [
      "SOX Section 404 requires management to assess internal controls over financial reporting.",
      "SOX was enacted in 2002 to protect investors from fraudulent financial reporting.",
      "SOX compliance requires establishing internal controls and reporting procedures.",
      "The Public Company Accounting Oversight Board (PCAOB) oversees SOX implementation."
    ]
  },
  gdpr: {
    title: "GDPR",
    description: "EU regulation on data protection and privacy for individuals within the EU.",
    responses: [
      "GDPR gives individuals control over their personal data through various rights.",
      "GDPR requires organizations to implement privacy by design and by default.",
      "Organizations must report data breaches within 72 hours under GDPR.",
      "GDPR fines can reach up to 4% of annual global turnover or €20 million, whichever is higher."
    ]
  }
};

const ComplianceChat = () => {
  // State management
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [primaryStandard, setPrimaryStandard] = useState('');
  const [secondaryStandard, setSecondaryStandard] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  // Load saved messages on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('complianceChatHistory');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (e) {
      console.error('Error loading chat history:', e);
    }
  }, []);

  const handleSend = () => {
    // Validate input
    if (!input.trim() || !primaryStandard) {
      setError('Please enter a message and select a primary standard');
      return;
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: input,
      standards: { 
        primary: STANDARD_INFO[primaryStandard]?.title, 
        secondary: secondaryStandard ? STANDARD_INFO[secondaryStandard]?.title : null 
      },
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    // Simulate response after delay
    setTimeout(() => {
      // Generate simple demo response
      const primaryInfo = STANDARD_INFO[primaryStandard];
      const secondaryInfo = secondaryStandard ? STANDARD_INFO[secondaryStandard] : null;
      
      // Pick a random response from the standard's prepared responses
      const randomPrimaryResponse = primaryInfo.responses[
        Math.floor(Math.random() * primaryInfo.responses.length)
      ];
      
      let responseText = `${primaryInfo.description}\n\n${randomPrimaryResponse}`;
      
      if (secondaryInfo) {
        const randomSecondaryResponse = secondaryInfo.responses[
          Math.floor(Math.random() * secondaryInfo.responses.length)
        ];
        
        responseText += `\n\nRegarding ${secondaryInfo.title}: ${randomSecondaryResponse}`;
      }
      
      // Add the AI response
      const aiMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => {
        const updatedMessages = [...prev, aiMessage];
        // Save to localStorage
        try {
          localStorage.setItem('complianceChatHistory', JSON.stringify(updatedMessages));
        } catch (e) {
          console.error('Error saving chat history:', e);
        }
        return updatedMessages;
      });
      
      setLoading(false);
      setFeedbackOpen(true);
    }, 1000);
  };

  const handleFeedback = (rating) => {
    // Simply log feedback in console and close dialog
    console.log(`User rated response: ${rating}/5`);
    setFeedbackOpen(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Typography variant="h5" gutterBottom>
          Compliance Standards Assistant
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Ask questions about NIST 800.53, COBIT, SOX, GDPR, and other compliance standards.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl required sx={{ minWidth: 200 }}>
            <InputLabel>Primary Standard</InputLabel>
            <Select
              value={primaryStandard}
              label="Primary Standard"
              onChange={(e) => setPrimaryStandard(e.target.value)}
            >
              {STANDARDS.map((standard) => (
                <MenuItem
                  key={standard.id}
                  value={standard.id}
                  disabled={standard.id === secondaryStandard}
                >
                  {standard.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Secondary Standard (Optional)</InputLabel>
            <Select
              value={secondaryStandard}
              label="Secondary Standard (Optional)"
              onChange={(e) => setSecondaryStandard(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {STANDARDS.map((standard) => (
                <MenuItem
                  key={standard.id}
                  value={standard.id}
                  disabled={standard.id === primaryStandard}
                >
                  {standard.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ height: 400, overflow: 'auto', mb: 3 }}>
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color={message.role === 'user' ? 'primary.main' : 'secondary.main'}
                          sx={{ fontWeight: 'bold' }}
                        >
                          {message.role === 'user' ? 'You' : 'Assistant'}
                        </Typography>
                        {message.standards && (
                          <Typography component="span" variant="caption" color="text.secondary">
                            {`${message.standards.primary}${message.standards.secondary ? ` & ${message.standards.secondary}` : ''}`}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {message.content}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about compliance standards..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={loading || !input.trim() || !primaryStandard}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : <SendIcon />}
          </Button>
        </Box>

        <Snackbar
          open={feedbackOpen}
          autoHideDuration={10000}
          onClose={() => setFeedbackOpen(false)}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Was this response helpful?
            </Typography>
            <Rating
              name="feedback"
              onChange={(event, newValue) => {
                handleFeedback(newValue);
              }}
            />
          </Paper>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ComplianceChat;
