"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Collapse,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  BookOpenCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GraduationCap,
  ListFilter,
  PlayCircle,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { useUser } from "@/customHooks/useUser";
import { useCourseRecommendations } from "@/customHooks/useCourseRecommendations";
import LoaderTwo from "@/components/LoaderTwo";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumPage from "@/components/premium/PremiumPage";
import SectionHeader from "@/components/premium/SectionHeader";

const SECTIONS = [
  {
    title: "Recommended focus from your profile",
    icon: Target,
    color: "#67E8F9",
    fallback: "Your profile focus area will appear here after resources load.",
  },
  {
    title: "Course Suggestions",
    icon: BookOpenCheck,
    color: "#A78BFA",
    fallback: "Course recommendations will appear here.",
  },
  {
    title: "YouTube Channels",
    icon: PlayCircle,
    color: "#F87171",
    fallback: "YouTube learning recommendations will appear here.",
  },
  {
    title: "Certification Suggestions",
    icon: GraduationCap,
    color: "#86EFAC",
    fallback: "Certification recommendations will appear here.",
  },
];

const URL_PATTERN = /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)/g;

const cleanLine = (line = "") =>
  String(line || "")
    .replace(/^[-*]\s*/, "")
    .replace(/^\d+\.\s*/, "")
    .replace(/\*\*/g, "")
    .trim();

const extractFirstUrl = (text = "") => {
  const match = String(text || "").match(URL_PATTERN);
  if (!match?.[0]) return "";
  return /^www\./i.test(match[0]) ? `https://${match[0]}` : match[0];
};

const removeUrls = (text = "") => String(text || "").replace(URL_PATTERN, "").trim();

const splitResourceDetail = (detail = "") => {
  const cleaned = String(detail || "").trim();
  if (!cleaned) return [];

  return cleaned
    .split(/(?=\b(?:Why it fits|What to do|Outcome|Priority|Time|When to take):)/g)
    .map((item) => item.trim().replace(/\s+/g, " "))
    .filter(Boolean);
};

const getDetailValue = (detail = "", label = "") => {
  const match = splitResourceDetail(detail).find((item) =>
    item.toLowerCase().startsWith(`${label.toLowerCase()}:`)
  );
  return match ? match.split(":").slice(1).join(":").trim() : "";
};

const getPriority = (detail = "") => {
  const priority = getDetailValue(detail, "Priority").toLowerCase();
  if (priority.includes("high")) return "High";
  if (priority.includes("medium")) return "Medium";
  if (priority.includes("low")) return "Low";
  return "Any";
};

const matchesSearch = (item, query) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return `${item.title} ${item.detail}`.toLowerCase().includes(normalizedQuery);
};

const parseRecommendationSections = (text) => {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const sectionMap = SECTIONS.reduce((acc, section) => {
    acc[section.title] = [];
    return acc;
  }, {});
  let currentTitle = SECTIONS[0].title;

  lines.forEach((line) => {
    const heading = cleanLine(line.replace(/^#+\s*/, ""));
    const matchedSection = SECTIONS.find(
      (section) => section.title.toLowerCase() === heading.toLowerCase()
    );

    if (matchedSection) {
      currentTitle = matchedSection.title;
      return;
    }

    sectionMap[currentTitle].push(line);
  });

  return SECTIONS.map((section) => ({
    ...section,
    items: sectionMap[section.title] || [],
  }));
};

const buildResourceItems = (items) => {
  const resources = [];
  let current = null;

  items.forEach((line) => {
    const url = extractFirstUrl(line);
    const text = cleanLine(removeUrls(line));
    const startsResource = /^\d+\.\s/.test(line) || (/^[A-Z0-9]/.test(text) && text.length > 12 && !current);

    if (startsResource) {
      if (current) resources.push(current);
      const [titlePart, ...detailParts] = text.split(/\s+-\s+|\s+–\s+|\s+:\s+/);
      current = {
        title: titlePart || text,
        detail: detailParts.join(" - "),
        url,
      };
      return;
    }

    if (!current) {
      current = { title: text, detail: "", url };
      return;
    }

    if (url && !current.url) current.url = url;
    if (text) current.detail = [current.detail, text].filter(Boolean).join(" ");
  });

  if (current) resources.push(current);

  return resources.filter((item) => item.title || item.detail || item.url);
};

const ProfileSignalBar = ({ user }) => {
  const skills = Array.isArray(user?.skills) ? user.skills : [];
  const quizCount = Array.isArray(user?.quizResult) ? user.quizResult.length : 0;
  const role = user?.currentJobTitle || user?.desiredJobType || "Role pending";

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2.5 }}>
      <Chip label={role} sx={{ bgcolor: "rgba(6,182,212,0.12)", color: "#CFFAFE", fontWeight: 850 }} />
      <Chip label={`${skills.length} skills`} sx={{ bgcolor: "rgba(34,197,94,0.12)", color: "#BBF7D0", fontWeight: 850 }} />
      <Chip label={`${user?.yearsExperience || 0} years exp`} sx={{ bgcolor: "rgba(167,139,250,0.14)", color: "#DDD6FE", fontWeight: 850 }} />
      <Chip label={`${quizCount} quizzes`} sx={{ bgcolor: "rgba(245,158,11,0.12)", color: "#FDE68A", fontWeight: 850 }} />
    </Stack>
  );
};

