'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import HeaderSidebar from "./HeaderSidebar";

export default function Layout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Define routes that should NOT use the layout
  const noLayoutRoutes = ['/login', '/registration'];

  // If current path matches one of them, return children only
  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Otherwise, render layout with sidebar/header
  return (
    <HeaderSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      {children}
    </HeaderSidebar>
  );
}
