"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { BookOpen, BrainCircuit, Code2, FileSearch, Sparkles } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumButton from "@/components/premium/PremiumButton";

const InteractiveLearningHub = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [tech, setTech] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) router.push("/login");
  }, [router]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (!tech) return;
    router.push(`/logical/${tech.toLowerCase()}`);
    setOpen(false);
  };

  const cards = [
    {
      title: "Interactive Learning",
      icon: BookOpen,
      description:
        "Explore interactive lessons and study materials to strengthen your understanding of key concepts.",
      accent: "#7C3AED",
      href: "/learning",
      buttonText: "Go to Learning and Suggestions",
    },
    {
      title: "Fun Quizzes",
      icon: BrainCircuit,
      description:
        "Test your knowledge with fun and challenging quizzes based on what you've learned.",
      accent: "#06B6D4",
      href: "/technologies",
      buttonText: "Go to Technologies For Quiz",
    },
    {
      title: "Logical Questions",
      icon: Code2,
      description:
        "Solve logical and reasoning questions to improve problem-solving and critical thinking skills.",
      accent: "#22C55E",
      onClick: handleOpen,
      buttonText: "Go to Logical Questions",
    },
    {
      title: "Resume Analyzer",
      icon: FileSearch,
      description:
        "Analyze your resume to get insights, suggestions, and improve your chances of landing your dream job.",
      accent: "#38BDF8",
      href: "/resumeAnalysis",
      buttonText: "Go to Resume Analyzer",
    },
  ];

  return (
      <Box
      sx={{
        minHeight: "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 1, md: 2 },
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4, maxWidth: 760 }}>
        <Box
          sx={{
            mx: "auto",
            mb: 2,
            width: 54,
            height: 54,
            borderRadius: "18px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            boxShadow: "0 0 36px rgba(124,58,237,0.35)",
          }}
        >
          <Sparkles size={25} color="#fff" />
        </Box>
        <Typography
          variant="h3"
          className="gradient-text"
          sx={{
            fontWeight: 900,
            mb: 1,
            fontSize: { xs: 34, sm: 42, md: 56 },
            lineHeight: 1.08,
          }}
        >
          AI Learning Hub
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: { xs: 15, md: 17 } }}>
          Choose your next growth loop: learn, practice, reason, or improve your resume.
        </Typography>
      </Box>

      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        justifyContent="center"
        alignItems="stretch"
        sx={{ width: "100%", maxWidth: 1180 }}
      >
        {cards.map((card) => {
          const Icon = card.icon;

          return (
          <PremiumCard
            key={card.title}
            glow={`${card.accent}30`}
            sx={{
              minHeight: 210,
              p: { xs: 2.4, md: 3.2 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "center",
            }}
          >
            <Box>
              <Box
                sx={{
                  mx: "auto",
                  mb: 2,
                  width: 52,
                  height: 52,
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  background: `linear-gradient(135deg, ${card.accent}, #06B6D4)`,
                  boxShadow: `0 18px 38px ${card.accent}45`,
                }}
              >
                <Icon size={24} color="#fff" />
              </Box>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 900, mb: 1 }}>
                {card.title}
              </Typography>
              <Typography sx={{ color: "#94A3B8", maxWidth: 470, mx: "auto", mb: 2.5 }}>
                {card.description}
              </Typography>
            </Box>
            <Box>
                {card.href ? (
                <PremiumButton
                  component={Link}
                  href={card.href}
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { sm: 220 } }}
                >
                  {card.buttonText}
                </PremiumButton>
              ) : (
                <PremiumButton
                  onClick={card.onClick}
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: { sm: 220 } }}
                >
                  {card.buttonText}
                </PremiumButton>
              )}
            </Box>
          </PremiumCard>
          );
        })}
      </Box>

      {/* Modal for Logical Questions */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "rgba(11,17,32,0.96)",
            backdropFilter: "blur(18px)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontWeight: 900 }}>Select Technology</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Enter Technology"
            type="text"
            fullWidth
            variant="outlined"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "text.secondary" }}>Cancel</Button>
          <PremiumButton onClick={handleSubmit}>
            Submit
          </PremiumButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractiveLearningHub;