const ResourceCard = ({ item, index, section }) => {
  const [open, setOpen] = useState(index < 2);
  const detailRows = splitResourceDetail(item.detail);
  const priority = getPriority(item.detail);
  const time = getDetailValue(item.detail, "Time");

  return (
    <Box
      sx={{
        p: 1.45,
        borderRadius: "14px",
        border: "1px solid rgba(148,163,184,0.14)",
        bgcolor: "rgba(255,255,255,0.04)",
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "flex-start" }}>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ mb: 0.55 }}>
            {priority !== "Any" ? (
              <Chip size="small" label={priority} sx={{ bgcolor: `${section.color}22`, color: section.color, fontWeight: 900 }} />
            ) : null}
            {time ? (
              <Chip size="small" label={time} sx={{ bgcolor: "rgba(255,255,255,0.07)", color: "#CBD5E1", fontWeight: 800 }} />
            ) : null}
          </Stack>
          <Typography sx={{ color: "#fff", fontWeight: 900, overflowWrap: "anywhere" }}>
            {item.title}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0.8} sx={{ flex: "0 0 auto" }}>
          {detailRows.length ? (
            <Button
              type="button"
              size="small"
              onClick={() => setOpen((prev) => !prev)}
              endIcon={open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              sx={{ color: "text.secondary", fontWeight: 850 }}
            >
              Details
            </Button>
          ) : null}
          {item.url ? (
            <Button
              component="a"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              endIcon={<ExternalLink size={14} />}
              sx={{ color: section.color, fontWeight: 900 }}
            >
              Open
            </Button>
          ) : null}
        </Stack>
      </Stack>

      {detailRows.length ? (
        <Collapse in={open}>
          <Stack spacing={0.7} sx={{ mt: 1 }}>
            {detailRows.map((detail) => {
              const [label, ...valueParts] = detail.split(":");
              const value = valueParts.join(":").trim();

              return (
                <Box
                  key={detail}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "104px minmax(0, 1fr)" },
                    gap: { xs: 0.25, sm: 1 },
                  }}
                >
                  {value ? (
                    <Typography sx={{ color: section.color, fontSize: "0.76rem", fontWeight: 950 }}>
                      {label}
                    </Typography>
                  ) : null}
                  <Typography sx={{ color: "text.secondary", fontSize: "0.88rem", lineHeight: 1.5, overflowWrap: "anywhere" }}>
                    {value || detail}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Collapse>
      ) : null}
    </Box>
  );
};

const RecommendationSection = ({ section, searchQuery, priorityFilter }) => {
  const Icon = section.icon;
  const isFocus = section.title === "Recommended focus from your profile";
  const resourceItems = isFocus
    ? []
    : buildResourceItems(section.items).filter((item) => {
        const priority = getPriority(item.detail);
        const priorityMatches = priorityFilter === "All" || priority === priorityFilter;
        return priorityMatches && matchesSearch(item, searchQuery);
      });
  const focusText = section.items.map(cleanLine).join(" ");

  return (
    <PremiumCard hover={false} sx={{ p: { xs: 2, md: 2.4 }, borderRadius: "18px", height: "100%" }}>
      <Stack direction="row" spacing={1.1} alignItems="center" sx={{ mb: 1.6 }}>
        <Box sx={{ color: section.color, display: "flex" }}>
          <Icon size={21} />
        </Box>
        <Typography sx={{ fontWeight: 950, fontSize: "1.08rem", overflowWrap: "anywhere" }}>
          {section.title}
        </Typography>
      </Stack>

      {isFocus ? (
        <Typography sx={{ color: "#CBD5E1", lineHeight: 1.7, overflowWrap: "anywhere" }}>
          {focusText || section.fallback}
        </Typography>
      ) : (
        <Stack spacing={1.2}>
          {(resourceItems.length ? resourceItems : [{ title: section.fallback, detail: "", url: "" }]).map((item, index) => (
            <ResourceCard key={`${item.title}-${index}`} item={item} index={index} section={section} />
          ))}
        </Stack>
      )}
    </PremiumCard>
  );
};

