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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const CertificationsSection = ({ certifications, parseCertifications }) => {
  const theme = useTheme();

  const certList = parseCertifications(certifications);

  const getCertificationColor = (index) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main
    ];
    return colors[index % colors.length];
  };

  const getCertificationIcon = (index) => {
    const icons = ['🏆', '🥇', '⭐', '🎖️', '🏅'];
    return icons[index % icons.length];
  };

  const getCertificationType = (cert) => {
    const certLower = cert.toLowerCase();
    if (certLower.includes('aws') || certLower.includes('azure') || certLower.includes('gcp')) {
      return 'Cloud';
    } else if (certLower.includes('security') || certLower.includes('cissp') || certLower.includes('ceh')) {
      return 'Security';
    } else if (certLower.includes('project') || certLower.includes('pmp') || certLower.includes('scrum')) {
      return 'Management';
    } else if (certLower.includes('data') || certLower.includes('analytics') || certLower.includes('ml')) {
      return 'Data Science';
    } else if (certLower.includes('devops') || certLower.includes('docker') || certLower.includes('kubernetes')) {
      return 'DevOps';
    }
    return 'General';
  };

  return (
    <Box style={{marginTop:"24px"}}>
      {/* Header */}
      <h3>🎓 Certifications & Awards</h3>
      {/* Certifications Cards */}
      {certList.length > 0 ? (
        <Grid container spacing={3}>
          {certList.map((cert, i) => {
            const certColor = getCertificationColor(i);
            const certIcon = getCertificationIcon(i);
            const certType = getCertificationType(cert);
            
            return (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Card sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(certColor, 0.05)} 100%)`,
                  border: `2px solid ${alpha(certColor, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: `0 12px 24px ${alpha(certColor, 0.2)}`,
                    border: `2px solid ${alpha(certColor, 0.4)}`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${certColor}, ${alpha(certColor, 0.7)})`,
                    opacity: 0.8
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ 
                        bgcolor: certColor,
                        width: 48,
                        height: 48,
                        boxShadow: `0 4px 12px ${alpha(certColor, 0.3)}`
                      }}>
                        <EmojiEventsIcon sx={{ fontSize: "1.5rem" }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: '1.1rem'
                        }}>
                          {cert}
                        </Typography>
                        <Chip 
                          label={certType} 
                          size="small" 
                          sx={{ 
                            bgcolor: alpha(certColor, 0.1),
                            color: certColor,
                            border: `1px solid ${alpha(certColor, 0.3)}`,
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: certColor, lineHeight: 1 }}>
                          {certIcon}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Certification Details */}
                    <Box sx={{ 
                      p: 2, 
                      background: alpha(certColor, 0.1),
                      borderRadius: 2,
                      border: `1px solid ${alpha(certColor, 0.2)}`,
                      textAlign: 'center',
                      mb: 3
                    }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: certColor, mb: 1 }}>
                        Professional
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Certification
                      </Typography>
                    </Box>

                    {/* Details */}
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: "1rem", color: theme.palette.success.main }} />
                        <Typography variant="body2" color="text.secondary">
                          Verified Professional Credential
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ fontSize: "1rem", color: theme.palette.warning.main }} />
                        <Typography variant="body2" color="text.secondary">
                          Industry Recognized
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Status Badge */}
                    <Box sx={{ 
                      mt: 2,
                      p: 1.5,
                      background: `linear-gradient(135deg, ${alpha(certColor, 0.1)} 0%, ${alpha(certColor, 0.05)} 100%)`,
                      borderRadius: 2,
                      border: `1px solid ${alpha(certColor, 0.2)}`,
                      textAlign: 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <MilitaryTechIcon sx={{ fontSize: "1rem", color: certColor }} />
                        <Typography variant="body2" fontWeight="bold" sx={{ color: certColor }}>
                          Certified Professional
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.grey[50], 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.6)} 100%)`,
          borderRadius: 3,
          border: `2px dashed ${alpha(theme.palette.grey[300], 0.6)}`
        }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.grey[300], 0.3)}, ${alpha(theme.palette.grey[400], 0.2)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            mx: 'auto'
          }}>
            <EmojiEventsIcon sx={{ fontSize: "2.5rem", color: theme.palette.grey[500] }} />
          </Box>
          <Typography variant="h6" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>
            No Certifications Listed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add your professional certifications and awards to showcase your expertise
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CertificationsSection;
