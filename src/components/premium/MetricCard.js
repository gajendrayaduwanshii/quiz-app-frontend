import { Box, LinearProgress, Typography } from "@mui/material";
import PremiumCard from "./PremiumCard";

const MetricCard = ({
  icon: Icon,
  label,
  value,
  helper,
  progress,
  accent = "#7C3AED",
}) => {
  return (
    <PremiumCard glow={`${accent}33`} sx={{ height: "100%", p: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        {Icon && (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "16px",
              display: "grid",
              placeItems: "center",
              color: "#FFFFFF",
              background: `linear-gradient(135deg, ${accent}, rgba(6,182,212,0.85))`,
              boxShadow: `0 14px 28px ${accent}40`,
            }}
          >
            <Icon size={21} />
          </Box>
        )}
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ mb: 0.5, fontWeight: 800 }}>
        {value}
      </Typography>

      {helper && (
        <Typography variant="body2" sx={{ color: "text.secondary", minHeight: 22 }}>
          {helper}
        </Typography>
      )}

      {typeof progress === "number" && (
        <LinearProgress
          variant="determinate"
          value={Math.max(0, Math.min(100, progress))}
          sx={{
            mt: 2,
            height: 7,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.08)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
              background: `linear-gradient(90deg, ${accent}, #06B6D4)`,
            },
          }}
        />
      )}
    </PremiumCard>
  );
};

export default MetricCard;
