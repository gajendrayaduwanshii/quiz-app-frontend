import React, { memo, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import { ArrowUpRight, BrainCircuit, CheckCircle2, Download, FileText, Target, Trophy } from 'lucide-react';
import PremiumCard from '@/components/premium/PremiumCard';
import PremiumButton from '@/components/premium/PremiumButton';

const MotionBox = motion(Box);

// Count from 0 → target after a delay
const useCountUp = (target, duration = 1000, delay = 500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!target) return;
      let current = 0;
      const steps = 55;
      const inc = target / steps;
      const interval = setInterval(() => {
        current += inc;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.round(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const easeOut = [0.22, 1, 0.36, 1];

const DashboardHeader = memo(({ user, onLearningQuiz }) => {
  const [progressVal, setProgressVal] = useState(0);

  const resumeUrl = useMemo(() => {
    if (!user.uploadResume?.url) return null;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${user.uploadResume.url}`;
  }, [user.uploadResume?.url]);

  const resumeName = useMemo(() => user.uploadResume?.name || 'resume.pdf', [user.uploadResume?.name]);

  const latestQuizScore = useMemo(() => {
    const latest = user.quizResult?.[user.quizResult.length - 1];
    const qs = latest?.quizQuestion || [];
    if (!qs.length) return 0;
    return Math.round((qs.filter((q) => q.answer?.trim() === q.correctAnswer?.trim()).length / qs.length) * 100);
  }, [user.quizResult]);

  const commandScore = useMemo(() => {
    const s = Math.min(36, (user.skills?.length || 0) * 6);
    const q = Math.min(30, latestQuizScore * 0.3);
    const r = user.uploadResume ? 18 : 0;
    const e = Math.min(16, (Number(user.yearsExperience) || 0) * 4);
    return Math.round(Math.min(100, s + q + r + e));
  }, [latestQuizScore, user.skills?.length, user.uploadResume, user.yearsExperience]);

  // Progress bar sweeps from 0 → value on mount
  useEffect(() => {
    const t = setTimeout(() => setProgressVal(commandScore), 900);
    return () => clearTimeout(t);
  }, [commandScore]);

  // Count-up values
  const skillCount    = useCountUp(user.skills?.length || 0,      900, 600);
  const quizCount     = useCountUp(user.quizResult?.length || 0,  900, 700);
  const scoreCount    = useCountUp(latestQuizScore,                900, 800);
  const readinessCount = useCountUp(commandScore,                 1100, 500);

  return (
    <MotionBox
      initial={{ opacity: 0, y: -32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: easeOut }}
    >
      <PremiumCard
        hover={false}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3.6 },
          mb: 3,
          minHeight: { xs: "auto", md: 280 },
          display: 'flex',
          alignItems: 'center',
          borderRadius: '22px',
          overflow: 'hidden',
          position: 'relative',
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(5,8,22,0.88)), radial-gradient(circle at 8% 0%, rgba(6,182,212,0.22), transparent 34%), radial-gradient(circle at 86% 12%, rgba(124,58,237,0.27), transparent 32%)',
        }}
      >
        {/* ── Floating ambient orbs ── */}
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <Box sx={{
            position: 'absolute', width: 360, height: 360, borderRadius: '50%',
            top: '-30%', right: '-6%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.20), transparent 70%)',
            animation: 'hOrb1 7s ease-in-out infinite',
            '@keyframes hOrb1': {
              '0%,100%': { transform: 'translate(0,0) scale(1)' },
              '50%': { transform: 'translate(-22px, 34px) scale(1.2)' },
            },
          }} />
          <Box sx={{
            position: 'absolute', width: 240, height: 240, borderRadius: '50%',
            bottom: '-22%', left: '28%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.16), transparent 70%)',
            animation: 'hOrb2 9s ease-in-out infinite',
            '@keyframes hOrb2': {
              '0%,100%': { transform: 'translate(0,0) scale(1)' },
              '50%': { transform: 'translate(28px, -22px) scale(1.25)' },
            },
          }} />
          <Box sx={{
            position: 'absolute', width: 160, height: 160, borderRadius: '50%',
            top: '15%', left: '-4%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.12), transparent 70%)',
            animation: 'hOrb3 11s ease-in-out infinite',
            '@keyframes hOrb3': {
              '0%,100%': { transform: 'translate(0,0) scale(1)' },
              '50%': { transform: 'translate(16px, 26px) scale(1.15)' },
            },
          }} />
          {/* Subtle shimmer line across the top */}
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(6,182,212,0.5), transparent)',
            animation: 'shimmerLine 4s ease-in-out infinite',
            '@keyframes shimmerLine': {
              '0%': { backgroundPosition: '-100% 0' },
              '100%': { backgroundPosition: '200% 0' },
            },
          }} />
        </Box>

        {/* ── Main content ── */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 340px' },
          alignItems: 'center',
          gap: { xs: 3, lg: 4 },
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Left: greeting + stats */}
          <Box sx={{ maxWidth: 780, minWidth: 0 }}>

            {/* Pulsing live chip */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Chip
                icon={
                  <Box sx={{
                    width: 8, height: 8, borderRadius: '50%', bgcolor: '#22C55E',
                    animation: 'liveDot 2s ease infinite',
                    '@keyframes liveDot': {
                      '0%,100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.7)' },
                      '50%': { boxShadow: '0 0 0 5px rgba(34,197,94,0)' },
                    },
                  }} />
                }
                label="SkillSync AI Command Center"
                sx={{
                  mb: 2, color: '#fff', pl: 0.5,
                  border: '1px solid rgba(6,182,212,0.35)',
                  bgcolor: 'rgba(6,182,212,0.10)',
                }}
              />
            </MotionBox>

            {/* Greeting line */}
            <MotionBox
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.55, ease: easeOut }}
            >
              <Typography sx={{
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 0.3,
                fontSize: { xs: '1.1rem', md: '1.35rem' },
                color: 'text.secondary',
              }}>
                {getGreeting()},
              </Typography>
            </MotionBox>

            {/* Name with shimmer */}
            <MotionBox
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.55, ease: easeOut }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 950,
                  lineHeight: 1.06,
                  mb: 1.5,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.875rem' },
                  background: 'linear-gradient(90deg, #ffffff 0%, #A78BFA 45%, #67E8F9 75%, #ffffff 100%)',
                  backgroundSize: '250% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'nameShimmer 5s linear infinite',
                  '@keyframes nameShimmer': {
                    '0%': { backgroundPosition: '0% center' },
                    '100%': { backgroundPosition: '250% center' },
                  },
                  overflowWrap: 'anywhere',
                }}
              >
                {user.name || 'Future-ready talent'}
              </Typography>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.48, duration: 0.5 }}
            >
              <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.9375rem', md: '1.0625rem' } }}>
                Your career cockpit for skill signal, quiz performance, resume strength, and AI-guided growth momentum.
              </Typography>
            </MotionBox>

            {/* Count-up stat tiles */}
            <Box sx={{
              mt: 2.6,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 1.2,
              maxWidth: 720,
            }}>
              {[
                { icon: <BrainCircuit size={17} />, label: 'Skills mapped',  value: skillCount,       color: '#06B6D4', delay: 0.52 },
                { icon: <Trophy size={17} />,       label: 'Quiz attempts',  value: quizCount,        color: '#22C55E', delay: 0.62 },
                { icon: <Target size={17} />,       label: 'Latest score',   value: `${scoreCount}%`, color: '#F59E0B', delay: 0.72 },
              ].map((item) => (
                <MotionBox
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.85, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: item.delay, duration: 0.45, ease: easeOut }}
                  sx={{
                    p: 1.4,
                    borderRadius: '18px',
                    bgcolor: 'rgba(255,255,255,0.055)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    cursor: 'default',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      bgcolor: `${item.color}12`,
                      border: `1px solid ${item.color}40`,
                      transform: 'translateY(-3px)',
                      boxShadow: `0 10px 28px ${item.color}20`,
                    },
                  }}
                >
                  <Stack direction="row" spacing={0.9} alignItems="center" sx={{ color: item.color, mb: 0.7 }}>
                    {item.icon}
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 800 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 950, lineHeight: 1 }}>
                    {item.value}
                  </Typography>
                </MotionBox>
              ))}
            </Box>

            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.82, duration: 0.4 }}
            >
              <Stack direction="row" spacing={1.2} sx={{ mt: 2.4, flexWrap: 'wrap', rowGap: 1 }}>
                <Chip icon={<CheckCircle2 size={15} />} label={`${user.yearsExperience || 0} Years Experience`} />
                <Chip icon={<FileText size={15} />} label={user.uploadResume ? 'Resume attached' : 'Resume pending'} />
              </Stack>
            </MotionBox>
          </Box>

          {/* Right: Readiness panel */}
          <MotionBox
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.38, duration: 0.65, ease: easeOut }}
            sx={{
              p: 2.2,
              width: '100%',
              maxWidth: { xs: '100%', lg: 340 },
              borderRadius: '18px',
              bgcolor: 'rgba(255,255,255,0.055)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.4 }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 850 }}>Readiness Index</Typography>
              <Chip
                size="small"
                label={`${readinessCount}%`}
                sx={{
                  color: '#CFFAFE',
                  bgcolor: 'rgba(6,182,212,0.12)',
                  border: '1px solid rgba(103,232,249,0.24)',
                  fontWeight: 950,
                  animation: 'chipGlow 3s ease-in-out infinite',
                  '@keyframes chipGlow': {
                    '0%,100%': { boxShadow: '0 0 0 0 rgba(6,182,212,0)' },
                    '50%': { boxShadow: '0 0 18px 3px rgba(6,182,212,0.32)' },
                  },
                }}
              />
            </Stack>

            {/* Big readiness number */}
            <Typography sx={{
              fontSize: '2.75rem',
              lineHeight: 1,
              fontWeight: 950,
              mb: 1,
              background: 'linear-gradient(135deg, #ffffff, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {readinessCount}
              <Typography
                component="span"
                sx={{ fontSize: '1.125rem', fontWeight: 900, color: 'text.secondary', WebkitTextFillColor: 'unset' }}
              >
                /100
              </Typography>
            </Typography>

            {/* Animated sweep progress */}
            <LinearProgress
              variant="determinate"
              value={progressVal}
              sx={{
                height: 10,
                borderRadius: 999,
                bgcolor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #7C3AED, #06B6D4, #22C55E)',
                  transition: 'transform 1.3s cubic-bezier(0.22,1,0.36,1) !important',
                },
              }}
            />

            <Typography sx={{ color: 'text.secondary', mt: 1.4, mb: 2, fontSize: '0.8125rem' }}>
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
                  sx={{ borderColor: 'rgba(6,182,212,0.45)', color: '#fff', width: '100%' }}
                >
                  Download Resume
                </Button>
              )}
              <PremiumButton onClick={onLearningQuiz} endIcon={<ArrowUpRight size={17} />} sx={{ width: '100%' }}>
                Open AI Hub
              </PremiumButton>
            </Stack>
          </MotionBox>
        </Box>
      </PremiumCard>
    </MotionBox>
  );
});

DashboardHeader.displayName = 'DashboardHeader';
export default DashboardHeader;
