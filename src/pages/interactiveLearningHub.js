"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { margin, maxWidth } from "@mui/system";

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
      description:
        "Explore interactive lessons and study materials to strengthen your understanding of key concepts.",
      color: "bg-gradient-to-r from-indigo-500 to-purple-500",
      href: "/learning",
      buttonText: "Go to Learning and Suggestions",
      buttonColor: "primary",
    },
    {
      title: "Fun Quizzes",
      description:
        "Test your knowledge with fun and challenging quizzes based on what you've learned.",
      color: "bg-gradient-to-r from-green-400 to-teal-500",
      href: "/technologies",
      buttonText: "Go to Technologies For Quiz",
      buttonColor: "secondary",
    },
    {
      title: "Logical Questions",
      description:
        "Solve logical and reasoning questions to improve problem-solving and critical thinking skills.",
      color: "bg-gradient-to-r from-yellow-400 to-orange-500",
      onClick: handleOpen,
      buttonText: "Go to Logical Questions",
      buttonColor: "success",
    },
    {
      title: "Resume Analyzer",
      description:
        "Analyze your resume to get insights, suggestions, and improve your chances of landing your dream job.",
      color: "bg-gradient-to-r from-blue-400 to-cyan-500",
      href: "/resumeAnalysis",
      buttonText: "Go to Resume Analyzer",
      buttonColor: "info",
    },
  ];

  return (
      <Box
      sx={{
        height: "calc(100vh - 180px)", // Adjusted for header/footer height
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      <Box
        display="grid"
        gap={6}
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        justifyContent="center"
        alignItems="stretch"
        p={4}
        style={{maxWidth:"1200px", margin:"auto"}}
      >
        {cards.map((card, idx) => (
          <Card
            key={idx}
            sx={{
              height: "100%",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                textAlign: "center",
                p: 4,
                background: card.color,
                color: "black",
              }}
            >
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="mb-4">{card.description}</p>
            <div>
                {card.href ? (
                <Button
                  variant="contained"
                  color={card.buttonColor}
                  component={Link}
                  href={card.href}
                >
                  {card.buttonText}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color={card.buttonColor}
                  onClick={card.onClick}
                  style={{display:"inline-block"}}
                >
                  {card.buttonText}
                </Button>
              )}
            </div>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Modal for Logical Questions */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Technology</DialogTitle>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="success">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InteractiveLearningHub;
