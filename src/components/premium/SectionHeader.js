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
      <Box sx={{ minWidth: 0, width: { xs: "100%", md: "auto" } }}>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              color: "secondary.main",
              letterSpacing: { xs: "0.08em", sm: "0.12em" },
              fontWeight: 800,
              overflowWrap: "anywhere",
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            fontSize: { xs: 24, sm: 28, md: 32 },
            lineHeight: 1.14,
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography sx={{ color: "text.secondary", mt: 0.5, overflowWrap: "anywhere" }}>
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ width: { xs: "100%", md: "auto" }, "& > button, & > a": { width: { xs: "100%", sm: "auto" } } }}>{action}</Box>}
    </Box>
  );
};

export default SectionHeader;
