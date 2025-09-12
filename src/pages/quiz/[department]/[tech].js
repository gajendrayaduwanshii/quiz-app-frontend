"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Typography, Box, CircularProgress } from "@mui/material";
import QuizComponent from "@/components/QuizMainComponent";
import FetchData from "@/customHooks/fetchData";

const Quiz = () => {
  const { data, error, loading } = FetchData(
    "http://localhost:1337/api/departments?populate[departmentImage][populate]=*&populate[technologies][populate][image][populate]=*&populate[technologies][populate][questions][populate]=*"
  );
  const router = useRouter();
  const { department, tech } = router.query;
  const [questions, setQuestions] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (error) {
      setFetchError("Failed to load data. Please try again later.");
      return;
    }

    if (!loading && data && Array.isArray(data) && department && tech) {
      const departmentObj = data.find(
        (item) =>
          item.name &&
          item.name.toLowerCase() === String(department).toLowerCase()
      );

      if (!departmentObj) {
        setFetchError(`Department "${department}" not found.`);
        setQuestions([]);
        return;
      }

      const techObj = departmentObj.technologies?.find(
        (t) =>
          t.technologyName &&
          t.technologyName.toLowerCase() === String(tech).toLowerCase()
      );

      if (!techObj) {
        setFetchError(`Technology "${tech}" not found in department "${department}".`);
        setQuestions([]);
        return;
      }

      setFetchError(null);
      setQuestions(techObj.questions || []);
    }
  }, [data, error, loading, department, tech]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ mt: 4, fontWeight: 700, textTransform: "capitalize" }}
      >
        {fetchError}
      </Typography>
    );
  }

  return (
    <Box>
      {questions.length ? (
        <QuizComponent questions={questions} />
      ) : (
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mb: 2, fontWeight: 700, textTransform: "capitalize" }}
        >
          No quiz questions available.
        </Typography>
      )}
    </Box>
  );
};

export default Quiz;
