import { Box, Typography } from "@mui/material";

const ProgressRing = ({
  value = 0,
  size = 112,
  thickness = 12,
  label = "score",
  accent = "#06B6D4",
  sx = {},
}) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const innerSize = size - thickness * 2;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: `conic-gradient(${accent} 0deg, ${accent} ${safeValue * 3.6}deg, rgba(255,255,255,0.08) ${safeValue * 3.6}deg, rgba(255,255,255,0.08) 360deg)`,
        boxShadow: `0 20px 54px ${accent}24`,
        flex: "0 0 auto",
        ...sx,
      }}
    >
      <Box
        sx={{
          width: innerSize,
          height: innerSize,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(5,8,22,0.95)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ color: "#fff", fontSize: size > 90 ? 28 : 20, fontWeight: 950, lineHeight: 1 }}>
            {safeValue}%
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 11, fontWeight: 850 }}>
            {label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressRing;
