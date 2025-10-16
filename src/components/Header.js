"use client";

import { useState } from "react";
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
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery("(max-width:992px)");

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const getPageTitle = () => {
  if (!pathname) return "App"; // fallback

  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/changePassword")) return "Change Password";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/learning")) return "Learning";
  if (pathname.startsWith("/technologies")) return "Technologies";
  if (pathname.startsWith("/interactiveLearningHub")) return "Interactive Learning Hub";
  if (pathname.startsWith("/resumeAnalysis")) return "Your Resume Summary";
  if (pathname.startsWith("/quiz/")) {
    const tech = pathname.split("/quiz/")[1];
    return tech
      ? tech.charAt(0).toUpperCase() + tech.slice(1)
      : "Quiz";
  }
  return "App";
};

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile
          ? "100%"
          : `calc(100% - ${sidebarOpen ? 240 : 80}px)`,
        ml: isMobile ? 0 : `${sidebarOpen ? 240 : 80}px`,
        transition: "width 0.3s ease, margin-left 0.3s ease",
        backgroundColor: "#1976d2",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "56px" }} style={{minHeight:"56px"}}>
        {/* Sidebar toggle */}
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} color="inherit" style={{position:"relative", zIndex: "999"}}>
          <MenuIcon />
        </IconButton>

        {/* Page Title */}
        <Typography variant="h6">{getPageTitle()}</Typography>

        {/* Profile */}
        <Box>
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              alt={user?.email || "User"}
              src={user?.avatar || "/images/default-profile-image.jpg"}
            >
              {!user?.avatar && (user?.email?.[0]?.toUpperCase() || "U")}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); router.push("/profile"); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); router.push("/changePassword"); }}>
              Change Password
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
