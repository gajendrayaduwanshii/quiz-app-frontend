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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  School,
  VideoLibrary,
  Book,
  Code,
  Psychology,
  TrendingUp,
  Star,
  Schedule,
  CheckCircle,
  PlayArrow,
  Refresh,
} from '@mui/icons-material';

const AILearningRecommendations = ({ user }) => {
  const theme = useTheme();
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      generateLearningRecommendations();
    }
  }, [user]);

  const generateLearningRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/learning-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error generating learning recommendations:', error);
      setRecommendations(generateFallbackRecommendations());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackRecommendations = () => {
    const skills = user?.skills || [];
    const experience = user?.yearsExperience || 0;
    
    return {
      personalizedPath: {
        title: 'Full Stack Development Mastery',
        description: 'Comprehensive path tailored to your current skills and career goals',
        duration: '6-8 months',
        difficulty: 'Intermediate',
        progress: 35,
        skills: ['React', 'Node.js', 'Database Design', 'Cloud Architecture'],
      },
      courses: [
        {
          id: 1,
          title: 'Advanced React Patterns',
          provider: 'Coursera',
          rating: 4.8,
          duration: '4 weeks',
          difficulty: 'Intermediate',
          type: 'video',
          price: 'Free',
          skills: ['React', 'Hooks', 'Performance'],
          description: 'Master advanced React patterns and optimization techniques',
          progress: 0,
          recommended: true,
        },
        {
          id: 2,
          title: 'Node.js Backend Development',
          provider: 'Udemy',
          rating: 4.7,
          duration: '6 weeks',
          difficulty: 'Intermediate',
          type: 'video',
          price: '₹2,999',
          skills: ['Node.js', 'Express', 'MongoDB'],
          description: 'Build scalable backend applications with Node.js',
          progress: 0,
          recommended: true,
        },
        {
          id: 3,
          title: 'AWS Cloud Architecture',
          provider: 'AWS Training',
          rating: 4.9,
          duration: '8 weeks',
          difficulty: 'Advanced',
          type: 'hands-on',
          price: '₹5,999',
          skills: ['AWS', 'Cloud', 'DevOps'],
          description: 'Design and deploy cloud-native applications',
          progress: 0,
          recommended: false,
        },
        {
          id: 4,
          title: 'System Design Fundamentals',
          provider: 'Educative',
          rating: 4.6,
          duration: '10 weeks',
          difficulty: 'Advanced',
          type: 'interactive',
          price: '₹3,999',
          skills: ['System Design', 'Scalability', 'Architecture'],
          description: 'Learn to design large-scale distributed systems',
          progress: 0,
          recommended: true,
        },
      ],
      skillGaps: [
        {
          skill: 'Machine Learning',
          importance: 85,
          currentLevel: 25,
          targetLevel: 80,
          courses: ['ML Fundamentals', 'Python for ML', 'Deep Learning'],
        },
        {
          skill: 'Cloud Architecture',
          importance: 78,
          currentLevel: 40,
          targetLevel: 85,
          courses: ['AWS Solutions', 'Microservices', 'Containerization'],
        },
        {
          skill: 'DevOps',
          importance: 72,
          currentLevel: 30,
          targetLevel: 75,
          courses: ['Docker', 'Kubernetes', 'CI/CD'],
        },
      ],
      learningStreak: {
        current: 7,
        longest: 21,
        totalHours: 45,
        weeklyGoal: 10,
      },
      achievements: [
        { title: 'First Course Completed', icon: '🎓', earned: true },
        { title: '7-Day Streak', icon: '🔥', earned: true },
        { title: 'Skill Master', icon: '⭐', earned: false },
        { title: 'Learning Champion', icon: '🏆', earned: false },
      ],
    };
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return theme.palette.success.main;
      case 'intermediate': return theme.palette.warning.main;
      case 'advanced': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <VideoLibrary />;
      case 'hands-on': return <Code />;
      case 'interactive': return <Psychology />;
      default: return <Book />;
    }
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)` }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
            <Box textAlign="center">
              <School sx={{ fontSize: 48, color: theme.palette.info.main, mb: 2 }} />
              <Typography variant="h6" color="info">
                AI is curating your learning path...
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
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="info">
                    AI Learning Recommendations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personalized learning path powered by AI
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Refresh Recommendations">
                <IconButton 
                  onClick={generateLearningRecommendations}
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
              {/* Learning Path Overview */}
              <Grid item xs={12} md={6}>
                <Zoom in timeout={1200}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Your Learning Path
                      </Typography>
                      <Box>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                            <TrendingUp />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {recommendations?.personalizedPath?.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {recommendations?.personalizedPath?.description}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box mb={2}>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">Progress</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {recommendations?.personalizedPath?.progress || 0}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={recommendations?.personalizedPath?.progress || 0}
                            sx={{ borderRadius: 1, height: 8 }}
                          />
                        </Box>

                        <Box display="flex" gap={1} mb={2}>
                          <Chip 
                            label={recommendations?.personalizedPath?.duration}
                            size="small"
                            icon={<Schedule />}
                          />
                          <Chip 
                            label={recommendations?.personalizedPath?.difficulty}
                            size="small"
                            sx={{ color: getDifficultyColor(recommendations?.personalizedPath?.difficulty) }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" mb={1}>
                          Key Skills:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {recommendations?.personalizedPath?.skills?.map((skill, index) => (
                            <Chip key={index} label={skill} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Learning Streak */}
              <Grid item xs={12} md={6}>
                <Zoom in timeout={1400}>
                  <Card sx={{ height: '100%', background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Learning Streak
                      </Typography>
                      <Box textAlign="center">
                        <Typography variant="h2" color="primary" fontWeight="bold">
                          {recommendations?.learningStreak?.current || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          Day Streak
                        </Typography>
                        
                        <Box display="flex" justifyContent="space-around" mb={2}>
                          <Box textAlign="center">
                            <Typography variant="h6" color="secondary">
                              {recommendations?.learningStreak?.longest || 0}
                            </Typography>
                            <Typography variant="caption">Longest</Typography>
                          </Box>
                          <Box textAlign="center">
                            <Typography variant="h6" color="info">
                              {recommendations?.learningStreak?.totalHours || 0}h
                            </Typography>
                            <Typography variant="caption">Total Hours</Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">Weekly Goal</Typography>
                            <Typography variant="body2">
                              {recommendations?.learningStreak?.weeklyGoal || 0}h
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={75}
                            sx={{ borderRadius: 1 }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Recommended Courses */}
              <Grid item xs={12}>
                <Zoom in timeout={1600}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Recommended Courses
                      </Typography>
                      <Grid container spacing={2}>
                        {recommendations?.courses?.map((course) => (
                          <Grid item xs={12} md={6} lg={3} key={course.id}>
                            <Card 
                              sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: theme.shadows[8],
                                },
                                border: course.recommended ? `2px solid ${theme.palette.primary.main}` : 'none',
                              }}
                              onClick={() => handleCourseClick(course)}
                            >
                              <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                  <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                                    {getTypeIcon(course.type)}
                                  </Avatar>
                                  <Box flex={1}>
                                    <Typography variant="h6" fontWeight="bold">
                                      {course.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {course.provider}
                                    </Typography>
                                  </Box>
                                  {course.recommended && (
                                    <Chip label="Recommended" color="primary" size="small" />
                                  )}
                                </Box>

                                <Typography variant="body2" color="text.secondary" mb={2}>
                                  {course.description}
                                </Typography>

                                <Box display="flex" alignItems="center" mb={2}>
                                  <Star sx={{ fontSize: 16, color: theme.palette.warning.main, mr: 0.5 }} />
                                  <Typography variant="body2" mr={2}>
                                    {course.rating}
                                  </Typography>
                                  <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                                  <Typography variant="body2" mr={2}>
                                    {course.duration}
                                  </Typography>
                                  <Chip 
                                    label={course.difficulty}
                                    size="small"
                                    sx={{ 
                                      color: getDifficultyColor(course.difficulty),
                                      borderColor: getDifficultyColor(course.difficulty),
                                    }}
                                    variant="outlined"
                                  />
                                </Box>

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Typography variant="h6" color="primary">
                                    {course.price}
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<PlayArrow />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCourseClick(course);
                                    }}
                                  >
                                    Start
                                  </Button>
                                </Box>

                                <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                                  {course.skills.map((skill, index) => (
                                    <Chip key={index} label={skill} size="small" variant="outlined" />
                                  ))}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
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
                        {recommendations?.skillGaps?.map((gap, index) => (
                          <Box key={index} mb={3}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body1" fontWeight="medium">
                                {gap.skill}
                              </Typography>
                              <Chip 
                                label={`${gap.importance}% Important`}
                                size="small"
                                color="error"
                              />
                            </Box>
                            
                            <Box mb={1}>
                              <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="caption">Current: {gap.currentLevel}%</Typography>
                                <Typography variant="caption">Target: {gap.targetLevel}%</Typography>
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

                            <Typography variant="caption" color="text.secondary">
                              Recommended: {gap.courses.join(', ')}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Achievements */}
              <Grid item xs={12} md={6}>
                <Zoom in timeout={2000}>
                  <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Achievements
                      </Typography>
                      <Grid container spacing={2}>
                        {recommendations?.achievements?.map((achievement, index) => (
                          <Grid item xs={6} key={index}>
                            <Box 
                              sx={{ 
                                p: 2, 
                                textAlign: 'center',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                borderRadius: 2,
                                background: achievement.earned 
                                  ? alpha(theme.palette.success.main, 0.1)
                                  : alpha(theme.palette.grey[500], 0.1),
                                opacity: achievement.earned ? 1 : 0.6,
                              }}
                            >
                              <Typography variant="h4" mb={1}>
                                {achievement.icon}
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {achievement.title}
                              </Typography>
                              {achievement.earned && (
                                <CheckCircle 
                                  sx={{ 
                                    color: theme.palette.success.main, 
                                    fontSize: 16, 
                                    mt: 1 
                                  }} 
                                />
                              )}
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

        {/* Course Detail Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedCourse?.title}
          </DialogTitle>
          <DialogContent>
            {selectedCourse && (
              <Box>
                <Typography variant="body1" paragraph>
                  {selectedCourse.description}
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    Course Details
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Chip label={`Rating: ${selectedCourse.rating}`} />
                    <Chip label={`Duration: ${selectedCourse.duration}`} />
                    <Chip label={`Difficulty: ${selectedCourse.difficulty}`} />
                    <Chip label={`Price: ${selectedCourse.price}`} />
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    Skills You'll Learn
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {selectedCourse.skills.map((skill, index) => (
                      <Chip key={index} label={skill} color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="contained" startIcon={<PlayArrow />}>
              Start Course
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default AILearningRecommendations;
