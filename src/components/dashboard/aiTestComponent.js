import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const AITestComponent = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AITestComponent: User received:', user);
    if (user) {
      // Simulate API call
      setTimeout(() => {
        const testData = {
          message: 'Test data loaded successfully',
          userSkills: user.skills?.length || 0,
          userExperience: user.yearsExperience || 0,
          timestamp: new Date().toISOString()
        };
        console.log('AITestComponent: Test data generated:', testData);
        setData(testData);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  if (loading) {
    return (
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h6">AI Test Component - Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3, p: 2, bgcolor: 'success.light' }}>
      <CardContent>
        <Typography variant="h6" color="success.contrastText">
          AI Test Component - Working!
        </Typography>
        <Typography variant="body2" color="success.contrastText">
          Message: {data?.message}
        </Typography>
        <Typography variant="body2" color="success.contrastText">
          User Skills: {data?.userSkills}
        </Typography>
        <Typography variant="body2" color="success.contrastText">
          User Experience: {data?.userExperience} years
        </Typography>
        <Typography variant="body2" color="success.contrastText">
          Timestamp: {data?.timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AITestComponent;
