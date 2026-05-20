import React, { useEffect, useRef } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  BarChart3,
  BrainCircuit,
  Code2,
  FileSearch,
  FileText,
  Home,
  Mic2,
  Route,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconMap = {
  dashboard: BarChart3,
  learnquiz: BrainCircuit,
  users: Code2,
  resume: FileText,
  learning: Route,
  interview: Mic2,
  analysis: FileSearch,
  profile: UserRound,
};

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "AI Hub", href: "/interactiveLearningHub", icon: "learnquiz" },
  { label: "Skill Quizzes", href: "/technologies", icon: "users" },
  { label: "Learning Plan", href: "/learning", icon: "learning" },
  { label: "Resume AI", href: "/resumeAnalysis", icon: "resume" },
  { label: "Voice AI", href: "/voiceInterviewAI", icon: "interview" },
  { label: "Profile", href: "/profile", icon: "profile" },
];

const Sidebar = ({ open, setOpen }) => {
  const isMobile = useMediaQuery("(max-width:992px)");
  const drawerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, setOpen]);

  return (
    <Drawer
      ref={drawerRef}
      variant="permanent"
      sx={{
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: isMobile ? (open ? 272 : 0) : open ? 272 : 84,
          transition: "width 0.3s ease",
          background:
            "linear-gradient(180deg, rgba(11,17,32,0.82), rgba(3,7,18,0.92))",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(28px)",
          boxShadow: "24px 0 80px rgba(0,0,0,0.42)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            height: 84,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            px: open ? 2 : 1,
          }}
        >
          {open ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "16px",
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                  boxShadow: "0 0 28px rgba(124,58,237,0.4)",
                }}
              >
                <Home size={19} color="#fff" />
              </Box>
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 950, lineHeight: 1 }}>
                  SkillSync AI
                </Typography>
                <Typography sx={{ color: "#94A3B8", fontSize: 11 }}>
                  Career intelligence
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "15px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                boxShadow: "0 0 28px rgba(124,58,237,0.4)",
              }}
            >
              <Home size={19} color="#fff" />
            </Box>
          )}
        </Box>

        <List sx={{ width: "100%", px: 1.2, py: 2 }}>
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <ListItem
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  minHeight: 50,
                  color: active ? "#FFFFFF" : "#94A3B8",
                  borderRadius: "17px",
                  mb: 0.7,
                  cursor: "pointer",
                  justifyContent: open ? "flex-start" : "center",
                  background: active
                    ? "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(6,182,212,0.16))"
                    : "transparent",
                  border: active
                    ? "1px solid rgba(255,255,255,0.10)"
                    : "1px solid transparent",
                  boxShadow: active ? "0 0 38px rgba(124,58,237,0.22)" : "none",
                  "&:hover": {
                    background: "rgba(255,255,255,0.07)",
                    color: "#FFFFFF",
                    transform: "translateX(2px)",
                  },
                  transition: "all 0.25s ease",
                }}
                onClick={() => {
                  if (isMobile) setOpen(false);
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: "auto",
                    mr: open ? 1.7 : 0,
                  }}
                >
                  <Icon size={20} />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 800 : 650,
                      fontSize: 14,
                    }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>

        {open && (
          <Box sx={{ px: 2, mt: 1 }}>
            <Box
              sx={{
                p: 2.1,
                borderRadius: "20px",
                border: "1px solid rgba(103,232,249,0.18)",
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.20), rgba(6,182,212,0.10))",
                boxShadow: "0 18px 48px rgba(6,182,212,0.10)",
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#94A3B8", mb: 0.5 }}>
                AI Readiness
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 950 }}>82%</Typography>
              <Typography sx={{ fontSize: 12, color: "#94A3B8" }}>
                Keep improving weak topics.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {isMobile && open && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            p: 2,
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              color: "#fff",
              width: 42,
              height: 42,
              borderRadius: "50%",
            }}
          >
            <X size={20} />
          </IconButton>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
