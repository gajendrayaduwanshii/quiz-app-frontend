import { Button } from "@mui/material";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const PremiumButton = ({ children, sx = {}, ...props }) => {
  return (
    <MotionButton
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      variant="contained"
      sx={{
        px: 2.4,
        minWidth: 0,
        borderRadius: "14px",
        color: "#FFFFFF",
        whiteSpace: "normal",
        textAlign: "center",
        lineHeight: 1.25,
        background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
        boxShadow: "0 16px 34px rgba(124,58,237,0.28)",
        "&:hover": {
          background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
          boxShadow: "0 18px 42px rgba(6,182,212,0.34)",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
};

export default PremiumButton;
