"use client";

import { Box, Grid, Typography, Card, CardContent, Link, Button } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import NextLink from "next/link";

const Technologies = () => {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <LoaderTwo text="Loading Technologies..." />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <LoaderTwo text="Redirecting to login... ..." />
      </Box>
    );
  }

  const { skills } = user;

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
      <Grid
        container
        spacing={3}
        justifyContent="start"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        {skills && skills.length > 0 ? (
          skills.map((skill) => (
            <Grid item size={{xs:12, sm:6, md:4}} key={skill.id} sx={{textAlign: 'left'}}>
              <Card sx={{transition:'0.3s all','&:hover': { transform:'scale(1.02)' }, height: '100%'}}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    <Link
                      component={NextLink}
                      href={`/quiz/${encodeURIComponent(skill.skillName.toLowerCase())}`}
                      underline="hover"
                      sx={{ cursor: "pointer",color:'black', textDecoration: 'none', '&:hover': { textDecoration: 'none' } }}  
                    >
                      {skill.skillName}
                    </Link>
                  </Typography>
                  <Box display="flex" flexDirection="row" gap={2} justifyContent="space-between" mb={2}>
                     <Typography variant="body2" color="text.secondary">
                    <strong>Level:</strong> {skill.level}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Experience:</strong> {skill.yearsExperience} years
                  </Typography>
                  </Box>
                  <Button
                    size="small"
                    component={NextLink}
                    href={`/quiz/${encodeURIComponent(skill.skillName.toLowerCase())}`}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center">No skills available.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Technologies;
