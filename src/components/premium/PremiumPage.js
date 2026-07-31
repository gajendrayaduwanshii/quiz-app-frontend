import { Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const PremiumPage = ({ children, dense = false, sx = {}, ...props }) => (
  <MotionBox
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    sx={{
      position: "relative",
      width: "100%",
      maxWidth: "1560px",
      minWidth: 0,
      mx: "auto",
      pb: dense ? 2 : 5,
      overflowX: "hidden",
      "&::before": {
        content: '""',
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(circle at 18% 8%, rgba(124,58,237,0.16), transparent 28%), radial-gradient(circle at 88% 16%, rgba(6,182,212,0.13), transparent 26%)",
        zIndex: -1,
      },
      ...sx,
    }}
    {...props}
  >
    {children}
  </MotionBox>
);

export default PremiumPage;
