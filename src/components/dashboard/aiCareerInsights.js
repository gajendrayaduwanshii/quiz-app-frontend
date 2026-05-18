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
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Work,
  School,
  Psychology,
  Timeline,
  Assessment,
  Refresh,
  Rocket,
  Star,
  Speed,
} from '@mui/icons-material';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
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
  RadialLinearScale,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const AICareerInsights = ({ user, resumeData }) => {
  const theme = useTheme();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateCareerInsights();
    }
  }, [user]);

  const generateCareerInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/career-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error generating career insights:', error);
      setInsights(generateFallbackInsights());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackInsights = () => {
    const skills = user?.skills || [];
    const experience = user?.yearsExperience || 0;
    const { profileSummary, learningSuggestions } = resumeData || {};
    
    return {
      careerPath: {
        current: 'Senior Developer',
        next: 'Tech Lead',
        future: 'Engineering Manager',
        timeline: '6-12 months',
        confidence: 85,
      },
      salaryProjection: {
        current: 85000,
        projected: 120000,
        market: 95000,
        growth: 15.2,
      },
      skillMatrix: {
        technical: 78,
        leadership: 45,
        communication: 82,
        problemSolving: 88,
        innovation: 65,
      },
      opportunities: [
        {
          title: 'Senior Full Stack Developer',
          company: 'Tech Corp',
          match: 92,
          salary: '₹12-15 LPA',
          skills: ['React', 'Node.js', 'AWS'],
        },
        {
          title: 'Tech Lead',
          company: 'StartupXYZ',
          match: 88,
          salary: '₹15-20 LPA',
          skills: ['Leadership', 'Architecture', 'Mentoring'],
        },
        {
          title: 'Principal Engineer',
          company: 'BigTech Inc',
          match: 75,
          salary: '₹18-25 LPA',
          skills: ['System Design', 'Scalability', 'Innovation'],
        },
      ],
      marketTrends: [
        { month: 'Jan', demand: 65, salary: 85000 },
        { month: 'Feb', demand: 72, salary: 87000 },
        { month: 'Mar', demand: 78, salary: 89000 },
        { month: 'Apr', demand: 82, salary: 92000 },
        { month: 'May', demand: 85, salary: 95000 },
        { month: 'Jun', demand: 88, salary: 98000 },
      ],
      recommendations: [
        {
          type: 'skill',
          title: 'Learn Cloud Architecture',
          priority: 'High',
          impact: 'Career Growth',
          timeline: '3-6 months',
        },
        {
          type: 'certification',
          title: 'AWS Solutions Architect',
          priority: 'Medium',
          impact: 'Salary Boost',
          timeline: '2-4 months',
        },
        {
          type: 'soft-skill',
          title: 'Leadership Training',
          priority: 'High',
          impact: 'Management Role',
          timeline: '6-12 months',
        },
      ],
    };
  };

  const skillMatrixData = {
    labels: ['Technical', 'Leadership', 'Communication', 'Problem Solving', 'Innovation'],
    datasets: [
      {
        label: 'Current Skills',
        data: [
          insights?.skillMatrix?.technical || 0,
          insights?.skillMatrix?.leadership || 0,
          insights?.skillMatrix?.communication || 0,
          insights?.skillMatrix?.problemSolving || 0,
          insights?.skillMatrix?.innovation || 0,
        ],
        backgroundColor: alpha(theme.palette.primary.main, 0.6),
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
      },
    ],
  };

  const marketTrendsData = {
    labels: insights?.marketTrends?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Market Demand (%)',
        data: insights?.marketTrends?.map(item => item.demand) || [],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Average Salary (₹)',
        data: insights?.marketTrends?.map(item => item.salary / 1000) || [],
        borderColor: theme.palette.secondary.main,
        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
            <Box textAlign="center">
              <Timeline sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 2 }} />
              <Typography variant="h6" color="secondary">
                AI is analyzing your career path...
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
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                  <Timeline />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="secondary">
                    AI Career Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personalized career trajectory analysis
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Refresh Insights">
                <IconButton 
                  onClick={generateCareerInsights}
                  sx={{ 
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={3}>
              {/* Career Path */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1200}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Career Progression
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                            <Work />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {insights?.careerPath?.current}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Current Position
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                            <Rocket />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {insights?.careerPath?.next}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Next Step
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                            <Star />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {insights?.careerPath?.future}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Future Goal
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Timeline: {insights?.careerPath?.timeline}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={insights?.careerPath?.confidence || 0}
                            sx={{ borderRadius: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary" mt={1}>
                            Confidence: {insights?.careerPath?.confidence || 0}%
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Salary Projection */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1400}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Salary Projection
                      </Typography>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          ₹{insights?.salaryProjection?.current?.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Current Salary
                        </Typography>
                        
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Projected:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ₹{insights?.salaryProjection?.projected?.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Market Avg:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ₹{insights?.salaryProjection?.market?.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Chip 
                          label={`+${insights?.salaryProjection?.growth || 0}% Growth`}
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Skill Matrix */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1600}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Skill Matrix
                      </Typography>
                      <Box height={200}>
                        <Radar 
                          data={skillMatrixData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                            },
                            scales: {
                              r: {
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

              {/* Market Trends */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={1800}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Market Trends
                      </Typography>
                      <Box height={300}>
                        <Line 
                          data={marketTrendsData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'top' },
                            },
                            scales: {
                              y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                              },
                              y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                grid: {
                                  drawOnChartArea: false,
                                },
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Job Opportunities */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={2000}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recommended Opportunities
                      </Typography>
                      <Box>
                        {insights?.opportunities?.map((job, index) => (
                          <Box key={index} mb={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body1" fontWeight="medium">
                                {job.title}
                              </Typography>
                              <Chip 
                                label={`${job.match}% Match`}
                                color={job.match > 85 ? 'success' : job.match > 70 ? 'warning' : 'default'}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              {job.company} • {job.salary}
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              {job.skills.map((skill, skillIndex) => (
                                <Chip 
                                  key={skillIndex}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                            {index < insights.opportunities.length - 1 && <Divider sx={{ mt: 2 }} />}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Recommendations */}
              <Grid item size={{xs:12}}>
                <Zoom in timeout={2200}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        AI Recommendations
                      </Typography>
                      <Grid container spacing={2}>
                        {insights?.recommendations?.map((rec, index) => (
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
                                  <Assessment />
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

export default AICareerInsights;
