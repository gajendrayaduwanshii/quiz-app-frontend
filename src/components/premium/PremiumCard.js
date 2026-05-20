import { Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const PremiumCard = ({
  children,
  sx = {},
  glow = "rgba(124,58,237,0.22)",
  hover = true,
  ...props
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "18px",
        border: "1px solid rgba(148,163,184,0.16)",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.070), rgba(255,255,255,0.026))",
        backdropFilter: "blur(20px)",
        boxShadow: `0 22px 58px rgba(0,0,0,0.32), 0 0 30px ${glow}`,
        transition: "border-color 220ms ease, box-shadow 220ms ease",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.10), transparent 38%, rgba(6,182,212,0.08))",
          opacity: 0.72,
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export default PremiumCard;
