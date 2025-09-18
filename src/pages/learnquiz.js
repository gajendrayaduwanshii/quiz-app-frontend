"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";

const LearnQuiz = () => {
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/login");
    }
  }, [router]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      gap={4}
      flexDirection={{ xs: "column", md: "row" }}
    >
      {/* Learning Card */}
      <Card sx={{ maxWidth: 600}}>
        <CardContent sx={{textAlign: 'center'}}>
          <h3 className="card-title">
             Explore interactive lessons and study materials to strengthen your understanding of key concepts.
          </h3>
          <Button variant="contained" color="primary" component={Link} href="/learning">
            Go to Learning
          </Button>
        </CardContent>
      </Card>

      {/* Quiz Card */}
      <Card sx={{ maxWidth: 600}}>
        <CardContent sx={{textAlign: 'center'}}>
          <h3 className="card-title">
            Test your knowledge with fun and challenging quizzes based on what you've learned.
          </h3>
          <Button variant="contained" color="secondary" component={Link} href="/quiz">
            Go to Quiz
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LearnQuiz;
