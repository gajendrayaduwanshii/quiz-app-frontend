import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Star as StarIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { resolveStrapiMediaUrl } from '@/lib/strapiConfig';

const parseApiResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  const isHtml = text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html');

  return {
    error: isHtml
      ? 'Resume analyzer API returned an HTML error page. Please restart the frontend server and try again.'
      : text || `HTTP ${response.status}: Failed to fetch resume analysis data`,
  };
};

const ResumeDataFromAnalysis = ({ user, resumeData }) => {
  const theme = useTheme();
  const [resumeAnalysisData, setResumeAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumeAnalysisData();
  }, [user]);

  const fetchResumeAnalysisData = async () => {
    console.log('User data:', user);
    console.log('Upload resume:', user?.uploadResume);
    
    if (!user?.uploadResume?.url) {
      setError('No resume uploaded. Please upload a resume to see analysis data.');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const resumeUrl = resolveStrapiMediaUrl(user.uploadResume.url);
      console.log('Resume URL:', resumeUrl);
      
      const response = await fetch(`/api/resume/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          uploadResume: resumeUrl
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await parseApiResponse(response);
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch resume analysis data`);
      }

      const data = await parseApiResponse(response);
      console.log('Resume analysis data:', data);
      setResumeAnalysisData(data);
    } catch (err) {
      console.error('Error fetching resume analysis data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = (data) => {
    // The resume analysis API returns profileSummary and learningSuggestions
    // We need to extract personal info from the profileSummary text
    if (!data?.profileSummary) return null;

    const profileSummary = data.profileSummary;
    const name = user?.name || 'Your Name';
    const email = user?.email || 'your.email@example.com';
    const phone = user?.phoneNumber || '+91 9876543210';
    const location = user?.location || 'Your City, Country';
    
    // Extract job title and company from profile summary
    const jobMatch = profileSummary.match(/(Front End Developer|Backend Developer|Full Stack Developer|Software Engineer|Developer)/i);
    const companyMatch = profileSummary.match(/at\s+([A-Za-z\s]+)/i);
    const currentJob = jobMatch ? jobMatch[1] : 'Software Developer';
    const currentCompany = companyMatch ? companyMatch[1].trim() : 'Current Company';

    return (
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)` }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: theme.palette.primary.main }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                {currentJob}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                at {currentCompany}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">{location || 'Your City, Country'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">{email || 'your.email@example.com'}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {profileSummary && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {profileSummary}
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderWorkExperience = (data) => {
    if (!data?.profileSummary) return null;

    // Extract work experience from profile summary
    const extractWorkExperience = (summary) => {
      const workExp = [];
      
      // Look for experience patterns in the summary
      const experienceMatch = summary.match(/(\d+)\+?\s*years?\s*of\s*experience/i);
      const companyMatch = summary.match(/at\s+([A-Za-z\s]+)/i);
      const roleMatch = summary.match(/(Front End Developer|Backend Developer|Full Stack Developer|Software Engineer|Developer)/i);
      
      if (experienceMatch || companyMatch || roleMatch) {
        workExp.push({
          id: 1,
          position: roleMatch ? roleMatch[1] : 'Software Developer',
          company: companyMatch ? companyMatch[1].trim() : 'Current Company',
          location: 'Your City, Country',
          startDate: '2020-01-01',
          endDate: 'Present',
          duration: experienceMatch ? `${experienceMatch[1]} years` : '2+ years',
          description: summary,
          achievements: [
            'Led development of key features',
            'Improved system performance by 30%',
            'Mentored junior developers',
          ],
          technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
          type: 'Full-time',
          current: true,
        });
      }
      
      return workExp;
    };

    const workExperience = extractWorkExperience(data.profileSummary);

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <WorkIcon sx={{ fontSize: 28, mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h5" fontWeight="bold">
              Professional Experience
            </Typography>
          </Box>
          
          {workExperience.length > 0 ? (
            workExperience.map((exp, index) => (
              <Box key={exp.id || index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {exp.position}
                    </Typography>
                    <Typography variant="body1" color="primary" gutterBottom>
                      {exp.company}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      {exp.startDate} - {exp.endDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {exp.duration}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip 
                    label={exp.type} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={exp.location} 
                    size="small" 
                    color="secondary" 
                    variant="outlined" 
                  />
                  {exp.current && (
                    <Chip 
                      label="Current" 
                      size="small" 
                      color="success" 
                      variant="outlined" 
                    />
                  )}
                </Box>

                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {exp.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Key Achievements:
                  </Typography>
                  <List dense>
                    {exp.achievements.map((achievement, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={achievement} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Technologies:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {exp.technologies.map((tech, idx) => (
                      <Chip 
                        key={idx} 
                        label={tech} 
                        size="small" 
                        color="info" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                Work experience details are included in the profile summary above.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderEducation = (data) => {
    if (!data?.profileSummary) return null;

    // Extract education from profile summary
    const extractEducation = (summary) => {
      const education = [];
      
      // Look for education patterns in the summary
      const degreeMatch = summary.match(/(Bachelor|Master|B\.Tech|M\.Tech|MCA|MBA|B\.E|M\.E)/i);
      const universityMatch = summary.match(/(University|College|Institute|DAVV|IIT|NIT)/i);
      
      if (degreeMatch || universityMatch) {
        education.push({
          id: 1,
          degree: degreeMatch ? degreeMatch[1] : 'Bachelor of Technology',
          institution: universityMatch ? universityMatch[1] : 'University Name',
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
        });
      }
      
      return education;
    };

    const education = extractEducation(data.profileSummary);

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ fontSize: 28, mr: 1, color: theme.palette.secondary.main }} />
            <Typography variant="h5" fontWeight="bold">
              Education
            </Typography>
          </Box>
          
          {education.length > 0 ? (
            education.map((edu, index) => (
              <Box key={edu.id || index} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {edu.degree}
                    </Typography>
                    <Typography variant="body1" color="primary" gutterBottom>
                      {edu.institution}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.field}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      {edu.startDate} - {edu.endDate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      GPA: {edu.gpa}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">{edu.location}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Achievements:
                  </Typography>
                  <List dense>
                    {edu.achievements.map((achievement, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <StarIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={achievement} 
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Relevant Coursework:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {edu.relevantCoursework.map((course, idx) => (
                      <Chip 
                        key={idx} 
                        label={course} 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Alert severity="info">
              <Typography variant="body2">
                Education details are included in the profile summary above.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSkills = (data) => {
    if (!data?.profileSummary && !data?.learningSuggestions) return null;

    // Extract skills from profile summary
    const extractSkillsFromSummary = (summary) => {
      const techKeywords = ['React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'Python', 'Java', 'MongoDB', 'AWS', 'Docker', 'Front End', 'Backend', 'Full Stack'];
      const foundTechs = techKeywords.filter(tech => 
        summary.toLowerCase().includes(tech.toLowerCase())
      );
      
      return foundTechs.map(tech => ({
        name: tech,
        level: 'Expert',
        experience: 5,
      }));
    };

    const skills = extractSkillsFromSummary(data.profileSummary || '');

    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <CodeIcon sx={{ fontSize: 28, mr: 1, color: theme.palette.info.main }} />
            <Typography variant="h5" fontWeight="bold">
              Skills
            </Typography>
          </Box>

          {/* Skills from Resume */}
          {skills.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Technical Skills (from Resume)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={`${skill.name} (${skill.experience} years, ${skill.level})`}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Learning Suggestions */}
          {data?.learningSuggestions && Array.isArray(data.learningSuggestions) && data.learningSuggestions.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Learning Recommendations
              </Typography>
              {data.learningSuggestions.map((suggestion, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                    {suggestion.area || 'Skill Area'}
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {suggestion.recommendation || 'No recommendation available'}
                    </Typography>
                  </Paper>
                  {index < data.learningSuggestions.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Box>
          )}

          {skills.length === 0 && (!data?.learningSuggestions || data.learningSuggestions.length === 0) && (
            <Alert severity="info">
              <Typography variant="body2">
                Skills and learning recommendations are included in the profile summary above.
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)` }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading Resume Analysis Data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Alert severity="error">
            <Typography variant="h6" gutterBottom>
              Error Loading Resume Data
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchResumeAnalysisData}
              disabled={loading}
            >
              Retry
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!resumeAnalysisData) {
    // Fallback to existing resume data from props
    if (resumeData?.profileSummary || resumeData?.learningSuggestions) {
      return (
        <Box>
          {renderPersonalInfo(resumeData)}
          {renderWorkExperience(resumeData)}
          {renderEducation(resumeData)}
          {renderSkills(resumeData)}
        </Box>
      );
    }
    
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Alert severity="info">
            <Typography variant="h6" gutterBottom>
              No Resume Analysis Data Available
            </Typography>
            <Typography variant="body2">
              Please upload a resume to see the analysis data.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {renderPersonalInfo(resumeAnalysisData)}
      {renderWorkExperience(resumeAnalysisData)}
      {renderEducation(resumeAnalysisData)}
      {renderSkills(resumeAnalysisData)}
    </Box>
  );
};

export default ResumeDataFromAnalysis;
