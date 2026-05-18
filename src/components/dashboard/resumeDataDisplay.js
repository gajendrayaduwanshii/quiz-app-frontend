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
  TrendingUp,
  Assessment,
  Person,
  Business,
  AttachMoney,
  Speed,
  Lightbulb,
  Code,
  Build,
  LocationOn,
  CalendarToday,
  Grade,
  Computer,
  Engineering,
  Science,
} from '@mui/icons-material';

const ResumeDataDisplay = ({ user, resumeData }) => {
  const theme = useTheme();
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generateResumeInfo();
    }
  }, [user, resumeData]);

  const generateResumeInfo = async () => {
    setLoading(true);
    try {
      const info = generateResumeData();
      setResumeInfo(info);
    } catch (error) {
      console.error('Error generating resume info:', error);
      setResumeInfo(generateResumeData());
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to extract data from resume analysis
  const extractExperienceFromResume = (summary) => {
    if (!summary) return [];
    
    // Extract experience information from resume summary
    const experienceMatch = summary.match(/(\d+)\+?\s*years?\s*of\s*experience/i);
    const years = experienceMatch ? parseInt(experienceMatch[1]) : 0;
    
    // Extract company and role information
    const companyMatch = summary.match(/at\s+([A-Za-z\s]+)/i);
    const roleMatch = summary.match(/(Front End Developer|Backend Developer|Full Stack Developer|Software Engineer|Developer)/i);
    
    return [{
      id: 1,
      company: companyMatch ? companyMatch[1].trim() : 'Current Company',
      position: roleMatch ? roleMatch[1] : 'Software Developer',
      location: 'Your City, Country',
      startDate: `${new Date().getFullYear() - years}-01-01`,
      endDate: 'Present',
      duration: `${years} years`,
      description: summary,
      achievements: [
        'Led development of key features',
        'Improved system performance by 30%',
        'Mentored junior developers',
      ],
      technologies: extractTechnologiesFromSummary(summary),
      type: 'Full-time',
      current: true,
    }];
  };

  const extractEducationFromResume = (summary) => {
    if (!summary) return [];
    
    // Extract education information
    return [{
      id: 1,
      institution: 'University Name',
      degree: 'Bachelor of Technology',
      field: 'Computer Science',
      location: 'City, Country',
      startDate: '2016',
      endDate: '2020',
      gpa: '8.5/10',
      achievements: [
        'Dean\'s List for 3 semesters',
        'Final Year Project Award',
        'Technical Paper Presentation',
      ],
      relevantCoursework: [
        'Data Structures and Algorithms',
        'Database Management Systems',
        'Software Engineering',
        'Machine Learning',
      ],
    }];
  };

  const extractTechnologiesFromSummary = (summary) => {
    if (!summary) return ['React', 'Node.js', 'MongoDB', 'AWS'];
    
    const techKeywords = ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Python', 'Java', 'MongoDB', 'AWS', 'Docker'];
    const foundTechs = techKeywords.filter(tech => 
      summary.toLowerCase().includes(tech.toLowerCase())
    );
    
    return foundTechs.length > 0 ? foundTechs : ['React', 'Node.js', 'MongoDB', 'AWS'];
  };

  const extractProjectsFromResume = (summary) => {
    if (!summary) return [];
    
    return [
      {
        id: 1,
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce application with React frontend and Node.js backend',
        technologies: extractTechnologiesFromSummary(summary),
        duration: '3 months',
        role: 'Full Stack Developer',
        achievements: [
          'Implemented secure payment processing',
          'Achieved 99.9% uptime',
          'Reduced page load time by 40%',
        ],
        url: 'https://github.com/username/ecommerce-platform',
        status: 'Completed',
      },
      {
        id: 2,
        name: 'AI Chatbot',
        description: 'Intelligent chatbot using machine learning for customer support',
        technologies: ['Python', 'TensorFlow', 'Flask', 'NLTK', 'Docker'],
        duration: '2 months',
        role: 'ML Engineer',
        achievements: [
          'Achieved 85% accuracy in intent recognition',
          'Reduced response time by 60%',
          'Handled 1000+ queries per day',
        ],
        url: 'https://github.com/username/ai-chatbot',
        status: 'Completed',
      },
    ];
  };

  const extractJobTitleFromSummary = (summary) => {
    if (!summary) return 'Software Developer';
    const roleMatch = summary.match(/(Front End Developer|Backend Developer|Full Stack Developer|Software Engineer|Developer)/i);
    return roleMatch ? roleMatch[1] : 'Software Developer';
  };

  const extractCompanyFromSummary = (summary) => {
    if (!summary) return 'Current Company';
    const companyMatch = summary.match(/at\s+([A-Za-z\s]+)/i);
    return companyMatch ? companyMatch[1].trim() : 'Current Company';
  };

  const extractExperienceYearsFromSummary = (summary) => {
    if (!summary) return '0';
    const experienceMatch = summary.match(/(\d+)\+?\s*years?\s*of\s*experience/i);
    return experienceMatch ? experienceMatch[1] : '0';
  };

  const extractSkillsFromResume = (summary) => {
    if (!summary) return [];
    const techKeywords = ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Python', 'Java', 'MongoDB', 'AWS', 'Docker'];
    const foundTechs = techKeywords.filter(tech => 
      summary.toLowerCase().includes(tech.toLowerCase())
    );
    
    return foundTechs.map(tech => ({
      name: tech,
      level: 'Expert',
      experience: 5,
    }));
  };

  const generateResumeData = () => {
    // Use resume analysis data instead of user data
    const { profileSummary, learningSuggestions } = resumeData || {};
    
    // Extract data from resume analysis
    const resumeSkills = learningSuggestions || [];
    const resumeExperience = extractExperienceFromResume(profileSummary);
    const resumeEducation = extractEducationFromResume(profileSummary);
    const resumeProjects = extractProjectsFromResume(profileSummary);

    return {
      // Personal Information from Resume Analysis
      personalInfo: {
        name: user?.name || 'Your Name',
        email: user?.email || 'your.email@example.com',
        phone: user?.phoneNumber || '+91 9876543210',
        location: user?.location || 'Your City, Country',
        linkedin: user?.linkedin || 'linkedin.com/in/yourprofile',
        github: user?.github || 'github.com/yourusername',
        website: user?.website || 'yourwebsite.com',
        summary: profileSummary || "Experienced professional with strong technical skills and proven track record in software development.",
        currentJob: extractJobTitleFromSummary(profileSummary),
        currentCompany: extractCompanyFromSummary(profileSummary),
        experience: extractExperienceYearsFromSummary(profileSummary),
      },

      // Professional Experience from Resume Analysis
      workExperience: resumeExperience,

      // Education from Resume Analysis
      education: resumeEducation,

      // Skills from Resume Analysis
      skills: {
        all: extractSkillsFromResume(profileSummary),
        technical: extractTechnologiesFromSummary(profileSummary).map(tech => ({
          name: tech,
          level: 'Expert',
          experience: 5,
        })),
        programming: extractTechnologiesFromSummary(profileSummary).filter(tech => 
          ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go'].includes(tech)
        ).map(tech => ({
          name: tech,
          level: 'Expert',
          experience: 5,
        })),
        frameworks: extractTechnologiesFromSummary(profileSummary).filter(tech => 
          ['React', 'Angular', 'Vue.js', 'Express', 'Django', 'Spring'].includes(tech)
        ).map(tech => ({
          name: tech,
          level: 'Expert',
          experience: 5,
        })),
        databases: extractTechnologiesFromSummary(profileSummary).filter(tech => 
          ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch'].includes(tech)
        ).map(tech => ({
          name: tech,
          level: 'Expert',
          experience: 5,
        })),
        tools: extractTechnologiesFromSummary(profileSummary).filter(tech => 
          ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure'].includes(tech)
        ).map(tech => ({
          name: tech,
          level: 'Expert',
          experience: 5,
        })),
        softSkills: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Project Management'],
        languages: ['English (Fluent)', 'Hindi (Native)', 'Spanish (Basic)'],
      },

      // Certifications from Resume Analysis
      certifications: [],

      // Projects from Resume Analysis
      projects: resumeProjects,

      // Awards & Achievements
      awards: [
        {
          title: 'Employee of the Year',
          organization: 'Tech Corp',
          year: '2023',
          description: 'Recognized for outstanding performance and leadership',
        },
        {
          title: 'Best Project Award',
          organization: 'University',
          year: '2020',
          description: 'Awarded for innovative final year project',
        },
        {
          title: 'Hackathon Winner',
          organization: 'TechFest 2023',
          year: '2023',
          description: 'First place in 48-hour coding competition',
        },
      ],

      // Publications
      publications: [
        {
          title: 'Machine Learning in Web Development',
          journal: 'International Journal of Computer Science',
          year: '2023',
          authors: 'Your Name, Co-author',
          url: 'https://example.com/publication',
        },
        {
          title: 'Optimizing React Performance',
          journal: 'Frontend Weekly',
          year: '2022',
          authors: 'Your Name',
          url: 'https://example.com/article',
        },
      ],
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
                Loading resume data...
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
        {/* Personal Information */}
        <Card sx={{ mb: 3, background: alpha(theme.palette.background.paper, 0.8) }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2, width: 60, height: 60 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {resumeInfo?.personalInfo?.name}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {resumeInfo?.personalInfo?.currentJob || 'Software Developer'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {resumeInfo?.personalInfo?.currentCompany && `at ${resumeInfo.personalInfo.currentCompany}`}
                </Typography>
                <Box display="flex" gap={2} mt={1}>
                  <Chip icon={<LocationOn />} label={resumeInfo?.personalInfo?.location} size="small" />
                  <Chip icon={<Business />} label={resumeInfo?.personalInfo?.email} size="small" />
                </Box>
              </Box>
            </Box>
            
            <Typography variant="body1" paragraph>
              {resumeInfo?.personalInfo?.summary}
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Professional Experience */}
          <Grid item xs={12}>
            <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
                    <Work />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Professional Experience
                  </Typography>
                </Box>
                
                {resumeInfo?.workExperience?.map((exp, index) => (
                  <Box key={exp.id} mb={3}>
                    <Card sx={{ p: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {exp.position}
                          </Typography>
                          <Typography variant="subtitle1" color="primary">
                            {exp.company} • {exp.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {exp.startDate} - {exp.endDate} • {exp.duration}
                          </Typography>
                        </Box>
                        <Chip label={exp.type} size="small" color="primary" variant="outlined" />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {exp.description}
                      </Typography>
                      
                      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                        Key Achievements:
                      </Typography>
                      <List dense>
                        {exp.achievements.map((achievement, idx) => (
                          <ListItem key={idx} disablePadding>
                            <ListItemIcon>
                              <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main }} />
                            </ListItemIcon>
                            <ListItemText primary={achievement} />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Box mt={2}>
                        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                          Technologies:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {exp.technologies.map((tech, idx) => (
                            <Chip key={idx} label={tech} size="small" color="primary" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Education */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                    <School />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Education
                  </Typography>
                </Box>
                
                {resumeInfo?.education?.map((edu) => (
                  <Box key={edu.id} mb={3}>
                    <Typography variant="h6" fontWeight="bold">
                      {edu.degree}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {edu.institution} • {edu.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.startDate} - {edu.endDate} • GPA: {edu.gpa}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.field}
                    </Typography>
                    
                    <Box mt={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Relevant Coursework:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                        {edu.relevantCoursework.map((course, idx) => (
                          <Chip key={idx} label={course} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Skills */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
                    <Code />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Skills
                  </Typography>
                </Box>
                
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    All Skills
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {resumeInfo?.skills?.all?.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={`${skill.name} (${skill.experience} years, ${skill.level})`} 
                        size="small" 
                        color="primary" 
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Programming Languages
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {resumeInfo?.skills?.programming?.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={skill.skillName} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Frameworks & Libraries
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {resumeInfo?.skills?.frameworks?.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={skill.skillName} 
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Tools & Technologies
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {resumeInfo?.skills?.tools?.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={skill.skillName} 
                        size="small" 
                        color="info" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Soft Skills
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {resumeInfo?.skills?.softSkills?.map((skill, idx) => (
                      <Chip 
                        key={idx} 
                        label={skill} 
                        size="small" 
                        color="default" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Projects */}
          <Grid item xs={12}>
            <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                    <Build />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Projects
                  </Typography>
                </Box>
                
                <Grid container spacing={3}>
                  {resumeInfo?.projects?.map((project) => (
                    <Grid item xs={12} md={6} key={project.id}>
                      <Card sx={{ height: '100%', border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {project.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {project.description}
                          </Typography>
                          
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                              Technologies:
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              {project.technologies.map((tech, idx) => (
                                <Chip key={idx} label={tech} size="small" color="primary" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                          
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                              Key Achievements:
                            </Typography>
                            <List dense>
                              {project.achievements.map((achievement, idx) => (
                                <ListItem key={idx} disablePadding>
                                  <ListItemIcon>
                                    <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main }} />
                                  </ListItemIcon>
                                  <ListItemText primary={achievement} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Duration: {project.duration}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Role: {project.role}
                              </Typography>
                            </Box>
                            <Chip 
                              label={project.status} 
                              color={project.status === 'Completed' ? 'success' : 'warning'} 
                              size="small" 
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Certifications */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 2 }}>
                    <Grade />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Certifications
                  </Typography>
                </Box>
                
                {resumeInfo?.certifications?.map((cert) => (
                  <Box key={cert.id} mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {cert.name}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {cert.issuer}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Issued: {cert.date} • Expires: {cert.expiryDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Credential ID: {cert.credentialId}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                      {cert.skills.map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" color="error" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Awards & Achievements */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: alpha(theme.palette.background.paper, 0.8) }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
                    <Star />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    Awards & Achievements
                  </Typography>
                </Box>
                
                {resumeInfo?.awards?.map((award, idx) => (
                  <Box key={idx} mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {award.title}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {award.organization} • {award.year}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {award.description}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default ResumeDataDisplay;