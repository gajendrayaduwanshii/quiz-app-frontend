import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Chip, 
  Stack, 
  Grid,
  Paper,
  Divider,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';

const WorkExperienceSection = ({ workExperiences }) => {
  const theme = useTheme();

  const getExperienceColor = (index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main
    ];
    return colors[index % colors.length];
  };

  const getExperienceIcon = (index) => {
    const icons = ['💼', '🚀', '⭐', '🏆', '🎯'];
    return icons[index % icons.length];
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return 'N/A';
    const start = new Date(startDate);
    const end = endDate === 'Present' ? new Date() : new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <Box style={{marginTop:"24px"}}>
      {/* Header */}
      <h3>Work Experiences</h3>

      {/* Work Experience Cards */}
      <Grid container spacing={3}>
        {workExperiences?.map((job, i) => {
          const experienceColor = getExperienceColor(i);
          const experienceIcon = getExperienceIcon(i);
          const duration = calculateDuration(job.startDate, job.endDate);
          const isCurrent = job.endDate === 'Present' || !job.endDate;
          
          return (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Card sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(experienceColor, 0.05)} 100%)`,
                border: `2px solid ${alpha(experienceColor, 0.2)}`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: `0 12px 24px ${alpha(experienceColor, 0.2)}`,
                  border: `2px solid ${alpha(experienceColor, 0.4)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${experienceColor}, ${alpha(experienceColor, 0.7)})`,
                  opacity: 0.8
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ 
                      bgcolor: experienceColor,
                      width: 48,
                      height: 48,
                      boxShadow: `0 4px 12px ${alpha(experienceColor, 0.3)}`
                    }}>
                      <BusinessIcon sx={{ fontSize: "1.5rem" }} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.1rem'
                      }}>
                        {job.jobTitle || 'Job Title'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.company || 'Company'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ color: experienceColor, lineHeight: 1 }}>
                        {experienceIcon}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Duration Display */}
                  <Box sx={{ 
                    p: 2, 
                    background: alpha(experienceColor, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${alpha(experienceColor, 0.2)}`,
                    textAlign: 'center',
                    mb: 3
                  }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: experienceColor, mb: 1 }}>
                      {duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {isCurrent ? 'Current Position' : 'Duration'}
                    </Typography>
                  </Box>

                  {/* Details */}
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: "1rem", color: theme.palette.text.secondary }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.startDate || 'N/A'} - {job.endDate || 'Present'}
                      </Typography>
                    </Box>
                    
                    {job.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon sx={{ fontSize: "1rem", color: theme.palette.text.secondary }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                    )}

                    {job.description && (
                      <Box sx={{ 
                        p: 1.5,
                        background: alpha(theme.palette.grey[100], 0.5),
                        borderRadius: 1,
                        border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`
                      }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          {job.description}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  {/* Status Badge */}
                  <Box sx={{ 
                    mt: 2,
                    p: 1.5,
                    background: `linear-gradient(135deg, ${alpha(experienceColor, 0.1)} 0%, ${alpha(experienceColor, 0.05)} 100%)`,
                    borderRadius: 2,
                    border: `1px solid ${alpha(experienceColor, 0.2)}`,
                    textAlign: 'center'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {isCurrent ? (
                        <>
                          <TrendingUpIcon sx={{ fontSize: "1rem", color: theme.palette.success.main }} />
                          <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.success.main }}>
                            Current Position
                          </Typography>
                        </>
                      ) : (
                        <>
                          <StarIcon sx={{ fontSize: "1rem", color: experienceColor }} />
                          <Typography variant="body2" fontWeight="bold" sx={{ color: experienceColor }}>
                            Previous Experience
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default WorkExperienceSection;
