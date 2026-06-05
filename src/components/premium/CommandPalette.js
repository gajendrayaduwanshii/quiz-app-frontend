import { useEffect, useMemo, useState } from "react";
import { Box, Dialog, InputBase, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, Command, FileSearch, LayoutDashboard, Search, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

const options = [
  { title: "Dashboard", description: "Open command center", href: "/dashboard", icon: LayoutDashboard },
  { title: "AI Learning Hub", description: "Open learning, quiz, resume hub", href: "/interactiveLearningHub", icon: BrainCircuit },
  { title: "Skill Quizzes", description: "Choose a skill assessment", href: "/technologies", icon: Command },
  { title: "Resume Analyzer", description: "Analyze ATS and skill gaps", href: "/resumeAnalysis", icon: FileSearch },
  { title: "Profile Settings", description: "Edit profile, skills, resume", href: "/profile", icon: UserRound },
];

const CommandPalette = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(normalized));
  }, [query]);

  const go = (href) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, y: 18, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 18, scale: 0.98 },
            sx: {
              width: { xs: "calc(100vw - 24px)", sm: "100%" },
              m: { xs: 1.5, sm: 4 },
              borderRadius: { xs: "18px", sm: "24px" },
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(5,8,22,0.96)",
              boxShadow: "0 34px 100px rgba(0,0,0,0.62), 0 0 60px rgba(124,58,237,0.18)",
              backdropFilter: "blur(26px)",
              overflow: "hidden",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Search size={19} color="#06B6D4" />
            <InputBase
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search actions, pages, tools..."
              sx={{ flex: 1, minWidth: 0, color: "#fff" }}
            />
            <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Esc</Typography>
          </Box>
          <List disablePadding sx={{ p: 1 }}>
            {filtered.map((item) => {
              const Icon = item.icon;
              return (
                <ListItemButton key={item.href} onClick={() => go(item.href)} sx={{ borderRadius: "16px", py: 1.25, "&:hover": { bgcolor: "rgba(124,58,237,0.15)" } }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: "14px", display: "grid", placeItems: "center", mr: 1.4, background: "linear-gradient(135deg, rgba(124,58,237,0.85), rgba(6,182,212,0.75))" }}>
                    <Icon size={18} color="#fff" />
                  </Box>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                    primaryTypographyProps={{ color: "#fff", fontWeight: 900, overflowWrap: "anywhere" }}
                    secondaryTypographyProps={{ color: "#94A3B8", fontSize: 12, overflowWrap: "anywhere" }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
