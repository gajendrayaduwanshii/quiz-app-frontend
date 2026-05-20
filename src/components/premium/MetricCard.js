import { Box, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { ArrowUpRight } from "lucide-react";
import PremiumCard from "./PremiumCard";

const MetricCard = ({
  icon: Icon,
  label,
  value,
  helper,
  progress,
  accent = "#7C3AED",
}) => {
  const cappedProgress = Math.max(0, Math.min(100, Number(progress) || 0));

  return (
    <PremiumCard
      glow={`${accent}33`}
      sx={{
        height: "100%",
        minHeight: 168,
        p: 2.2,
        borderRadius: "18px",
        border: `1px solid ${accent}33`,
        background:
          `linear-gradient(145deg, rgba(255,255,255,0.070), rgba(255,255,255,0.024)), radial-gradient(circle at 100% 0%, ${accent}1F, transparent 34%)`,
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5} sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.35} sx={{ minWidth: 0 }}>
          {Icon && (
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: "14px",
                flex: "0 0 auto",
                display: "grid",
                placeItems: "center",
                color: "#FFFFFF",
                background: `linear-gradient(135deg, ${accent}, rgba(6,182,212,0.85))`,
                boxShadow: `0 16px 34px ${accent}42`,
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              <Icon size={21} />
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 850 }}>
              {label}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mt: 0.45,
                fontWeight: 950,
                lineHeight: 1.08,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: { xs: 20, md: 22 },
              }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>

        {typeof progress === "number" && (
          <Chip
            size="small"
            icon={<ArrowUpRight size={13} />}
            label={`${cappedProgress}%`}
            sx={{
              color: accent,
              bgcolor: `${accent}1F`,
              border: `1px solid ${accent}36`,
              fontWeight: 950,
              flex: "0 0 auto",
            }}
          />
        )}
      </Stack>

      {helper && (
        <Typography variant="body2" sx={{ color: "text.secondary", minHeight: 22 }}>
          {helper}
        </Typography>
      )}

      {typeof progress === "number" && (
        <Box sx={{ mt: 2.2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
            <Typography sx={{ color: "text.secondary", fontSize: 12, fontWeight: 800 }}>
              Signal strength
            </Typography>
            <Typography sx={{ color: accent, fontSize: 12, fontWeight: 950 }}>
              {cappedProgress}/100
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={cappedProgress}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.08)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: `linear-gradient(90deg, ${accent}, #06B6D4)`,
              },
            }}
          />
        </Box>
      )}
    </PremiumCard>
  );
};

export default MetricCard;
