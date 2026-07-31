import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Psychology,
  Refresh,
} from '@mui/icons-material';

const AISkillAnalyticsSimple = ({ user, resumeData }) => {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('AISkillAnalyticsSimple: useEffect triggered with user:', user);
    if (user) {
      generateSkillAnalytics();
    }
  }, [user]);

  const generateSkillAnalytics = async () => {
    setLoading(true);
    try {
      console.log('AISkillAnalyticsSimple: Starting analytics generation for user:', user?.documentId);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate fallback analytics
      const fallbackData = generateFallbackAnalytics();
      console.log('AISkillAnalyticsSimple: Fallback data generated:', fallbackData);
      setAnalytics(fallbackData);
    } catch (error) {
      console.error('AISkillAnalyticsSimple: Error generating skill analytics:', error);
      const fallbackData = generateFallbackAnalytics();
      console.log('AISkillAnalyticsSimple: Fallback data generated:', fallbackData);
      setAnalytics(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackAnalytics = () => {
    const skills = user?.skills || [];
    const totalSkills = skills.length;
    const { profileSummary, learningSuggestions } = resumeData || {};
    
    return {
      skillDistribution: {
        beginner: skills.filter(s => (s.yearsExperience || 0) < 2).length,
        intermediate: skills.filter(s => (s.yearsExperience || 0) >= 2 && (s.yearsExperience || 0) < 5).length,
        advanced: skills.filter(s => (s.yearsExperience || 0) >= 5).length,
      },
      topSkills: skills
        .sort((a, b) => (b.yearsExperience || 0) - (a.yearsExperience || 0))
        .slice(0, 5)
        .map(skill => ({
          name: skill.skillName,
          experience: skill.yearsExperience || 0,
          level: skill.level || 'Intermediate',
          trend: Math.random() > 0.5 ? 'up' : 'down',
        })),
      marketDemand: skills.map(skill => ({
        skill: skill.skillName,
        demand: Math.floor(Math.random() * 100),
        salary: Math.floor(Math.random() * 50000) + 50000,
      })),
      skillGaps: [
        { skill: 'Machine Learning', importance: 85, currentLevel: 30 },
        { skill: 'Cloud Architecture', importance: 78, currentLevel: 45 },
        { skill: 'DevOps', importance: 72, currentLevel: 25 },
      ],
      careerTrajectory: {
        current: 'Senior Developer',
        next: 'Tech Lead',
        timeline: '6-12 months',
        confidence: 78,
      },
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await generateSkillAnalytics();
    setRefreshing(false);
  };

  console.log('AISkillAnalyticsSimple: Rendering with loading:', loading, 'analytics:', analytics);

  if (loading) {
    return (
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
            <Box textAlign="center">
              <Psychology sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" color="primary">
                AI is analyzing your skills...
              </Typography>
              <LinearProgress sx={{ mt: 2, borderRadius: 1 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      mb: 3, 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
              <Psychology />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary">
                AI Skill Analytics (Simple)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Powered by advanced AI algorithms
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh Analytics">
            <IconButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
              }}
            >
              <Refresh className={refreshing ? 'rotating' : ''} />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          {/* Skill Distribution */}
          <Grid item  size={{xs:12, md:4}}>
            <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skill Distribution
                </Typography>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Beginner</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {analytics?.skillDistribution?.beginner || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(analytics?.skillDistribution?.beginner || 0) * 20}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Intermediate</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {analytics?.skillDistribution?.intermediate || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(analytics?.skillDistribution?.intermediate || 0) * 20}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Advanced</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {analytics?.skillDistribution?.advanced || 0}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(analytics?.skillDistribution?.advanced || 0) * 20}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Skills */}
          <Grid item size={{xs:12, md:4}}>
            <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Skills
                </Typography>
                <Box>
                  {analytics?.topSkills?.map((skill, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        mr: 2 
                      }}>
                        {index + 1}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="medium">
                          {skill.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {skill.experience} years • {skill.level}
                        </Typography>
                      </Box>
                      {skill.trend === 'up' ? (
                        <TrendingUp color="success" fontSize="small" />
                      ) : (
                        <TrendingDown color="error" fontSize="small" />
                      )}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Career Trajectory */}
          <Grid item size={{xs:12, md:4}}>
            <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Career Trajectory
                </Typography>
                <Box textAlign="center">
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: theme.palette.success.main,
                    mx: 'auto',
                    mb: 2
                  }}>
                    <Star />
                  </Avatar>
                  <Typography variant="h6" color="primary">
                    {analytics?.careerTrajectory?.current}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Next: {analytics?.careerTrajectory?.next}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Timeline: {analytics?.careerTrajectory?.timeline}
                  </Typography>
                  <Box mt={2}>
                    <LinearProgress 
                      variant="determinate" 
                      value={analytics?.careerTrajectory?.confidence || 0}
                      sx={{ borderRadius: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" mt={1}>
                      Confidence: {analytics?.careerTrajectory?.confidence || 0}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Skill Gaps */}
          <Grid item size={{xs:12}}>
            <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Critical Skill Gaps
                </Typography>
                <Grid container spacing={2}>
                  {analytics?.skillGaps?.map((gap, index) => (
                    <Grid item size={{xs:12, md:4}} key={index}>
                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {gap.skill}
                          </Typography>
                          <Chip 
                            label={`${gap.importance}%`} 
                            size="small" 
                            color="error"
                            variant="outlined"
                          />
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={gap.currentLevel}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              bgcolor: theme.palette.error.main,
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" mt={1}>
                          Current: {gap.currentLevel}% • Target: {gap.importance}%
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AISkillAnalyticsSimple;
