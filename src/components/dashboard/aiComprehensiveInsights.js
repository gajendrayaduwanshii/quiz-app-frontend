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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Work,
  School,
  Assessment,
  Refresh,
  Star,
  CheckCircle,
  Warning,
  Error,
  Timeline,
  Business,
  Speed,
  AttachMoney,
  People,
  LocationOn,
} from '@mui/icons-material';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
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
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const AIComprehensiveInsights = ({ user, resumeData }) => {
  const theme = useTheme();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateComprehensiveInsights();
    }
  }, [user, resumeData]);

  const generateComprehensiveInsights = async () => {
    setLoading(true);
    try {
      // Combine user data and resume analysis
      const combinedInsights = generateCombinedInsights();
      setInsights(combinedInsights);
    } catch (error) {
      console.error('Error generating comprehensive insights:', error);
      setInsights(generateCombinedInsights());
    } finally {
      setLoading(false);
    }
  };

  const generateCombinedInsights = () => {
    const skills = user?.skills || [];
    const experience = user?.yearsExperience || 0;
    const quizResults = user?.quizResult || [];
    const educations = user?.educations || [];
    const workExperiences = user?.workExperiences || [];
    const { profileSummary, learningSuggestions } = resumeData || {};

    // Calculate skill distribution
    const skillDistribution = {
      beginner: skills.filter(s => (s.yearsExperience || 0) < 2).length,
      intermediate: skills.filter(s => (s.yearsExperience || 0) >= 2 && (s.yearsExperience || 0) < 5).length,
      advanced: skills.filter(s => (s.yearsExperience || 0) >= 5).length,
    };

    // Calculate performance metrics
    const averageQuizScore = quizResults.length > 0 
      ? Math.round(quizResults.reduce((sum, quiz) => {
          const correct = quiz.quizQuestion?.filter(q => q.answer === q.correctAnswer).length || 0;
          const total = quiz.quizQuestion?.length || 1;
          return sum + (correct / total) * 100;
        }, 0) / quizResults.length)
      : 0;

    // Generate career insights based on combined data
    const careerLevel = experience < 2 ? 'Junior' : experience < 5 ? 'Mid-Level' : 'Senior';
    const nextLevel = experience < 2 ? 'Mid-Level' : experience < 5 ? 'Senior' : 'Lead/Principal';

    return {
      // Profile Overview
      profileOverview: {
        summary: profileSummary || `Experienced ${careerLevel} developer with ${experience} years of experience`,
        experience: experience,
        careerLevel: careerLevel,
        nextLevel: nextLevel,
        totalSkills: skills.length,
        completedQuizzes: quizResults.length,
        averageScore: averageQuizScore,
      },

      // Skill Analysis
      skillAnalysis: {
        distribution: skillDistribution,
        topSkills: skills
          .sort((a, b) => (b.yearsExperience || 0) - (a.yearsExperience || 0))
          .slice(0, 5)
          .map(skill => ({
            name: skill.skillName,
            experience: skill.yearsExperience || 0,
            level: skill.level || 'Intermediate',
            trend: Math.random() > 0.5 ? 'up' : 'stable',
          })),
        skillGaps: [
          { skill: 'Machine Learning', importance: 85, currentLevel: 30, priority: 'High' },
          { skill: 'Cloud Architecture', importance: 78, currentLevel: 45, priority: 'High' },
          { skill: 'DevOps', importance: 72, currentLevel: 25, priority: 'Medium' },
          { skill: 'System Design', importance: 80, currentLevel: 40, priority: 'High' },
        ],
      },

      // Performance Metrics
      performanceMetrics: {
        overallScore: Math.min(95, 60 + (experience * 5) + (averageQuizScore * 0.3)),
        technical: Math.min(95, 70 + (experience * 4)),
        problemSolving: Math.min(95, 75 + (averageQuizScore * 0.2)),
        communication: Math.min(95, 80 + (experience * 2)),
        leadership: Math.min(95, 50 + (experience * 3)),
        innovation: Math.min(95, 65 + (experience * 3)),
        learningVelocity: Math.min(10, 5 + (quizResults.length * 0.5)),
        consistency: Math.min(100, 70 + (averageQuizScore * 0.3)),
      },

      // Market Insights
      marketInsights: {
        demandGrowth: 12.5,
        salaryGrowth: 8.3,
        jobOpenings: 15420,
        competition: 3.2,
        skillDemand: [
          { skill: 'React', demand: 95, growth: 15, salary: 85000 },
          { skill: 'Node.js', demand: 88, growth: 12, salary: 92000 },
          { skill: 'Python', demand: 92, growth: 18, salary: 95000 },
          { skill: 'AWS', demand: 85, growth: 22, salary: 110000 },
          { skill: 'Machine Learning', demand: 78, growth: 25, salary: 120000 },
        ],
        salaryProjection: {
          current: 50000 + (experience * 15000),
          projected: 50000 + (experience * 15000) * 1.15,
          market: 50000 + (experience * 12000),
          growth: 15.2,
        },
      },

      // Career Trajectory
      careerTrajectory: {
        current: `${careerLevel} Developer`,
        next: `${nextLevel} Developer`,
        future: experience < 5 ? 'Tech Lead' : 'Engineering Manager',
        timeline: experience < 2 ? '6-12 months' : experience < 5 ? '12-18 months' : '18-24 months',
        confidence: Math.min(95, 70 + (experience * 5) + (averageQuizScore * 0.2)),
        milestones: [
          { title: 'Complete Advanced Certification', timeline: '3-6 months', priority: 'High' },
          { title: 'Lead a Technical Project', timeline: '6-12 months', priority: 'High' },
          { title: 'Mentor Junior Developers', timeline: '9-15 months', priority: 'Medium' },
        ],
      },

      // Learning Recommendations
      learningRecommendations: {
        personalizedPath: {
          title: `${careerLevel} to ${nextLevel} Development Path`,
          description: `Comprehensive learning path tailored to your ${experience} years of experience and current skills`,
          duration: experience < 2 ? '6-8 months' : experience < 5 ? '4-6 months' : '3-4 months',
          difficulty: experience < 2 ? 'Intermediate' : experience < 5 ? 'Advanced' : 'Expert',
          progress: Math.min(100, 20 + (experience * 10) + (quizResults.length * 2)),
        },
        courses: [
          {
            id: 1,
            title: experience < 2 ? 'Advanced React Patterns' : 'System Design Mastery',
            provider: 'Coursera',
            rating: 4.8,
            duration: '4 weeks',
            difficulty: experience < 2 ? 'Intermediate' : 'Advanced',
            type: 'video',
            price: 'Free',
            skills: experience < 2 ? ['React', 'Hooks', 'Performance'] : ['System Design', 'Scalability', 'Architecture'],
            description: experience < 2 ? 'Master advanced React patterns' : 'Learn to design large-scale systems',
            recommended: true,
          },
          {
            id: 2,
            title: experience < 2 ? 'Node.js Backend Development' : 'Cloud Architecture',
            provider: 'Udemy',
            rating: 4.7,
            duration: '6 weeks',
            difficulty: experience < 2 ? 'Intermediate' : 'Advanced',
            type: 'hands-on',
            price: '₹2,999',
            skills: experience < 2 ? ['Node.js', 'Express', 'MongoDB'] : ['AWS', 'Microservices', 'DevOps'],
            description: experience < 2 ? 'Build scalable backend applications' : 'Design cloud-native applications',
            recommended: true,
          },
        ],
        skillGaps: [
          {
            skill: 'Machine Learning',
            importance: 85,
            currentLevel: 30,
            targetLevel: 80,
            courses: ['ML Fundamentals', 'Python for ML', 'Deep Learning'],
          },
          {
            skill: 'Cloud Architecture',
            importance: 78,
            currentLevel: 45,
            targetLevel: 85,
            courses: ['AWS Solutions', 'Microservices', 'Containerization'],
          },
        ],
      },

      // Opportunities
      opportunities: [
        {
          title: `${careerLevel} Full Stack Developer`,
          company: 'Tech Corp',
          match: Math.min(100, 85 + (averageQuizScore * 0.1)),
          salary: `₹${Math.round(50000 + (experience * 15000))}-${Math.round(80000 + (experience * 20000))} LPA`,
          skills: ['React', 'Node.js', 'AWS'],
          location: 'Bangalore',
          type: 'Full-time',
        },
        {
          title: `${nextLevel} Developer`,
          company: 'StartupXYZ',
          match: Math.min(100, 80 + (averageQuizScore * 0.1)),
          salary: `₹${Math.round(70000 + (experience * 20000))}-${Math.round(120000 + (experience * 25000))} LPA`,
          skills: ['Leadership', 'Architecture', 'Mentoring'],
          location: 'Mumbai',
          type: 'Full-time',
        },
        {
          title: 'Principal Engineer',
          company: 'BigTech Inc',
          match: Math.min(100, 75 + (averageQuizScore * 0.1)),
          salary: `₹${Math.round(150000 + (experience * 30000))}-${Math.round(250000 + (experience * 40000))} LPA`,
          skills: ['System Design', 'Scalability', 'Innovation'],
          location: 'Hyderabad',
          type: 'Full-time',
        },
      ],

      // Achievements
      achievements: [
        { title: 'Quiz Master', description: `Scored ${averageQuizScore}%+ in quizzes`, earned: averageQuizScore > 80, date: '2024-06-15' },
        { title: 'Skill Builder', description: `Mastered ${skills.length} skills`, earned: skills.length > 5, date: '2024-06-10' },
        { title: 'Learning Streak', description: `${quizResults.length} completed quizzes`, earned: quizResults.length > 3, date: '2024-06-20' },
        { title: 'Expert Level', description: 'Reach expert level in 5 skills', earned: false, date: null },
      ],
    };
  };

  // Chart data
  const skillDistributionData = {
    labels: ['Beginner', 'Intermediate', 'Advanced'],
    datasets: [
      {
        data: [
          insights?.skillAnalysis?.distribution?.beginner || 0,
          insights?.skillAnalysis?.distribution?.intermediate || 0,
          insights?.skillAnalysis?.distribution?.advanced || 0,
        ],
        backgroundColor: [
          alpha(theme.palette.success.main, 0.6),
          alpha(theme.palette.warning.main, 0.6),
          alpha(theme.palette.error.main, 0.6),
        ],
        borderWidth: 2,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const performanceData = {
    labels: ['Technical', 'Problem Solving', 'Communication', 'Leadership', 'Innovation'],
    datasets: [
      {
        label: 'Current Performance',
        data: [
          insights?.performanceMetrics?.technical || 0,
          insights?.performanceMetrics?.problemSolving || 0,
          insights?.performanceMetrics?.communication || 0,
          insights?.performanceMetrics?.leadership || 0,
          insights?.performanceMetrics?.innovation || 0,
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

  if (loading) {
    return (
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
            <Box textAlign="center">
              <Psychology sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" color="primary">
                AI is analyzing your comprehensive profile...
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
                    AI Comprehensive Insights
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Combined analysis of your profile and resume data
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Refresh Insights">
                <IconButton 
                  onClick={generateComprehensiveInsights}
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            <Grid container spacing={3}>
              {/* Profile Overview */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1200}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Profile Overview
                      </Typography>
                      <Box textAlign="center" mb={3}>
                        <Avatar sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: theme.palette.primary.main,
                          mx: 'auto',
                          mb: 2
                        }}>
                          <Work />
                        </Avatar>
                        <Typography variant="h6" color="primary">
                          {insights?.profileOverview?.careerLevel} Developer
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {insights?.profileOverview?.experience} years experience
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Total Skills</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {insights?.profileOverview?.totalSkills}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Completed Quizzes</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {insights?.profileOverview?.completedQuizzes}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">Average Score</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {insights?.profileOverview?.averageScore}%
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {insights?.profileOverview?.summary}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Performance Metrics */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1400}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Performance Metrics
                      </Typography>
                      <Box textAlign="center" mb={3}>
                        <Typography variant="h2" color="primary" fontWeight="bold">
                          {Math.round(insights?.performanceMetrics?.overallScore || 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Overall Score
                        </Typography>
                      </Box>
                      
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Technical</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {Math.round(insights?.performanceMetrics?.technical || 0)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={insights?.performanceMetrics?.technical || 0}
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                      
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Problem Solving</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {Math.round(insights?.performanceMetrics?.problemSolving || 0)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={insights?.performanceMetrics?.problemSolving || 0}
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                      
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Leadership</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {Math.round(insights?.performanceMetrics?.leadership || 0)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={insights?.performanceMetrics?.leadership || 0}
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Career Trajectory */}
              <Grid item size={{xs:12, md:4}}>
                <Zoom in timeout={1600}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Career Trajectory
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                            <Work />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {insights?.careerTrajectory?.current}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Current Position
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                            <TrendingUp />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {insights?.careerTrajectory?.next}
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
                              {insights?.careerTrajectory?.future}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Future Goal
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Timeline: {insights?.careerTrajectory?.timeline}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={insights?.careerTrajectory?.confidence || 0}
                            sx={{ borderRadius: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary" mt={1}>
                            Confidence: {Math.round(insights?.careerTrajectory?.confidence || 0)}%
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Skill Distribution Chart */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={1800}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Skill Distribution
                      </Typography>
                      <Box height={300}>
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

              {/* Performance Radar */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={2000}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Performance Analysis
                      </Typography>
                      <Box height={300}>
                        <Radar 
                          data={performanceData}
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

              {/* Market Insights */}
                        <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={2200}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Market Insights
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <TrendingUp sx={{ color: theme.palette.success.main, mr: 1 }} />
                          <Typography variant="h4" color="success" fontWeight="bold">
                            +{insights?.marketInsights?.demandGrowth || 0}%
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Demand Growth
                        </Typography>
                        
                        <Box display="flex" alignItems="center" mb={2}>
                          <AttachMoney sx={{ color: theme.palette.primary.main, mr: 1 }} />
                          <Typography variant="h5" color="primary" fontWeight="bold">
                            +{insights?.marketInsights?.salaryGrowth || 0}%
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Salary Growth
                        </Typography>

                        <Box display="flex" alignItems="center" mb={2}>
                          <People sx={{ color: theme.palette.info.main, mr: 1 }} />
                          <Typography variant="h5" color="info" fontWeight="bold">
                            {(insights?.marketInsights?.jobOpenings || 0).toLocaleString()}
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

              {/* Salary Projection */}
              <Grid item size={{xs:12, md:6}}>
                <Zoom in timeout={2400}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Salary Projection
                      </Typography>
                      <Box textAlign="center">
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          ₹{insights?.marketInsights?.salaryProjection?.current?.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Current Salary
                        </Typography>
                        
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Projected:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ₹{insights?.marketInsights?.salaryProjection?.projected?.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Market Avg:</Typography>
                          <Typography variant="body2" fontWeight="medium">
                            ₹{insights?.marketInsights?.salaryProjection?.market?.toLocaleString()}
                          </Typography>
                        </Box>
                        
                        <Chip 
                          label={`+${insights?.marketInsights?.salaryProjection?.growth || 0}% Growth`}
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Job Opportunities */}
              <Grid item size={{xs:12}}>
                <Zoom in timeout={2600}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recommended Opportunities
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Position</TableCell>
                              <TableCell>Company</TableCell>
                              <TableCell align="right">Match</TableCell>
                              <TableCell align="right">Salary</TableCell>
                              <TableCell>Location</TableCell>
                              <TableCell>Type</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {insights?.opportunities?.map((job, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Typography variant="body1" fontWeight="medium">
                                    {job.title}
                                  </Typography>
                                </TableCell>
                                <TableCell>{job.company}</TableCell>
                                <TableCell align="right">
                                  <Chip 
                                    label={`${Math.round(job.match)}%`}
                                    color={job.match > 85 ? 'success' : job.match > 70 ? 'warning' : 'default'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell align="right">{job.salary}</TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                                    {job.location}
                                  </Box>
                                </TableCell>
                                <TableCell>{job.type}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Achievements */}
              <Grid item size={{xs:12}}>
                <Zoom in timeout={2800}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Achievements & Milestones
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item size={{xs:12, md:6}}>
                          <Typography variant="subtitle1" gutterBottom>
                            Recent Achievements
                          </Typography>
                          <List>
                            {insights?.achievements?.filter(a => a.earned).map((achievement, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Star sx={{ color: theme.palette.warning.main }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={achievement.title}
                                  secondary={achievement.description}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        <Grid item size={{xs:12, md:6}}>
                          <Typography variant="subtitle1" gutterBottom>
                            Career Milestones
                          </Typography>
                          <List>
                            {insights?.careerTrajectory?.milestones?.map((milestone, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Timeline sx={{ color: theme.palette.primary.main }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={milestone.title}
                                  secondary={`${milestone.timeline} • Priority: ${milestone.priority}`}
                                />
                              </ListItem>
                            ))}
                          </List>
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

export default AIComprehensiveInsights;
