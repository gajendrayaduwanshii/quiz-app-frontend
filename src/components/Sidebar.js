import React, { useEffect, useRef } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Dashboard, School, People, Code, Close } from "@mui/icons-material";
import Link from "next/link";

const iconMap = {
  dashboard: <Dashboard />,
  learnquiz: <School />,
  users: <People />,
  coding: <Code />,
};

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Learning", href: "/learning", icon: "learnquiz" },
  { label: "Technologies", href: "/technologies", icon: "users" },
];

const Sidebar = ({ open, setOpen }) => {
  const isMobile = useMediaQuery("(max-width:992px)");
  const drawerRef = useRef(null);

  // Click outside listener (mobile only)
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
          width: isMobile ? (open ? 240 : 0) : open ? 240 : 80,
          transition: "width 0.3s ease",
          backgroundColor: "#f4f4f4",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ width: "100%" }}>
        {/* Logo */}
        <Box
          sx={{
            width: "100%",
            height: "56px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1976d2",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: open ? 24 : 16,
            }}
          >
            {open ? (
              <img
                src="/images/full-logo.png"
                alt="Logo"
                className="main-logo"
              />
            ) : (
              <img
                src="/images/logo-design.png"
                alt="Logo"
                className="main-logo"
              />
            )}
          </Typography>
        </Box>

        <Divider />

        {/* Dynamic Menu Items */}
        <List sx={{ width: "100%" }}>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              href={item.href}
              sx={{
                color: "#1976d2",
                borderRadius: "8px",
                margin: "5px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  "& .MuiListItemIcon-root": { color: "white" },
                },
                transition: "0.3s",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: "auto",
                  marginRight: open ? "16px" : "0",
                }}
              >
                {iconMap[item.icon]}
              </ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Mobile Close Button at Bottom Center */}
      {isMobile && open && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: 2,
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": { backgroundColor: "#155fa0" },
              width: 40,
              height: 40,
              borderRadius: "50%",
            }}
          >
            <Close />
          </IconButton>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
