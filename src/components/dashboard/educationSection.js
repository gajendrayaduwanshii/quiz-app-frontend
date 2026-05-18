import React from 'react';
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';
import { Award, CalendarDays, GraduationCap, MapPin } from 'lucide-react';
import PremiumCard from '@/components/premium/PremiumCard';
import SectionHeader from '@/components/premium/SectionHeader';

const EducationSection = ({ educations = [] }) => {

  const getGradeColor = (grade) => {
    if (grade >= 90) return '#22C55E';
    if (grade >= 80) return '#06B6D4';
    if (grade >= 70) return '#F59E0B';
    return '#7C3AED';
  };

  const getGradeIcon = (grade) => {
    if (grade >= 90) return '🏆';
    if (grade >= 80) return '🥇';
    if (grade >= 70) return '🥈';
    return '🥉';
  };

  return (
    <Box sx={{ mt: 3 }}>
      <SectionHeader
        eyebrow="Credentials"
        title="Education"
        description="Academic foundation, grades, and profile credibility signals."
      />
      <Grid container spacing={2.2}>
        {educations?.length ? educations.map((edu, i) => {
          const gradeColor = getGradeColor(edu.grade || 0);
          const gradeIcon = getGradeIcon(edu.grade || 0);
          
          return (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <PremiumCard glow={`${gradeColor}33`} sx={{ height: '100%', p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.6, mb: 2.4 }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '17px',
                      display: 'grid',
                      placeItems: 'center',
                      background: `linear-gradient(135deg, ${gradeColor}, #06B6D4)`,
                      boxShadow: `0 16px 34px ${gradeColor}42`
                    }}>
                      <GraduationCap size={23} color="#fff" />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                        {edu.degree || 'Degree'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {edu.institution || 'Institution'}
                      </Typography>
                    </Box>
                    <Box sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '16px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: `${gradeColor}18`,
                      border: `1px solid ${gradeColor}35`
                    }}>
                      <Typography variant="h5" sx={{ lineHeight: 1 }}>
                        {gradeIcon}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    p: 2, 
                    background: `linear-gradient(135deg, ${gradeColor}1f, rgba(6,182,212,0.08))`,
                    borderRadius: '18px',
                    border: `1px solid ${gradeColor}35`,
                    mb: 2.2
                  }}>
                    <Typography variant="h4" fontWeight="900" sx={{ color: gradeColor, mb: 0.4 }}>
                      {edu.grade || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Final Grade
                    </Typography>
                  </Box>

                  <Stack spacing={1.1}>
                    <Chip
                      icon={<CalendarDays size={15} />}
                      label={`Year: ${edu.passingYear || 'N/A'}`}
                      sx={{ justifyContent: 'flex-start' }}
                    />
                    
                    {edu.location && (
                      <Chip
                        icon={<MapPin size={15} />}
                        label={edu.location}
                        sx={{ justifyContent: 'flex-start' }}
                      />
                    )}

                    <Chip
                      icon={<Award size={15} />}
                      label={edu.grade >= 90 ? 'Outstanding' : edu.grade >= 80 ? 'Excellent' : edu.grade >= 70 ? 'Good' : 'Academic credential'}
                      sx={{ justifyContent: 'flex-start', color: gradeColor }}
                    />
                  </Stack>
              </PremiumCard>
            </Grid>
          );
        }) : (
          <Grid item size={{ xs: 12 }}>
            <PremiumCard hover={false} sx={{ p: 3 }}>
              <Typography sx={{ color: 'text.secondary' }}>No education data added yet.</Typography>
            </PremiumCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default EducationSection;
