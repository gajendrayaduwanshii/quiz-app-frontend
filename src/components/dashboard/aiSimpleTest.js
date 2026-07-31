import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const AISimpleTest = ({ user }) => {
  console.log('AISimpleTest: Received user:', user);

  if (!user) {
    return (
      <Card sx={{ mb: 3, p: 2, bgcolor: 'error.light' }}>
        <CardContent>
          <Typography variant="h6" color="error.contrastText">
            No User Data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3, p: 2, bgcolor: 'primary.light' }}>
      <CardContent>
        <Typography variant="h6" color="primary.contrastText">
          AI Simple Test - Working!
        </Typography>
        <Typography variant="body2" color="primary.contrastText">
          User ID: {user.documentId}
        </Typography>
        <Typography variant="body2" color="primary.contrastText">
          Skills: {user.skills?.length || 0}
        </Typography>
        <Typography variant="body2" color="primary.contrastText">
          Experience: {user.yearsExperience || 0} years
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AISimpleTest;
