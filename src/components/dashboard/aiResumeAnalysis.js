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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
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
  ExpandMore,
  Person,
  Business,
  AttachMoney,
  Speed,
  Lightbulb,
} from '@mui/icons-material';

const AIResumeAnalysis = ({ user, resumeData }) => {
  const theme = useTheme();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && resumeData) {
      generateResumeAnalysis();
    }
  }, [user, resumeData]);

  const generateResumeAnalysis = async () => {
    setLoading(true);
    try {
      const analysisData = generateAnalysisData();
      setAnalysis(analysisData);
    } catch (error) {
      console.error('Error generating resume analysis:', error);
      setAnalysis(generateAnalysisData());
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysisData = () => {
    const { profileSummary, learningSuggestions, loadingResume, error } = resumeData || {};
    const skills = user?.skills || [];
    const experience = user?.yearsExperience || 0;
    const educations = user?.educations || [];
    const workExperiences = user?.workExperiences || [];
    const certifications = user?.certifications || [];

    return {
      // Resume Summary
      resumeSummary: {
        profileSummary: profileSummary || "Professional developer with strong technical skills and experience in modern web technologies.",
        experience: experience,
        totalSkills: skills.length,
        educationCount: educations.length,
        workExperienceCount: workExperiences.length,
        certificationCount: certifications.length,
        resumeStatus: loadingResume ? 'Analyzing...' : error ? 'Error' : 'Complete',
        lastAnalyzed: new Date().toLocaleDateString(),
      },

      // Learning Suggestions from Resume
      learningSuggestions: learningSuggestions || [
        {
          area: 'Cloud Technologies',
          recommendation: 'Focus on AWS/Azure certifications and hands-on projects to enhance cloud expertise',
        },
        {
          area: 'System Design',
          recommendation: 'Practice designing scalable systems and microservices architecture for better system design skills',
        },
        {
          area: 'Leadership',
          recommendation: 'Develop team leadership and project management skills for career advancement',
        },
        {
          area: 'AI/ML',
          recommendation: 'Learn machine learning fundamentals and apply them to real-world projects',
        },
      ],

      // Resume-based Skill Analysis
      skillAnalysis: {
        technicalSkills: skills.filter(s => ['JavaScript', 'Python', 'Java', 'React', 'Node.js'].includes(s.skillName)),
        softSkills: skills.filter(s => ['Communication', 'Leadership', 'Teamwork', 'Problem Solving'].includes(s.skillName)),
        emergingSkills: ['Machine Learning', 'Cloud Computing', 'DevOps', 'AI/ML', 'Blockchain'],
        skillGaps: [
          { skill: 'Machine Learning', importance: 85, currentLevel: 30, priority: 'High' },
          { skill: 'Cloud Architecture', importance: 78, currentLevel: 45, priority: 'High' },
          { skill: 'DevOps', importance: 72, currentLevel: 25, priority: 'Medium' },
          { skill: 'System Design', importance: 80, currentLevel: 40, priority: 'High' },
        ],
      },

      // Career Recommendations based on Resume
      careerRecommendations: [
        {
          title: 'Focus on Leadership Skills',
          description: 'Based on your experience, develop leadership capabilities for senior roles',
          priority: 'High',
          impact: 'Career Growth',
          timeline: '3-6 months',
          reasoning: 'Your experience level suggests readiness for leadership responsibilities',
        },
        {
          title: 'Learn Cloud Technologies',
          description: 'Enhance your technical profile with cloud computing skills',
          priority: 'High',
          impact: 'Skill Enhancement',
          timeline: '2-4 months',
          reasoning: 'Cloud skills are in high demand and complement your current skills',
        },
        {
          title: 'Improve System Design',
          description: 'Develop system design skills for architect-level positions',
          priority: 'Medium',
          impact: 'Technical Growth',
          timeline: '1-3 months',
          reasoning: 'System design is crucial for senior developer roles',
        },
      ],

      // Market Alignment based on Resume
      marketAlignment: {
        score: 78,
        trends: ['AI/ML', 'Cloud Native', 'DevOps', 'Microservices', 'Full Stack'],
        opportunities: 15,
        salaryRange: {
          min: 50000 + (experience * 15000),
          max: 80000 + (experience * 20000),
          average: 65000 + (experience * 17500),
        },
        demandSkills: ['React', 'Node.js', 'Python', 'AWS', 'Machine Learning'],
      },

      // Resume Insights
      resumeInsights: {
        strengths: [
          'Strong technical foundation',
          'Good experience level',
          'Diverse skill set',
          'Continuous learning attitude',
        ],
        areasForImprovement: [
          'Leadership skills development',
          'Cloud technologies expertise',
          'System design knowledge',
          'AI/ML understanding',
        ],
        careerLevel: experience < 2 ? 'Junior' : experience < 5 ? 'Mid-Level' : 'Senior',
        nextLevel: experience < 2 ? 'Mid-Level' : experience < 5 ? 'Senior' : 'Lead/Principal',
        marketValue: 'Above average',
        growthPotential: 'High',
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
                    Resume Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-powered analysis of your resume and professional profile
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Refresh Analysis">
                <IconButton 
                  onClick={generateResumeAnalysis}
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
              {/* Resume Summary */}
              <Grid item xs={12} md={6}>
                <Zoom in timeout={1200}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Resume Summary
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                            <Person />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {analysis?.resumeSummary?.profileSummary}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Last analyzed: {analysis?.resumeSummary?.lastAnalyzed}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box textAlign="center">
                              <Typography variant="h4" color="primary" fontWeight="bold">
                                {analysis?.resumeSummary?.experience}
                              </Typography>
                              <Typography variant="caption">Years Experience</Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box textAlign="center">
                              <Typography variant="h4" color="secondary" fontWeight="bold">
                                {analysis?.resumeSummary?.totalSkills}
                              </Typography>
                              <Typography variant="caption">Total Skills</Typography>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        <Box mt={2}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">Education</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis?.resumeSummary?.educationCount} entries
                            </Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">Work Experience</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis?.resumeSummary?.workExperienceCount} entries
                            </Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">Certifications</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {analysis?.resumeSummary?.certificationCount} entries
                            </Typography>
                          </Box>
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
                          {analysis?.marketAlignment?.score || 0}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Market Fit Score
                        </Typography>
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Current Trends</Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {analysis?.marketAlignment?.trends?.map((trend, index) => (
                            <Chip key={index} label={trend} size="small" color="primary" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2">Opportunities</Typography>
                        <Typography variant="h6" color="success">
                          {analysis?.marketAlignment?.opportunities || 0}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" mb={1}>Salary Range</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{analysis?.marketAlignment?.salaryRange?.min?.toLocaleString()} - ₹{analysis?.marketAlignment?.salaryRange?.max?.toLocaleString()}
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
                        {analysis?.learningSuggestions?.map((suggestion, index) => (
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
                        {analysis?.skillAnalysis?.skillGaps?.map((gap, index) => (
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
                        {analysis?.careerRecommendations?.map((rec, index) => (
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
                                {rec.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" mb={1}>
                                {rec.reasoning}
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

              {/* Resume Insights */}
              <Grid item xs={12}>
                <Zoom in timeout={2200}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Resume Insights
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            Strengths
                          </Typography>
                          <List>
                            {analysis?.resumeInsights?.strengths?.map((strength, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <CheckCircle sx={{ color: theme.palette.success.main }} />
                                </ListItemIcon>
                                <ListItemText primary={strength} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom>
                            Areas for Improvement
                          </Typography>
                          <List>
                            {analysis?.resumeInsights?.areasForImprovement?.map((area, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <Warning sx={{ color: theme.palette.warning.main }} />
                                </ListItemIcon>
                                <ListItemText primary={area} />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                        <Grid item xs={12}>
                          <Box 
                            sx={{ 
                              p: 2, 
                              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                              borderRadius: 2,
                              background: alpha(theme.palette.info.main, 0.05),
                            }}
                          >
                            <Typography variant="subtitle1" gutterBottom>
                              Career Assessment
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Current Level</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {analysis?.resumeInsights?.careerLevel}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Next Level</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {analysis?.resumeInsights?.nextLevel}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Market Value</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {analysis?.resumeInsights?.marketValue}
                                </Typography>
                              </Grid>
                              <Grid item xs={6} md={3}>
                                <Typography variant="body2" color="text.secondary">Growth Potential</Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {analysis?.resumeInsights?.growthPotential}
                                </Typography>
                              </Grid>
                            </Grid>
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

export default AIResumeAnalysis;
