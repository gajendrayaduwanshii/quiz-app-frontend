import React, { useEffect, useRef } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  BarChart3,
  BookMarked,
  BrainCircuit,
  ClipboardList,
  Code2,
  FileSearch,
  FileText,
  GraduationCap,
  Home,
  Medal,
  Mic2,
  MonitorPlay,
  PieChart,
  Route,
  SearchCheck,
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
  resources: GraduationCap,
  jobmatch: SearchCheck,
  interview: Mic2,
  mockinterview: MonitorPlay,
  interviewhistory: ClipboardList,
  analysis: FileSearch,
  profile: UserRound,
  progress: Medal,
  analytics: PieChart,

  background: BookMarked,
};

const MENU_GROUPS = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "AI Hub", href: "/interactiveLearningHub", icon: "learnquiz" },
    ],
  },
  {
    title: "Assess",
    items: [
      { label: "Skill Quizzes", href: "/technologies", icon: "users" },
      { label: "Mock Interview", href: "/mockInterview", icon: "mockinterview" },
      { label: "Interview History", href: "/interviewHistory", icon: "interviewhistory" },
      { label: "Job Match", href: "/jobMatch", icon: "jobmatch" },
      { label: "Resume AI", href: "/resumeAnalysis", icon: "resume" },
      { label: "Skills Analytics", href: "/skillsAnalytics", icon: "analytics" },
    ],
  },
  {
    title: "Grow",
    items: [
      { label: "Learning Plan", href: "/learning", icon: "learning" },
      { label: "Resource Guide", href: "/courseRecommendations", icon: "resources" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", href: "/profile", icon: "profile" },
      { label: "My Progress", href: "/myProgress", icon: "progress" },
      { label: "Career History", href: "/careerHistory", icon: "background" },
    ],
  },
];

const NavItem = ({ item, open, active, onClose, isMobile }) => {
  const Icon = iconMap[item.icon];

  const listItem = (
    <ListItem
      component={Link}
      href={item.href}
      sx={{
        minHeight: 46,
        color: active ? "#FFFFFF" : "#94A3B8",
        borderRadius: "15px",
        mb: 0.5,
        cursor: "pointer",
        justifyContent: open ? "flex-start" : "center",
        background: active
          ? "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(6,182,212,0.14))"
          : "transparent",
        border: active
          ? "1px solid rgba(255,255,255,0.09)"
          : "1px solid transparent",
        boxShadow: active ? "0 0 32px rgba(124,58,237,0.18)" : "none",
        "&:hover": {
          background: active
            ? "linear-gradient(135deg, rgba(124,58,237,0.34), rgba(6,182,212,0.18))"
            : "rgba(255,255,255,0.06)",
          color: "#FFFFFF",
          transform: "translateX(2px)",
        },
        transition: "all 0.22s ease",
        px: open ? 1.4 : 1,
      }}
      onClick={() => {
        if (isMobile) onClose();
      }}
    >
      <ListItemIcon
        sx={{
          color: "inherit",
          minWidth: "auto",
          mr: open ? 1.5 : 0,
        }}
      >
        <Icon size={19} />
      </ListItemIcon>
      {open && (
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontWeight: active ? 800 : 650,
            fontSize: "0.85rem",
          }}
        />
      )}
    </ListItem>
  );

  if (!open) {
    return (
      <Tooltip title={item.label} placement="right" arrow>
        {listItem}
      </Tooltip>
    );
  }

  return listItem;
};

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, setOpen]);

  return (
    <Drawer
      ref={drawerRef}
      variant="permanent"
      sx={{
        transition: "width 0.28s ease",
        "& .MuiDrawer-paper": {
          width: { xs: open ? 268 : 0, md: open ? 268 : 82 },
          transition: "width 0.28s ease",
          background:
            "linear-gradient(180deg, rgba(10,16,30,0.86), rgba(3,7,18,0.94))",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(28px)",
          boxShadow: "24px 0 80px rgba(0,0,0,0.36)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Brand header ── */}
      <Box
        sx={{
          width: "100%",
          height: 80,
          display: "flex",
          justifyContent: open && isMobile ? "space-between" : "center",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          px: open ? 2 : 1,
          flexShrink: 0,
        }}
      >
        {open ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                boxShadow: "0 0 26px rgba(124,58,237,0.42)",
                flexShrink: 0,
              }}
            >
              <Home size={18} color="#fff" />
            </Box>
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 950, lineHeight: 1, fontSize: "0.96rem" }}>
                SkillSync AI
              </Typography>
              <Typography sx={{ color: "#94A3B8", fontSize: "0.66rem", mt: 0.2 }}>
                Career intelligence
              </Typography>
            </Box>
          </Box>
        ) : (
          <Tooltip title="SkillSync AI" placement="right" arrow>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "13px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                boxShadow: "0 0 24px rgba(124,58,237,0.40)",
              }}
            >
              <Home size={17} color="#fff" />
            </Box>
          </Tooltip>
        )}

        {open && isMobile && (
          <IconButton
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            sx={{
              width: 36,
              height: 36,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
              bgcolor: "rgba(255,255,255,0.06)",
              "&:hover": {
                bgcolor: "rgba(239,68,68,0.14)",
                borderColor: "rgba(248,113,113,0.32)",
              },
            }}
          >
            <X size={17} />
          </IconButton>
        )}
      </Box>

      {/* ── Navigation ── */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1.6,
          px: 1,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(255,255,255,0.10)",
            borderRadius: 999,
          },
        }}
      >
        {MENU_GROUPS.map((group, groupIdx) => (
          <Box key={groupIdx} sx={{ mb: 0.5 }}>
            {/* Group label (only when expanded) */}
            {group.title && open && (
              <Typography
                sx={{
                  fontSize: "0.66rem",
                  fontWeight: 900,
                  color: "#475569",
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  px: 1.4,
                  mb: 0.6,
                  mt: groupIdx > 0 ? 1.2 : 0,
                }}
              >
                {group.title}
              </Typography>
            )}

            {/* Divider when collapsed */}
            {group.title && !open && groupIdx > 0 && (
              <Divider
                sx={{
                  borderColor: "rgba(255,255,255,0.07)",
                  my: 1,
                  mx: 1,
                }}
              />
            )}

            <List disablePadding>
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);
                return (
                  <NavItem
                    key={item.href}
                    item={item}
                    open={open}
                    active={active}
                    isMobile={isMobile}
                    onClose={() => setOpen(false)}
                  />
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* ── Mobile close button ── */}
      {isMobile && open && (
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            p: 2,
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              color: "#fff",
              width: 40,
              height: 40,
              borderRadius: "50%",
              "&:hover": { opacity: 0.88 },
            }}
          >
            <X size={18} />
          </IconButton>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
