import React, { memo, useMemo } from 'react';
import { Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { ArrowUpRight, BrainCircuit, CheckCircle2, Download, FileText, Sparkles, Target, Trophy } from 'lucide-react';
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

  const latestQuizScore = useMemo(() => {
    const latestQuiz = user.quizResult?.[user.quizResult.length - 1];
    const questions = latestQuiz?.quizQuestion || [];
    if (!questions.length) return 0;
    const correct = questions.filter((q) => q.answer?.trim() === q.correctAnswer?.trim()).length;
    return Math.round((correct / questions.length) * 100);
  }, [user.quizResult]);

  const commandScore = useMemo(() => {
    const skillSignal = Math.min(36, (user.skills?.length || 0) * 6);
    const quizSignal = Math.min(30, latestQuizScore * 0.3);
    const resumeSignal = user.uploadResume ? 18 : 0;
    const experienceSignal = Math.min(16, (Number(user.yearsExperience) || 0) * 4);
    return Math.round(Math.min(100, skillSignal + quizSignal + resumeSignal + experienceSignal));
  }, [latestQuizScore, user.skills?.length, user.uploadResume, user.yearsExperience]);

  return (
    <PremiumCard
      hover={false}
      sx={{
        p: { xs: 2.5, md: 3.6 },
        mb: 3,
        minHeight: 280,
        display: 'flex',
        alignItems: 'center',
        borderRadius: '22px',
        background:
          'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(5,8,22,0.88)), radial-gradient(circle at 8% 0%, rgba(6,182,212,0.22), transparent 34%), radial-gradient(circle at 86% 12%, rgba(124,58,237,0.27), transparent 32%)',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: { xs: 3, lg: 4 },
          width: '100%',
        }}
      >
        <Box sx={{ maxWidth: 780 }}>
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
            sx={{ fontWeight: 950, lineHeight: 1.03, mb: 1.5, fontSize: { xs: 34, md: 46 } }}
          >
            Welcome back, {user.name || 'Future-ready talent'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: 15, md: 17 } }}>
            Your career cockpit for skill signal, quiz performance, resume strength, and AI-guided growth momentum.
          </Typography>

          <Box
            sx={{
              mt: 2.6,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
              gap: 1.2,
              maxWidth: 720,
            }}
          >
            {[
              { icon: <BrainCircuit size={17} />, label: 'Skills mapped', value: user.skills?.length || 0, color: '#06B6D4' },
              { icon: <Trophy size={17} />, label: 'Quiz attempts', value: user.quizResult?.length || 0, color: '#22C55E' },
              { icon: <Target size={17} />, label: 'Latest score', value: `${latestQuizScore}%`, color: '#F59E0B' },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 1.4,
                  borderRadius: '18px',
                  bgcolor: 'rgba(255,255,255,0.055)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <Stack direction="row" spacing={0.9} alignItems="center" sx={{ color: item.color, mb: 0.7 }}>
                  {item.icon}
                  <Typography sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 800 }}>
                    {item.label}
                  </Typography>
                </Stack>
                <Typography sx={{ fontSize: 24, fontWeight: 950, lineHeight: 1 }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Stack direction="row" spacing={1.2} sx={{ mt: 2.4, flexWrap: 'wrap', rowGap: 1 }}>
            <Chip icon={<CheckCircle2 size={15} />} label={`${user.yearsExperience || 0} Years Experience`} />
            <Chip icon={<FileText size={15} />} label={user.uploadResume ? 'Resume attached' : 'Resume pending'} />
          </Stack>
        </Box>

        <Box
          sx={{
            p: 2.2,
            borderRadius: '18px',
            bgcolor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.4 }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 850 }}>Readiness Index</Typography>
            <Chip
              size="small"
              label={`${commandScore}%`}
              sx={{
                color: '#CFFAFE',
                bgcolor: 'rgba(6,182,212,0.12)',
                border: '1px solid rgba(103,232,249,0.24)',
                fontWeight: 950,
              }}
            />
          </Stack>
          <Typography sx={{ fontSize: 44, lineHeight: 1, fontWeight: 950, mb: 1 }}>
            {commandScore}
            <Typography component="span" sx={{ color: 'text.secondary', fontSize: 18, fontWeight: 900 }}>
              /100
            </Typography>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={commandScore}
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                background: 'linear-gradient(90deg, #7C3AED, #06B6D4, #22C55E)',
              },
            }}
          />
          <Typography sx={{ color: 'text.secondary', mt: 1.4, mb: 2, fontSize: 13 }}>
            Blends skills, resume, experience, and latest assessment performance.
          </Typography>

          <Stack spacing={1.1}>
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
                  width: '100%',
                }}
              >
                Download Resume
              </Button>
            )}

            <PremiumButton onClick={onLearningQuiz} endIcon={<ArrowUpRight size={17} />} sx={{ width: '100%' }}>
              Open AI Hub
            </PremiumButton>
          </Stack>
        </Box>
      </Box>
    </PremiumCard>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;
