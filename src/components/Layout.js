'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@mui/material";
import HeaderSidebar from "./HeaderSidebar";
import AICopilot from "./premium/AICopilot";
import CommandPalette from "./premium/CommandPalette";
import QuickActions from "./QuickActions";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children }) {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:992px)");
  const { user } = useAuth();

  // Initialize sidebar open state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update sidebar state if screen resizes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Routes that should NOT use the layout
  const noLayoutRoutes = ['/', '/login', '/registration', '/forgot-password', '/otp-verification'];

  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="skillsync-shell">
      <div className="skillsync-glow-grid" />
      <CommandPalette />
      <HeaderSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        {children}
      </HeaderSidebar>
      {user && <AICopilot />}
      {user && <QuickActions />}
    </div>
  );
}
