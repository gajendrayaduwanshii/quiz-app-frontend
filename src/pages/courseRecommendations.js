"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import {
  Sparkles,
} from "lucide-react";
import { useUser } from "@/customHooks/useUser";
import { useCourseRecommendations } from "@/customHooks/useCourseRecommendations";
import LoaderTwo from "@/components/LoaderTwo";
import PremiumPage from "@/components/premium/PremiumPage";
import SectionHeader from "@/components/premium/SectionHeader";

const SECTION_TITLES = new Set([
  "Recommended focus from your profile",
  "Course Suggestions",
  "YouTube Channels",
  "Certification Suggestions",
]);

const URL_PATTERN = /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/g;

const renderLinkedText = (text) => {
  const parts = String(text || "").split(URL_PATTERN).filter((part) => part !== undefined);

  return parts.map((part, index) => {
    if (!part) return null;

    const isUrl = /^https?:\/\//i.test(part) || /^www\./i.test(part);
    if (!isUrl) return <span key={`${part}-${index}`}>{part}</span>;

    const href = /^www\./i.test(part) ? `https://${part}` : part;
    return (
      <Box
        key={`${part}-${index}`}
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: "#67E8F9",
          fontWeight: 800,
          overflowWrap: "anywhere",
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {part}
      </Box>
    );
  });
};

const RecommendationText = ({ text }) => {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n");

  return (
    <Stack spacing={1.05}>
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <Box key={`space-${index}`} sx={{ height: 8 }} />;
        }

        const cleanHeading = trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, "");
        const isHeading = SECTION_TITLES.has(cleanHeading);
        const isNumbered = /^\d+\.\s/.test(trimmed);

        return (
          <Typography
            key={`${trimmed}-${index}`}
            component={isHeading ? "h2" : "p"}
            sx={{
              color: isHeading ? "#fff" : "#CBD5E1",
              fontSize: isHeading ? { xs: 20, md: 24 } : { xs: 15, md: 16 },
              fontWeight: isHeading ? 950 : isNumbered ? 850 : 500,
              lineHeight: isHeading ? 1.25 : 1.7,
              mt: isHeading && index ? 1.8 : 0,
              pl: line.length - line.trimStart().length ? 2 : 0,
              overflowWrap: "anywhere",
            }}
          >
            {renderLinkedText(cleanHeading && isHeading ? cleanHeading : trimmed)}
          </Typography>
        );
      })}
    </Stack>
  );
};

const CourseRecommendations = () => {
  const router = useRouter();
  const { user, loading } = useUser();
  const {
    recommendations,
    loading: loadingRecommendations,
    error,
    isAIGenerated,
  } = useCourseRecommendations(user);

  const responseText = recommendations?.responseText || "";

  if (!user && !loading) {
    router.push("/login");
    return null;
  }

  if (loading || loadingRecommendations) {
    return <LoaderTwo text="AI is reading your profile and preparing resources..." />;
  }

  return (
    <PremiumPage sx={{ pb: 4 }}>
      <SectionHeader
        eyebrow="Profile-Based Resources"
        title="Courses, YouTube Channels & Certifications"
        description={
          isAIGenerated
            ? "AI-generated suggestions are based on your quiz results, weak areas, saved skills, and experience."
            : "AI reads your quiz results first, then uses saved skills and experience to create recommendations."
        }
        action={<Sparkles size={24} color="#06B6D4" />}
      />

      {error ? (
        <Box
          sx={{
            borderLeft: "3px solid #F87171",
            bgcolor: "rgba(239,68,68,0.08)",
            px: 2.2,
            py: 1.8,
          }}
        >
          <Typography sx={{ color: "#FCA5A5", fontWeight: 850, lineHeight: 1.6 }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ maxWidth: 980 }}>
          {recommendations?.notice ? (
            <Box
              sx={{
                borderLeft: "3px solid #FBBF24",
                bgcolor: "rgba(251,191,36,0.08)",
                px: 2,
                py: 1.4,
                mb: 2.5,
              }}
            >
              <Typography sx={{ color: "#FDE68A", fontWeight: 800, lineHeight: 1.55 }}>
                {recommendations.notice}
              </Typography>
            </Box>
          ) : null}
          <RecommendationText text={responseText} />
        </Box>
      )}
    </PremiumPage>
  );
};

export default CourseRecommendations;
