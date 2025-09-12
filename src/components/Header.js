"use client";

import { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; 

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const { user, logout } = useAuth(); 

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    setTimeout(() => {
      logout(); 
    }, 100);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sidebarOpen ? 240 : 80}px)`,
        ml: `${sidebarOpen ? 240 : 80}px`,
        transition: "width 0.3s ease, margin-left 0.3s ease",
      }}
    >
      <Toolbar className="header-wrapper" sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)} edge="start" color="inherit">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Dashboard</Typography>
        <Box>
          <IconButton onClick={handleMenuOpen}>
            <Avatar  alt={user?.email ? user.email.toUpperCase() : "User"} src={"/images/default-profile-image.jpg"}  className="profile-img"/>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
