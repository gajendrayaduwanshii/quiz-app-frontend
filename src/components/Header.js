"use client";

import { useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useMediaQuery,
  Chip,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Bell, Command, LogOut, Menu as MenuIcon, Search, Settings, Sparkles, UserRound } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery("(max-width:992px)");

  const searchOptions = useMemo(
    () => [
      {
        title: "Dashboard",
        description: "Career overview and performance cards",
        href: "/dashboard",
        keywords: "dashboard home ats score analytics career readiness",
      },
      {
        title: "AI Learning Hub",
        description: "Learning, quizzes, logical questions, resume tools",
        href: "/interactiveLearningHub",
        keywords: "learning hub ai study roadmap suggestions",
      },
      {
        title: "Learning Suggestions",
        description: "Personalized roadmap and weekly sprint",
        href: "/learning",
        keywords: "learning suggestions roadmap daily goals practice",
      },
      {
        title: "Skill Quizzes",
        description: "Choose HTML, CSS, and other skill assessments",
        href: "/technologies",
        keywords: "quiz quizzes skills html css javascript react assessment",
      },
      {
        title: "HTML Quiz",
        description: "Start the HTML skill assessment",
        href: "/quiz/html",
        keywords: "html quiz assessment frontend",
      },
      {
        title: "CSS Quiz",
        description: "Start the CSS skill assessment",
        href: "/quiz/css",
        keywords: "css quiz assessment frontend",
      },
      {
        title: "Resume AI",
        description: "Analyze resume and improve ATS readiness",
        href: "/resumeAnalysis",
        keywords: "resume ai ats analyzer cv keywords",
      },
      {
        title: "Job Match",
        description: "Compare saved profile with a target job description",
        href: "/jobMatch",
        keywords: "job match apply application jd role fit missing skills keywords",
      },
      {
        title: "Profile",
        description: "Update skills, education, work experience, awards",
        href: "/profile",
        keywords: "profile skills education work experience certifications awards",
      },
      {
        title: "Security",
        description: "Change account password",
        href: "/changePassword",
        keywords: "password security change",
      },
    ],
    []
  );

  const filteredSearchOptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return searchOptions.slice(0, 5);

    return searchOptions
      .filter((option) => {
        const haystack = `${option.title} ${option.description} ${option.keywords}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [searchOptions, searchQuery]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };
  const goToSearchResult = (href) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const firstResult = filteredSearchOptions[0];
    if (firstResult) {
      goToSearchResult(firstResult.href);
    }
  };

  const getPageTitle = () => {
    if (!pathname) return "SkillSync AI";
    if (pathname.startsWith("/profile")) return "Profile Intelligence";
    if (pathname.startsWith("/changePassword")) return "Security";
    if (pathname.startsWith("/dashboard")) return "Command Center";
    if (pathname.startsWith("/learning")) return "Learning Hub";
    if (pathname.startsWith("/technologies")) return "Skill Quizzes";
    if (pathname.startsWith("/interactiveLearningHub")) return "AI Learning Hub";
    if (pathname.startsWith("/resumeAnalysis")) return "Resume Intelligence";
    if (pathname.startsWith("/jobMatch")) return "Job Match";
    if (pathname.startsWith("/quiz/")) {
      const tech = decodeURIComponent(pathname.split("/quiz/")[1] || "Quiz");
      return `${tech.charAt(0).toUpperCase() + tech.slice(1)} Assessment`;
    }
    return "SkillSync AI";
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          xs: "100%",
          md: `calc(100% - ${sidebarOpen ? 272 : 84}px)`,
        },
        ml: {
          xs: 0,
          md: `${sidebarOpen ? 272 : 84}px`,
        },
        transition: "width 0.3s ease, margin-left 0.3s ease",
        px: { xs: 1, md: 2.4 },
        pt: { xs: 1, md: 1.5 },
        background: "transparent",
        pointerEvents: "none",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          minHeight: "68px !important",
          px: { xs: 1.1, md: 2 },
          borderRadius: { xs: "20px", md: "24px" },
          border: "1px solid rgba(255,255,255,0.10)",
          background:
            "linear-gradient(135deg, rgba(11,17,32,0.78), rgba(3,7,18,0.70))",
          backdropFilter: "blur(26px)",
          boxShadow: "0 20px 70px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)",
          pointerEvents: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              bgcolor: "rgba(255,255,255,0.04)",
            }}
          >
            <MenuIcon size={20} />
          </IconButton>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {getPageTitle()}
            </Typography>
            {!isMobile && (
              <Typography sx={{ color: "text.secondary", fontSize: 12, display: "flex", alignItems: "center", gap: 0.7 }}>
                <Sparkles size={12} color="#06B6D4" /> AI-powered career, resume, and learning intelligence
              </Typography>
            )}
          </Box>
        </Box>

        {!isMobile && (
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              position: "relative",
              flex: 1,
              maxWidth: 420,
              mx: 2,
              height: 42,
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.08)",
              bgcolor: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              px: 1.6,
              color: "text.secondary",
              transition: "border-color 180ms ease, box-shadow 180ms ease",
              "&:focus-within": {
                borderColor: "rgba(6,182,212,0.45)",
                boxShadow: "0 0 28px rgba(6,182,212,0.16)",
              },
            }}
          >
            <Search size={17} />
            <InputBase
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => window.setTimeout(() => setSearchOpen(false), 140)}
              placeholder="Search skills, quizzes, resumes..."
              inputProps={{ "aria-label": "Search SkillSync AI" }}
              sx={{
                flex: 1,
                color: "#fff",
                fontSize: 13,
                "& input::placeholder": {
                  color: "#94A3B8",
                  opacity: 1,
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 0.8,
                py: 0.35,
                borderRadius: "9px",
                color: "text.secondary",
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(255,255,255,0.04)",
                fontSize: 11,
                fontWeight: 850,
              }}
            >
              <Command size={12} /> K
            </Box>
            {searchOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: 52,
                  left: 0,
                  right: 0,
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(11,17,32,0.96)",
                  backdropFilter: "blur(22px)",
                  boxShadow: "0 24px 70px rgba(0,0,0,0.42), 0 0 36px rgba(6,182,212,0.12)",
                  overflow: "hidden",
                  zIndex: 20,
                }}
              >
                <List dense disablePadding>
                  {filteredSearchOptions.length ? (
                    filteredSearchOptions.map((option) => (
                      <ListItemButton
                        key={option.href}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => goToSearchResult(option.href)}
                        sx={{
                          alignItems: "flex-start",
                          gap: 1,
                          py: 1.15,
                          px: 1.5,
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          "&:last-of-type": { borderBottom: 0 },
                          "&:hover": {
                            bgcolor: "rgba(124,58,237,0.16)",
                          },
                        }}
                      >
                        <Search size={15} style={{ marginTop: 5, color: "#06B6D4" }} />
                        <ListItemText
                          primary={option.title}
                          secondary={option.description}
                          primaryTypographyProps={{
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                          secondaryTypographyProps={{
                            color: "#94A3B8",
                            fontSize: 12,
                          }}
                        />
                      </ListItemButton>
                    ))
                  ) : (
                    <Typography sx={{ color: "text.secondary", px: 1.6, py: 1.4, fontSize: 13 }}>
                      No results found.
                    </Typography>
                  )}
                </List>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!isMobile && (
            <Chip
              icon={<Sparkles size={14} />}
              label="AI Online"
              size="small"
              sx={{
                color: "#fff",
                border: "1px solid rgba(34,197,94,0.35)",
                bgcolor: "rgba(34,197,94,0.10)",
              }}
            />
          )}
          <IconButton sx={{ color: "#94A3B8" }}>
            <Bell size={19} />
          </IconButton>
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              alt={user?.email || "User"}
              src={user?.avatar || "/images/default-profile-image.jpg"}
              sx={{
                width: 38,
                height: 38,
                border: "2px solid rgba(6,182,212,0.45)",
                boxShadow: "0 0 24px rgba(6,182,212,0.18)",
              }}
            >
              {!user?.avatar && (user?.email?.[0]?.toUpperCase() || "U")}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(11,17,32,0.96)",
                backdropFilter: "blur(18px)",
              },
            }}
          >
            <MenuItem onClick={() => { handleMenuClose(); router.push("/profile"); }}>
              <UserRound size={17} style={{ marginRight: 10 }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); router.push("/changePassword"); }}>
              <Settings size={17} style={{ marginRight: 10 }} /> Change Password
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogOut size={17} style={{ marginRight: 10 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
