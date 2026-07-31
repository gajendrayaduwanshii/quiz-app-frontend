import React from "react";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { BriefcaseBusiness, CalendarDays, MapPin, TrendingUp } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import SectionHeader from "@/components/premium/SectionHeader";

const WorkExperienceSectionPremium = ({ workExperiences = [] }) => {
  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return "N/A";
    const start = new Date(startDate);
    const end = !endDate || endDate === "Present" ? new Date() : new Date(endDate);
    const diffDays = Math.max(0, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""}${months ? ` ${months} mo` : ""}`;
    return `${months || 1} month${months > 1 ? "s" : ""}`;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <SectionHeader
        eyebrow="Experience"
        title="Work Experiences"
        description="Professional history, role duration, and career momentum."
      />

      <Grid container spacing={2.2}>
        {workExperiences?.length ? (
          workExperiences.map((job, index) => {
            const accent = ["#7C3AED", "#06B6D4", "#22C55E", "#F59E0B"][index % 4];
            const isCurrent = !job.endDate || job.endDate === "Present";
            const title = job.jobTitle || job.title || "Job Title";
            const description = job.jobDescription || job.description;

            return (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={`${title}-${index}`}>
                <PremiumCard glow={`${accent}33`} sx={{ p: 2.6, height: "100%" }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: "18px",
                        display: "grid",
                        placeItems: "center",
                        background: `linear-gradient(135deg, ${accent}, #06B6D4)`,
                        boxShadow: `0 18px 38px ${accent}42`,
                        flex: "0 0 auto",
                      }}
                    >
                      <BriefcaseBusiness size={23} color="#fff" />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900, lineHeight: 1.2 }}>
                        {title}
                      </Typography>
                      <Typography sx={{ color: "text.secondary", fontSize: "0.875rem", mt: 0.4 }}>
                        {job.company || "Company"}
                      </Typography>
                    </Box>
                    <Chip
                      label={isCurrent ? "Current" : "Past"}
                      size="small"
                      sx={{
                        color: isCurrent ? "#22C55E" : "#94A3B8",
                        bgcolor: isCurrent ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.05)",
                      }}
                    />
                  </Stack>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "18px",
                      border: `1px solid ${accent}35`,
                      background: `linear-gradient(135deg, ${accent}1f, rgba(6,182,212,0.08))`,
                      mb: 2,
                    }}
                  >
                    <Typography sx={{ color: accent, fontWeight: 900, fontSize: "1.5625rem" }}>
                      {calculateDuration(job.startDate, job.endDate)}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                      {isCurrent ? "Active role duration" : "Completed role duration"}
                    </Typography>
                  </Box>

                  <Stack spacing={1.1}>
                    <Chip
                      icon={<CalendarDays size={15} />}
                      label={`${job.startDate || "N/A"} - ${job.endDate || "Present"}`}
                      sx={{ justifyContent: "flex-start", color: "#fff" }}
                    />
                    {job.location && (
                      <Chip
                        icon={<MapPin size={15} />}
                        label={job.location}
                        sx={{ justifyContent: "flex-start", color: "#fff" }}
                      />
                    )}
                    <Chip
                      icon={<TrendingUp size={15} />}
                      label={isCurrent ? "Active growth signal" : "Experience signal"}
                      sx={{ justifyContent: "flex-start", color: "#fff" }}
                    />
                  </Stack>

                  {description && (
                    <Typography sx={{ color: "text.secondary", mt: 2, fontSize: "0.875rem", lineHeight: 1.6 }}>
                      {description}
                    </Typography>
                  )}
                </PremiumCard>
              </Grid>
            );
          })
        ) : (
          <Grid item size={{ xs: 12 }}>
            <PremiumCard hover={false} sx={{ p: 3 }}>
              <Typography sx={{ color: "text.secondary" }}>No work experience added yet.</Typography>
            </PremiumCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default WorkExperienceSectionPremium;
