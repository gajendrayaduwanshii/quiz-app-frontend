'use client';

import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

const HeaderSidebar = ({ children, sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  return (
    <>
      {!isLoginPage && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      {!isLoginPage && <Sidebar open={sidebarOpen} />}
      <Box sx={{
        padding: isLoginPage ? "0" : "90px 20px",
        marginLeft: isLoginPage ? "0" : (sidebarOpen ? "240px" : "80px"),
        transition: "margin-left 0.3s ease",
      }}>
        {children}
      </Box>
    </>
  );
}

export default HeaderSidebar;