const CourseRecommendations = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const { user, loading } = useUser();
  const {
    recommendations,
    loading: loadingRecommendations,
    error,
  } = useCourseRecommendations(user);

  const responseText = recommendations?.responseText || "";
  const sections = useMemo(() => parseRecommendationSections(responseText), [responseText]);
  const sectionCounts = useMemo(
    () =>
      sections.reduce((acc, section) => {
        acc[section.title] = section.title === "Recommended focus from your profile"
          ? 1
          : buildResourceItems(section.items).length;
        return acc;
      }, {}),
    [sections]
  );
  const visibleSections = activeSection === "All"
    ? sections
    : sections.filter((section) => section.title === activeSection);
  const totalResources = Object.entries(sectionCounts)
    .filter(([title]) => title !== "Recommended focus from your profile")
    .reduce((sum, [, count]) => sum + count, 0);

  if (!user && !loading) {
    router.push("/login");
    return null;
  }

  if (loading || loadingRecommendations) {
    return <LoaderTwo text="Live AI is preparing your resources..." />;
  }

  return (
    <PremiumPage sx={{ pb: 4 }}>
      <SectionHeader
        eyebrow="Profile-Based Resources"
        title="Courses, YouTube Channels & Certifications"
        description="Live AI recommendations generated from your saved profile, skills, role, experience, and quiz signals."
        action={<Chip icon={<Sparkles size={15} />} label="Live AI" sx={{ fontWeight: 900 }} />}
      />
      <ProfileSignalBar user={user} />

      <PremiumCard hover={false} sx={{ p: { xs: 1.5, md: 1.8 }, mb: 2.4, borderRadius: "18px" }}>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.2} alignItems={{ xs: "stretch", md: "center" }}>
            <TextField
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search course, channel, certification..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={17} color="#94A3B8" />
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flex: "0 0 auto" }}>
              {["All", "High", "Medium", "Low"].map((priority) => (
                <Button
                  key={priority}
                  type="button"
                  variant={priorityFilter === priority ? "contained" : "outlined"}
                  onClick={() => setPriorityFilter(priority)}
                  startIcon={priority === "All" ? <ListFilter size={15} /> : null}
                  sx={{
                    minHeight: 40,
                    color: priorityFilter === priority ? "#fff" : "text.secondary",
                    borderColor: "rgba(148,163,184,0.22)",
                  }}
                >
                  {priority}
                </Button>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {["All", ...SECTIONS.map((section) => section.title)].map((title) => {
              const active = activeSection === title;
              const count = title === "All" ? totalResources : sectionCounts[title];

              return (
                <Chip
                  key={title}
                  clickable
                  onClick={() => setActiveSection(title)}
                  label={title === "Recommended focus from your profile" ? "Focus" : `${title}${title === "All" ? ` (${count})` : count ? ` (${count})` : ""}`}
                  sx={{
                    color: active ? "#fff" : "#CBD5E1",
                    bgcolor: active ? "rgba(124,58,237,0.38)" : "rgba(255,255,255,0.06)",
                    border: active ? "1px solid rgba(167,139,250,0.55)" : "1px solid rgba(148,163,184,0.14)",
                    fontWeight: 900,
                  }}
                />
              );
            })}
          </Stack>
        </Stack>
      </PremiumCard>

      {error ? (
        <Box
          sx={{
            borderLeft: "3px solid #F87171",
            bgcolor: "rgba(239,68,68,0.08)",
            px: 2.2,
            py: 1.8,
          }}
        >
          <Typography sx={{ color: "#FCA5A5", fontWeight: 850, lineHeight: 1.6, overflowWrap: "anywhere" }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ minWidth: 0 }}>
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
              <Typography sx={{ color: "#FDE68A", fontWeight: 800, lineHeight: 1.55, overflowWrap: "anywhere" }}>
                {recommendations.notice}
              </Typography>
            </Box>
          ) : null}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
              gap: 2,
            }}
          >
            {visibleSections.map((section) => (
              <RecommendationSection
                key={section.title}
                section={section}
                searchQuery={searchQuery}
                priorityFilter={priorityFilter}
              />
            ))}
          </Box>
        </Box>
      )}
    </PremiumPage>
  );
};

export default CourseRecommendations;
