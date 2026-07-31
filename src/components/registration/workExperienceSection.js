import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const WorkExperienceSection = ({
  workExperience,
  handleArrayChange,
  addField,
  removeField,
  errors = [], // array of error objects for each work experience item
}) => (
  <Grid item xs={12} className="section-wrapper">
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: 1,
      }}
    >
      <Typography variant="h6" className="form-sub-title">
        Work Experience
      </Typography>
      <Button
        className="icon-btn"
        onClick={() =>
          addField("workExperience", {
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false, // new field for current working
          })
        }
        startIcon={<AddCircle sx={{ fontSize: "1.75rem" }} />}
        sx={{ padding: "0.3rem 0", minWidth: "auto", alignSelf: { xs: "flex-start", sm: "center" } }}
      />
    </Box>

    {workExperience.map((exp, i) => {
      const expErrors = errors[i] || {};
      return (
        <React.Fragment key={i}>
          <Box
            mb={2}
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 1,
              minWidth: 0,
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              sx={{
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: { xs: 0.6, sm: 2 },
                minWidth: 0,
              }}
            >
              <Typography variant="h6" className="form-row-title">
                Experience {i + 1}
              </Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exp.current}
                      onChange={(e) => {
                        handleArrayChange(
                          "workExperience",
                          i,
                          "current",
                          e.target.checked
                        );
                        if (e.target.checked) {
                          handleArrayChange("workExperience", i, "endDate", "");
                        }
                      }}
                      color="primary"
                    />
                  }
                  label="Currently Working Here"
                  sx={{
                    m: 0,
                    alignItems: "flex-start",
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.875rem",
                      lineHeight: 1.3,
                    },
                  }}
                />
              </Box>
            </Box>
            {workExperience.length > 1 && (
              <Button
                onClick={() => removeField("workExperience", i)}
                startIcon={<RemoveCircle color="error" sx={{ fontSize: "1.75rem" }} />}
                sx={{ padding: "0.3rem 0", minWidth: "auto", alignSelf: { xs: "flex-start", sm: "center" } }}
                className="icon-btn"
              />
            )}
          </Box>

          <Box>
            <Box
              className="custom-row registration-work-row"
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1.4, sm: 2 },
                mb: 2,
              }}
            >
              <Box className="custom-col" sx={{ minWidth: 0 }}>
                <TextField
                  label="Company"
                  fullWidth
                  value={exp.company}
                  onChange={(e) =>
                    handleArrayChange(
                      "workExperience",
                      i,
                      "company",
                      e.target.value
                    )
                  }
                  error={Boolean(expErrors.company)}
                  helperText={expErrors.company}
                />
              </Box>

              <Box className="custom-col" sx={{ minWidth: 0 }}>
                <TextField
                  label="Job Title"
                  fullWidth
                  value={exp.title}
                  onChange={(e) =>
                    handleArrayChange(
                      "workExperience",
                      i,
                      "title",
                      e.target.value
                    )
                  }
                  error={Boolean(expErrors.title)}
                  helperText={expErrors.title}
                />
              </Box>

              <Box className="custom-col" sx={{ minWidth: 0 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={exp.startDate}
                  onChange={(e) =>
                    handleArrayChange(
                      "workExperience",
                      i,
                      "startDate",
                      e.target.value
                    )
                  }
                  error={Boolean(expErrors.startDate)}
                  helperText={expErrors.startDate}
                />
              </Box>

              <Box
                className="custom-col"
                sx={{ display: "flex", alignItems: "center", minWidth: 0 }}
              >
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={exp.endDate}
                  onChange={(e) =>
                    handleArrayChange(
                      "workExperience",
                      i,
                      "endDate",
                      e.target.value
                    )
                  }
                  error={Boolean(expErrors.endDate)}
                  helperText={expErrors.endDate}
                  disabled={exp.current} // disable when current is true
                />
              </Box>
            </Box>
            <Box className="custom-col" sx={{ minWidth: 0 }}>
              <TextField
                label="Job Description"
                fullWidth
                multiline
                rows={2}
                value={exp.description}
                onChange={(e) =>
                  handleArrayChange(
                    "workExperience",
                    i,
                    "description",
                    e.target.value
                  )
                }
                error={Boolean(expErrors.description)}
                helperText={expErrors.description}
              />
            </Box>
          </Box>
        </React.Fragment>
      );
    })}
  </Grid>
);

export default WorkExperienceSection;
