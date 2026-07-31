import { Box, Chip, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle2, FileSearch, Sparkles, Target } from "lucide-react";
import PremiumCard from "./PremiumCard";

const iconMap = [BrainCircuit, FileSearch, Target, Sparkles, CheckCircle2];

const AIActivityFeed = ({ items = [] }) => {
  const feedItems = items.length
    ? items
    : [
        { title: "Profile signal calibrated", detail: "Skill and resume readiness are ready for review.", tag: "AI" },
        { title: "Learning route prepared", detail: "Next actions will adapt after every quiz attempt.", tag: "Growth" },
        { title: "Resume intelligence online", detail: "Upload or refresh your resume to update ATS signals.", tag: "Resume" },
      ];

  return (
    <PremiumCard hover={false} glow="rgba(6,182,212,0.16)" sx={{ p: 2.4, height: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: "1.125rem" }}>AI Activity Feed</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>Live product signals and recommendations</Typography>
        </Box>
        <Chip label="Live" size="small" sx={{ color: "#86EFAC", bgcolor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.24)", fontWeight: 900 }} />
      </Stack>
      <Stack spacing={1.2}>
        {feedItems.map((item, index) => {
          const Icon = iconMap[index % iconMap.length];
          return (
            <Box
              component={motion.div}
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              sx={{
                display: "flex",
                gap: 1.2,
                p: 1.35,
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(255,255,255,0.035)",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "13px",
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg, rgba(124,58,237,0.95), rgba(6,182,212,0.86))",
                  flex: "0 0 auto",
                }}
              >
                <Icon size={17} color="#fff" />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <Typography sx={{ fontWeight: 900, fontSize: "0.84375rem" }}>{item.title}</Typography>
                  <Chip label={item.tag || "AI"} size="small" sx={{ height: 20, fontSize: "0.625rem", bgcolor: "rgba(6,182,212,0.10)", color: "#CFFAFE" }} />
                </Stack>
                <Typography sx={{ color: "text.secondary", fontSize: "0.78125rem" }}>{item.detail}</Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </PremiumCard>
  );
};

export default AIActivityFeed;
