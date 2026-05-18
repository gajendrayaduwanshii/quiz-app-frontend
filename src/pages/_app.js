// pages/_app.js
import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@/styles/globals.css";
import Layout from "../components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { skillSyncTheme } from "@/styles/skillsyncTheme";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider theme={skillSyncTheme}>
        <Layout>
          <CssBaseline />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}
