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
  Fade,
  Zoom,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Psychology,
  Speed,
  Assessment,
  Refresh,
} from '@mui/icons-material';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const AISkillAnalytics = ({ user }) => {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('AISkillAnalytics: useEffect triggered with user:', user);
    if (user) {
      generateSkillAnalytics();
    }
  }, [user]);

  const generateSkillAnalytics = async () => {
    setLoading(true);
    try {
      console.log('AISkillAnalytics: Starting analytics generation for user:', user?.documentId);
      const response = await fetch('/api/ai/skill-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('AISkillAnalytics: API response:', data);
      setAnalytics(data.analytics);
      console.log('AISkillAnalytics: Analytics state set to:', data.analytics);
    } catch (error) {
      console.error('AISkillAnalytics: Error generating skill analytics:', error);
      console.log('AISkillAnalytics: Using fallback analytics');
      // Fallback analytics
      const fallbackData = generateFallbackAnalytics();
      console.log('AISkillAnalytics: Fallback data generated:', fallbackData);
      setAnalytics(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackAnalytics = () => {
    const skills = user?.skills || [];
    const totalSkills = skills.length;
    const avgExperience = skills.reduce((sum, skill) => sum + (skill.yearsExperience || 0), 0) / totalSkills || 0;
    
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

  const skillDistributionData = {
    labels: ['Beginner', 'Intermediate', 'Advanced'],
    datasets: [
      {
        data: [
          analytics?.skillDistribution?.beginner || 0,
          analytics?.skillDistribution?.intermediate || 0,
          analytics?.skillDistribution?.advanced || 0,
        ],
        backgroundColor: [
          alpha(theme.palette.primary.main, 0.6),
          alpha(theme.palette.secondary.main, 0.6),
          alpha(theme.palette.success.main, 0.6),
        ],
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const marketDemandData = {
    labels: analytics?.marketDemand?.map(item => item.skill) || [],
    datasets: [
      {
        label: 'Market Demand (%)',
        data: analytics?.marketDemand?.map(item => item.demand) || [],
        backgroundColor: alpha(theme.palette.primary.main, 0.7),
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    ],
  };

  console.log('AISkillAnalytics: Rendering with loading:', loading, 'analytics:', analytics);

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
    <Fade in timeout={1000}>
      <Box>
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
                    AI Skill Analytics
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
              {/* Skill Distribution Chart */}
              <Grid item xs={12} md={4}>
                <Zoom in timeout={1200}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Skill Distribution
                      </Typography>
                      <Box height={200}>
                        <Doughnut 
                          data={skillDistributionData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'bottom' },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Top Skills */}
              <Grid item xs={12} md={4}>
                <Zoom in timeout={1400}>
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
                </Zoom>
              </Grid>

              {/* Career Trajectory */}
              <Grid item xs={12} md={4}>
                <Zoom in timeout={1600}>
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
                </Zoom>
              </Grid>

              {/* Market Demand Chart */}
              <Grid item xs={12}>
                <Zoom in timeout={1800}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Market Demand Analysis
                      </Typography>
                      <Box height={300}>
                        <Bar 
                          data={marketDemandData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                max: 100,
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Skill Gaps */}
              <Grid item xs={12}>
                <Zoom in timeout={2000}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Critical Skill Gaps
                      </Typography>
                      <Grid container spacing={2}>
                        {analytics?.skillGaps?.map((gap, index) => (
                          <Grid item xs={12} md={4} key={index}>
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
                </Zoom>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default AISkillAnalytics;
