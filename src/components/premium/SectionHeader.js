import { Box, Typography } from "@mui/material";

const SectionHeader = ({ eyebrow, title, description, action }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: 2.5,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              color: "secondary.main",
              letterSpacing: "0.12em",
              fontWeight: 800,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        {description && (
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
};

export default SectionHeader;
