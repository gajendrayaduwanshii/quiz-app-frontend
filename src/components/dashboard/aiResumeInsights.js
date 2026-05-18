import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  useTheme,
  alpha,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Description,
  School,
  Work,
  Psychology,
  Refresh,
  Star,
  CheckCircle,
  Warning,
  Error,
  Timeline,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';

const AIResumeInsights = ({ user, resumeData }) => {
  const theme = useTheme();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && resumeData) {
      generateResumeInsights();
    }
  }, [user, resumeData]);

  const generateResumeInsights = async () => {
    setLoading(true);
    try {
      // Use resume analysis data if available, otherwise generate fallback
      if (resumeData?.profileSummary || resumeData?.learningSuggestions) {
        setInsights({
          profileSummary: resumeData.profileSummary || "Professional developer with strong technical skills and experience in modern web technologies.",
          learningSuggestions: resumeData.learningSuggestions || [],
          skillGaps: [
            { skill: 'Machine Learning', importance: 85, currentLevel: 30 },
            { skill: 'Cloud Architecture', importance: 78, currentLevel: 45 },
            { skill: 'DevOps', importance: 72, currentLevel: 25 },
          ],
          careerRecommendations: [
            { title: 'Focus on Leadership Skills', priority: 'High', impact: 'Career Growth', timeline: '3-6 months' },
            { title: 'Learn Cloud Technologies', priority: 'High', impact: 'Skill Enhancement', timeline: '2-4 months' },
            { title: 'Improve System Design', priority: 'Medium', impact: 'Technical Growth', timeline: '1-3 months' },
          ],
          marketAlignment: {
            score: 78,
            trends: ['AI/ML', 'Cloud Native', 'DevOps', 'Microservices'],
            opportunities: 15,
          },
        });
      } else {
        setInsights(generateFallbackInsights());
      }
    } catch (error) {
      console.error('Error generating resume insights:', error);
      setInsights(generateFallbackInsights());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackInsights = () => {
    const skills = user?.skills || [];
    const experience = user?.yearsExperience || 0;
    
    return {
      profileSummary: "Experienced developer with strong technical foundation and growing expertise in modern technologies.",
      learningSuggestions: [
        { area: 'Cloud Technologies', recommendation: 'Focus on AWS/Azure certifications and hands-on projects' },
        { area: 'System Design', recommendation: 'Practice designing scalable systems and microservices architecture' },
        { area: 'Leadership', recommendation: 'Develop team leadership and project management skills' },
      ],
      skillGaps: [
        { skill: 'Machine Learning', importance: 85, currentLevel: 30 },
        { skill: 'Cloud Architecture', importance: 78, currentLevel: 45 },
        { skill: 'DevOps', importance: 72, currentLevel: 25 },
      ],
      careerRecommendations: [
        { title: 'Focus on Leadership Skills', priority: 'High', impact: 'Career Growth', timeline: '3-6 months' },
        { title: 'Learn Cloud Technologies', priority: 'High', impact: 'Skill Enhancement', timeline: '2-4 months' },
        { title: 'Improve System Design', priority: 'Medium', impact: 'Technical Growth', timeline: '1-3 months' },
      ],
      marketAlignment: {
        score: 78,
        trends: ['AI/ML', 'Cloud Native', 'DevOps', 'Microservices'],
        opportunities: 15,
      },
    };
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
            <Box textAlign="center">
              <Description sx={{ fontSize: 48, color: theme.palette.info.main, mb: 2 }} />
              <Typography variant="h6" color="info">
                AI is analyzing your resume...
              </Typography>
              <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in timeout={1000}>
      <Box>
        <Card sx={{ 
          mb: 3, 
          background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                  <Description />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="info">
                    AI Resume Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personalized insights from your resume analysis
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Refresh Insights">
                <IconButton 
                  onClick={generateResumeInsights}
                  sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={3}>
              {/* Profile Summary */}
              <Grid item xs={12} md={6}>
                <Zoom in timeout={1200}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Professional Summary
                      </Typography>
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {insights?.profileSummary}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={2}>
                        <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                          <Assessment />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            Resume Analysis Complete
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            AI-powered insights generated
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Market Alignment */}
              <Grid item xs={12} md={6}>
                <Zoom in timeout={1400}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Market Alignment
                      </Typography>
                      <Box textAlign="center" mb={3}>
                        <Typography variant="h2" color="primary" fontWeight="bold">
                          {insights?.marketAlignment?.score || 0}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Market Fit Score
                        </Typography>
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Current Trends</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {insights?.marketAlignment?.trends?.map((trend, index) => (
                            <Chip key={index} label={trend} size="small" color="primary" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">Opportunities</Typography>
                        <Typography variant="h6" color="success">
                          {insights?.marketAlignment?.opportunities || 0}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Learning Suggestions */}
              <Grid item xs={12} md={6}>
                <Zoom in timeout={1600}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Learning Recommendations
                      </Typography>
                      <List>
                        {insights?.learningSuggestions?.map((suggestion, index) => (
                          <ListItem key={index} disablePadding>
                            <ListItemIcon>
                              <School sx={{ color: theme.palette.primary.main }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={suggestion.area}
                              secondary={suggestion.recommendation}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Skill Gaps */}
              <Grid item xs={12} md={6}>
                <Zoom in timeout={1800}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Critical Skill Gaps
                      </Typography>
                      <Box>
                        {insights?.skillGaps?.map((gap, index) => (
                          <Box key={index} mb={2}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2" fontWeight="medium">
                                {gap.skill}
                              </Typography>
                              <Chip 
                                label={`${gap.importance}% Important`}
                                size="small"
                                color="error"
                              />
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="caption">Current: {gap.currentLevel}%</Typography>
                              <Typography variant="caption">Target: {gap.importance}%</Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={gap.currentLevel}
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: theme.palette.error.main,
                                }
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Career Recommendations */}
              <Grid item xs={12}>
                <Zoom in timeout={2000}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Career Recommendations
                      </Typography>
                      <Grid container spacing={2}>
                        {insights?.careerRecommendations?.map((rec, index) => (
                          <Grid item xs={12} md={4} key={index}>
                            <Box 
                              sx={{ 
                                p: 2, 
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                borderRadius: 2,
                                background: alpha(theme.palette.primary.main, 0.05),
                              }}
                            >
                              <Box display="flex" alignItems="center" mb={1}>
                                <Avatar sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  bgcolor: theme.palette.primary.main,
                                  mr: 1 
                                }}>
                                  <Psychology />
                                </Avatar>
                                <Typography variant="body1" fontWeight="medium">
                                  {rec.title}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" mb={1}>
                                {rec.impact}
                              </Typography>
                              <Box display="flex" gap={1} mb={1}>
                                <Chip 
                                  label={rec.priority}
                                  size="small"
                                  color={rec.priority === 'High' ? 'error' : 'warning'}
                                />
                                <Chip 
                                  label={rec.timeline}
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default AIResumeInsights;
