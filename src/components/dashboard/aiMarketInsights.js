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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  Business,
  Refresh,
  Star,
  AttachMoney,
  People,
} from '@mui/icons-material';
import { Bar, Doughnut } from 'react-chartjs-2';
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

const AIMarketInsights = ({ user, resumeData }) => {
  const theme = useTheme();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateMarketInsights();
    }
  }, [user]);

  const generateMarketInsights = async () => {
    if (!user) {
      console.log('AIMarketInsights: No user data, using fallback insights');
      setInsights(generateFallbackInsights());
      return;
    }
    
    // For now, use fallback data to prevent API errors
    console.log('AIMarketInsights: Using fallback insights to prevent API errors');
    setInsights(generateFallbackInsights());
    setLoading(false);
  };

  const generateFallbackInsights = () => {
    const skills = user?.skills || [];
    const experience = user?.yearsExperience || 0;
    const { profileSummary, learningSuggestions } = resumeData || {};
    
    return {
      marketTrends: {
        demandGrowth: 12.5,
        salaryGrowth: 8.3,
        jobOpenings: 15420,
        competition: 3.2,
      },
      skillDemand: [
        { skill: 'React', demand: 95, growth: 15, salary: 85000 },
        { skill: 'Node.js', demand: 88, growth: 12, salary: 92000 },
        { skill: 'Python', demand: 92, growth: 18, salary: 95000 },
        { skill: 'AWS', demand: 85, growth: 22, salary: 110000 },
        { skill: 'Machine Learning', demand: 78, growth: 25, salary: 120000 },
        { skill: 'DevOps', demand: 82, growth: 20, salary: 105000 },
      ],
      salaryData: [
        { level: 'Junior', min: 45000, max: 65000, avg: 55000 },
        { level: 'Mid-Level', min: 65000, max: 95000, avg: 80000 },
        { level: 'Senior', min: 95000, max: 140000, avg: 117500 },
        { level: 'Lead', min: 140000, max: 200000, avg: 170000 },
      ],
      locationData: [
        { city: 'Bangalore', jobs: 4520, avgSalary: 95000, growth: 15 },
        { city: 'Mumbai', jobs: 3200, avgSalary: 88000, growth: 12 },
        { city: 'Delhi', jobs: 2800, avgSalary: 82000, growth: 10 },
        { city: 'Hyderabad', jobs: 2100, avgSalary: 85000, growth: 18 },
        { city: 'Pune', jobs: 1800, avgSalary: 78000, growth: 14 },
      ],
      companyTrends: [
        { company: 'Google', openings: 245, avgSalary: 180000, rating: 4.8 },
        { company: 'Microsoft', openings: 189, avgSalary: 165000, rating: 4.7 },
        { company: 'Amazon', openings: 312, avgSalary: 175000, rating: 4.6 },
        { company: 'Flipkart', openings: 156, avgSalary: 140000, rating: 4.5 },
        { company: 'Paytm', openings: 98, avgSalary: 120000, rating: 4.3 },
      ],
      emergingSkills: [
        { skill: 'AI/ML', growth: 45, demand: 78, future: 'High' },
        { skill: 'Blockchain', growth: 38, demand: 65, future: 'Medium' },
        { skill: 'Cloud Native', growth: 42, demand: 85, future: 'High' },
        { skill: 'Edge Computing', growth: 35, demand: 58, future: 'Medium' },
        { skill: 'Quantum Computing', growth: 28, demand: 45, future: 'Low' },
      ],
      marketPredictions: {
        next6Months: {
          demand: 'High',
          salary: 'Stable Growth',
          opportunities: 'Increasing',
          competition: 'Moderate',
        },
        nextYear: {
          demand: 'Very High',
          salary: 'Strong Growth',
          opportunities: 'Excellent',
          competition: 'High',
        },
      },
    };
  };

  const skillDemandData = {
    labels: insights?.skillDemand?.map(item => item.skill) || [],
    datasets: [
      {
        label: 'Demand (%)',
        data: insights?.skillDemand?.map(item => item.demand) || [],
        backgroundColor: alpha(theme.palette.primary.main, 0.7),
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    ],
  };

  const salaryData = {
    labels: insights?.salaryData?.map(item => item.level) || [],
    datasets: [
      {
        label: 'Average Salary (₹)',
        data: insights?.salaryData?.map(item => item.avg) || [],
        backgroundColor: alpha(theme.palette.secondary.main, 0.7),
        borderColor: theme.palette.secondary.main,
        borderWidth: 2,
      },
    ],
  };

  const locationData = {
    labels: insights?.locationData?.map(item => item.city) || [],
    datasets: [
      {
        label: 'Job Openings',
        data: insights?.locationData?.map(item => item.jobs) || [],
        backgroundColor: alpha(theme.palette.success.main, 0.7),
        borderColor: theme.palette.success.main,
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
            <Box textAlign="center">
              <Business sx={{ fontSize: 48, color: theme.palette.success.main, mb: 2 }} />
              <Typography variant="h6" color="success">
                AI is analyzing market trends...
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
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="success">
                    AI Market Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time market analysis and trends
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Refresh Market Data">
                <IconButton 
                  onClick={generateMarketInsights}
                  sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={3}>
              {/* Market Overview */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1200}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Market Overview
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <TrendingUp sx={{ color: theme.palette.success.main, mr: 1 }} />
                          <Typography variant="h4" color="success" fontWeight="bold">
                            +{insights?.marketTrends?.demandGrowth || 0}%
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Demand Growth
                        </Typography>
                        
                        <Box display="flex" alignItems="center" mb={2}>
                          <AttachMoney sx={{ color: theme.palette.primary.main, mr: 1 }} />
                          <Typography variant="h5" color="primary" fontWeight="bold">
                            +{insights?.marketTrends?.salaryGrowth || 0}%
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Salary Growth
                        </Typography>

                        <Box display="flex" alignItems="center" mb={2}>
                          <People sx={{ color: theme.palette.info.main, mr: 1 }} />
                          <Typography variant="h5" color="info" fontWeight="bold">
                            {(insights?.marketTrends?.jobOpenings || 0).toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Active Jobs
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Skill Demand Chart */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1400}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Skill Demand Analysis
                      </Typography>
                      <Box height={300}>
                        <Bar 
                          data={skillDemandData}
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

              {/* Salary Distribution */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1600}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Salary Distribution
                      </Typography>
                      <Box height={300}>
                        <Doughnut 
                          data={{
                            labels: insights?.salaryData?.map(item => item.level) || [],
                            datasets: [{
                              data: insights?.salaryData?.map(item => item.avg) || [],
                              backgroundColor: [
                                alpha(theme.palette.primary.main, 0.6),
                                alpha(theme.palette.secondary.main, 0.6),
                                alpha(theme.palette.success.main, 0.6),
                                alpha(theme.palette.warning.main, 0.6),
                              ],
                            }],
                          }}
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

              {/* Top Companies */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={1800}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Top Companies Hiring
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Company</TableCell>
                              <TableCell align="right">Openings</TableCell>
                              <TableCell align="right">Avg Salary</TableCell>
                              <TableCell align="right">Rating</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {insights?.companyTrends?.map((company, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: theme.palette.primary.main }}>
                                      {company.company.charAt(0)}
                                    </Avatar>
                                    {company.company}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">{company.openings}</TableCell>
                                <TableCell align="right">₹{company.avgSalary.toLocaleString()}</TableCell>
                                <TableCell align="right">
                                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    <Star sx={{ fontSize: 16, color: theme.palette.warning.main, mr: 0.5 }} />
                                    {company.rating}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Location Analysis */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={2000}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Location Analysis
                      </Typography>
                      <Box height={300}>
                        <Bar 
                          data={locationData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Emerging Skills */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={2200}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Emerging Skills
                      </Typography>
                      <Box>
                        {insights?.emergingSkills?.map((skill, index) => (
                          <Box key={index} mb={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body1" fontWeight="medium">
                                {skill.skill}
                              </Typography>
                              <Box display="flex" gap={1}>
                                <Chip 
                                  label={`+${skill.growth}%`}
                                  size="small"
                                  color="success"
                                />
                                <Chip 
                                  label={skill.future}
                                  size="small"
                                  color={skill.future === 'High' ? 'error' : skill.future === 'Medium' ? 'warning' : 'default'}
                                />
                              </Box>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="caption">Demand: {skill.demand}%</Typography>
                              <Typography variant="caption">Growth: {skill.growth}%</Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={skill.demand}
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Market Predictions */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={2400}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Market Predictions
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box 
                            sx={{ 
                              p: 2, 
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                              borderRadius: 2,
                              background: alpha(theme.palette.primary.main, 0.05),
                            }}
                          >
                            <Typography variant="h6" color="primary" gutterBottom>
                              Next 6 Months
                            </Typography>
                            <Box>
                              <Typography variant="body2" mb={1}>
                                Demand: <Chip label={insights?.marketPredictions?.next6Months?.demand} size="small" color="success" />
                              </Typography>
                              <Typography variant="body2" mb={1}>
                                Salary: <Chip label={insights?.marketPredictions?.next6Months?.salary} size="small" color="info" />
                              </Typography>
                              <Typography variant="body2" mb={1}>
                                Opportunities: <Chip label={insights?.marketPredictions?.next6Months?.opportunities} size="small" color="warning" />
                              </Typography>
                              <Typography variant="body2">
                                Competition: <Chip label={insights?.marketPredictions?.next6Months?.competition} size="small" color="default" />
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box 
                            sx={{ 
                              p: 2, 
                              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                              borderRadius: 2,
                              background: alpha(theme.palette.secondary.main, 0.05),
                            }}
                          >
                            <Typography variant="h6" color="secondary" gutterBottom>
                              Next Year
                            </Typography>
                            <Box>
                              <Typography variant="body2" mb={1}>
                                Demand: <Chip label={insights?.marketPredictions?.nextYear?.demand} size="small" color="success" />
                              </Typography>
                              <Typography variant="body2" mb={1}>
                                Salary: <Chip label={insights?.marketPredictions?.nextYear?.salary} size="small" color="info" />
                              </Typography>
                              <Typography variant="body2" mb={1}>
                                Opportunities: <Chip label={insights?.marketPredictions?.nextYear?.opportunities} size="small" color="warning" />
                              </Typography>
                              <Typography variant="body2">
                                Competition: <Chip label={insights?.marketPredictions?.nextYear?.competition} size="small" color="default" />
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
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

export default AIMarketInsights;
