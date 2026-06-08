"use client";

import { useState } from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { BrainCircuit, BookOpen, FileText, Target, Plus, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const ACTIONS = [
  {
    Icon: BrainCircuit,
    name: "Take a Quiz",
    href: "/technologies",
    color: "#7C3AED",
  },
  {
    Icon: FileText,
    name: "Resume AI",
    href: "/resumeAnalysis",
    color: "#06B6D4",
  },
  {
    Icon: Target,
    name: "Job Match",
    href: "/jobMatch",
    color: "#22C55E",
  },
  {
    Icon: BookOpen,
    name: "Learning Plan",
    href: "/learning",
    color: "#F59E0B",
  },
];

const QuickActions = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <SpeedDial
      ariaLabel="Quick navigation actions"
      sx={{
        position: "fixed",
        bottom: { xs: 20, md: 28 },
        right: { xs: 16, md: 28 },
        zIndex: 1199,
        "& .MuiSpeedDial-fab": {
          background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
          boxShadow: "0 14px 36px rgba(124,58,237,0.42)",
          width: 54,
          height: 54,
          "&:hover": {
            background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
            boxShadow: "0 18px 44px rgba(124,58,237,0.52)",
          },
        },
        "& .MuiSpeedDialIcon-icon, & .MuiSpeedDialIcon-openIcon": {
          color: "#fff",
        },
      }}
      icon={
        <SpeedDialIcon
          openIcon={<Zap size={22} color="#fff" />}
          icon={<Plus size={22} color="#fff" />}
        />
      }
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      {ACTIONS.map(({ Icon, name, href, color }) => (
        <SpeedDialAction
          key={name}
          icon={<Icon size={19} />}
          tooltipTitle={name}
          tooltipOpen
          onClick={() => {
            setOpen(false);
            router.push(href);
          }}
          sx={{
            "& .MuiSpeedDialAction-fab": {
              bgcolor: `${color}18`,
              color,
              border: `1px solid ${color}44`,
              boxShadow: "none",
              "&:hover": {
                bgcolor: `${color}30`,
                boxShadow: `0 6px 20px ${color}28`,
              },
            },
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              bgcolor: "rgba(5,8,22,0.95)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.76rem",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.40)",
              whiteSpace: "nowrap",
            },
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default QuickActions;
