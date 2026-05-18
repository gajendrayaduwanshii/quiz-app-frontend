import React, { memo, useMemo } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { ArrowUpRight, Download, Sparkles } from 'lucide-react';
import PremiumCard from '@/components/premium/PremiumCard';
import PremiumButton from '@/components/premium/PremiumButton';

const DashboardHeader = memo(({ user, onLearningQuiz }) => {
  const resumeUrl = useMemo(() => {
    if (!user.uploadResume?.url) return null;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${user.uploadResume.url}`;
  }, [user.uploadResume?.url]);

  const resumeName = useMemo(() => {
    return user.uploadResume?.name || "resume.pdf";
  }, [user.uploadResume?.name]);

  return (
    <PremiumCard
      hover={false}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        mb: 3,
        minHeight: 220,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 3,
          width: '100%',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box sx={{ maxWidth: 720 }}>
          <Chip
            icon={<Sparkles size={15} />}
            label="SkillSync AI Command Center"
            sx={{
              mb: 2,
              color: '#fff',
              border: '1px solid rgba(6,182,212,0.35)',
              bgcolor: 'rgba(6,182,212,0.10)',
            }}
          />
          <Typography
            variant="h3"
            className="gradient-text"
            sx={{ fontWeight: 900, lineHeight: 1.05, mb: 1.5 }}
          >
            Welcome back, {user.name || 'Future-ready talent'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: 15, md: 17 } }}>
            Track skills, resume strength, interview readiness, and AI-powered learning momentum from one premium workspace.
          </Typography>
          <Stack direction="row" spacing={1.2} sx={{ mt: 2.4, flexWrap: 'wrap', rowGap: 1 }}>
            <Chip label={`${user.skills?.length || 0} Skills`} />
            <Chip label={`${user.quizResult?.length || 0} Quiz Attempts`} />
            <Chip label={`${user.yearsExperience || 0} Years Experience`} />
          </Stack>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={1.3} sx={{ width: { xs: '100%', md: 'auto' } }}>
        {resumeUrl && (
          <Button
            component="a"
            href={resumeUrl}
            download={resumeName}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Download size={17} />}
            variant="outlined"
            sx={{
              borderColor: 'rgba(6,182,212,0.45)',
              color: '#fff',
              minWidth: 190,
            }}
          >
            Download Resume
          </Button>
        )}

          <PremiumButton onClick={onLearningQuiz} endIcon={<ArrowUpRight size={17} />} sx={{ minWidth: 190 }}>
            Open AI Hub
          </PremiumButton>
        </Stack>
      </Box>
    </PremiumCard>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
