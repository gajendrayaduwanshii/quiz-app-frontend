import React from "react";
import { Grid, TextField, Typography, Button, Box } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const EducationSection = ({ education, handleArrayChange, addField, removeField, errors }) => (
  <Grid item xs={12} className="section-wrapper">
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" className="form-sub-title">Education</Typography>
      <Button
        onClick={() =>
          addField("education", { degree: "", institution: "", year: "", grade: "" })
        }
        className="icon-btn"
        startIcon={<AddCircle />}
        sx={{ padding: 0, minWidth: "auto" }}
      />
    </Box>

    {education.map((edu, i) => {
      const eduErrors = errors[i] || {};
      return (
        <Box key={i} mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" className="form-row-title">Education {i + 1}</Typography>
            {education.length > 1 && (
              <Button
                onClick={() => removeField("education", i)}
                startIcon={<RemoveCircle color="error" />}
                sx={{ padding: 0, minWidth: "auto" }}
                className="icon-btn"
              />
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField
                label="Degree"
                fullWidth
                value={edu.degree}
                onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)}
                error={Boolean(eduErrors.degree)}
                helperText={eduErrors.degree}
              />
            </Grid>

            <Grid item  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField
                label="Institution"
                fullWidth
                value={edu.institution}
                onChange={(e) => handleArrayChange("education", i, "institution", e.target.value)}
                error={Boolean(eduErrors.institution)}
                helperText={eduErrors.institution}
              />
            </Grid>

            <Grid item  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField
                label="Passing Year"
                fullWidth
                value={edu.year}
                onChange={(e) => handleArrayChange("education", i, "year", e.target.value)}
                error={Boolean(eduErrors.year)}
                helperText={eduErrors.year}
              />
            </Grid>

            <Grid item  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <TextField
                label="Grade/CGPA"
                fullWidth
                value={edu.grade}
                onChange={(e) => handleArrayChange("education", i, "grade", e.target.value)}
                error={Boolean(eduErrors.grade)}
                helperText={eduErrors.grade}
              />
            </Grid>
          </Grid>
        </Box>
      );
    })}
  </Grid>
);

export default EducationSection;
