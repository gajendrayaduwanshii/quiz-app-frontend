'use client';

import { usePathname } from "next/navigation";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useRef } from "react";

const HeaderSidebar = ({ children, sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";
  const isMobile = useMediaQuery("(max-width:992px)");
  const containerRef = useRef(null);

  // Click outside to close sidebar (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, setSidebarOpen]);

  return (
    <Box ref={containerRef}>
      {!isLoginPage && (
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}
      {!isLoginPage && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          padding: isLoginPage ? "0" : { xs: "92px 14px 102px", md: "104px 28px 42px" },
          marginLeft: isMobile
            ? "0"
            : isLoginPage
            ? "0"
            : sidebarOpen
            ? "272px"
            : "84px",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HeaderSidebar;
