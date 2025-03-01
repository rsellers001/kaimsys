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
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';

const STANDARDS = [
  { id: 'nist', name: 'NIST 800.53' },
  { id: 'cobit', name: 'COBIT' },
  { id: 'sox', name: 'SOX' },
  { id: 'gdpr', name: 'GDPR' },
];

const ComplianceChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [primaryStandard, setPrimaryStandard] = useState('');
  const [secondaryStandard, setSecondaryStandard] = useState('');
  const [feedback, setFeedback] = useState({ open: false, chatId: null });
  
  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !primaryStandard) {
      setError('Please enter a message and select a primary standard');
      return;
    }

    const userMessage = {
      role: 'user',
      content: input,
      standards: { primary: primaryStandard, secondary: secondaryStandard },
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // Simulate an API response since we can't deploy the backend right now
      // In a real implementation, this would call the OpenAI API
      setTimeout(() => {
        const standardsInfo = {
          nist: "NIST 800.53 provides security controls for federal information systems.",
          cobit: "COBIT is a framework for IT governance and management.",
          sox: "Sarbanes-Oxley Act (SOX) regulates financial reporting for public companies.",
          gdpr: "GDPR is a regulation for data protection and privacy in the EU."
        };
        
        // Simple demo response based on selected standards
        let responseContent = `Based on ${STANDARDS.find(s => s.id === primaryStandard)?.name}`;
        if (secondaryStandard) {
          responseContent += ` and ${STANDARDS.find(s => s.id === secondaryStandard)?.name}`;
        }
        
        responseContent += ": \n\n";
        responseContent += standardsInfo[primaryStandard];
        
        if (secondaryStandard && standardsInfo[secondaryStandard]) {
          responseContent += "\n\nIn relation to the secondary standard: \n";
          responseContent += standardsInfo[secondaryStandard];
        }
        
        responseContent += "\n\nFor more specific information about your question, please consult the official documentation.";
        
        const newMessage = {
          role: 'assistant',
          content: responseContent,
          id: Date.now().toString(),
        };
        
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, newMessage];
          localStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
  
        setFeedback({ open: true, chatId: newMessage.id });
        setLoading(false);
      }, 1500); // Simulate API delay
      
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while processing your request');
      setLoading(false);
    }
  };
  };

  const handleFeedback = (chatId, rating) => {
    // Store feedback locally since we don't have a backend currently
    const feedbacks = JSON.parse(localStorage.getItem('feedback') || '{}');
    feedbacks[chatId] = { rating, timestamp: new Date().toISOString() };
    localStorage.setItem('feedback', JSON.stringify(feedbacks));
    
    console.log(`Feedback saved: ${chatId} rated ${rating}/5`);
    setFeedback({ open: false, chatId: null });
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
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
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
          open={feedback.open}
          autoHideDuration={10000}
          onClose={() => setFeedback({ open: false, chatId: null })}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Was this response helpful?
            </Typography>
            <Rating
              name="feedback"
              onChange={(event, newValue) => {
                handleFeedback(feedback.chatId, newValue);
              }}
            />
          </Paper>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default ComplianceChat;
