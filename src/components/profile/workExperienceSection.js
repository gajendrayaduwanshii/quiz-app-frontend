import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { margin } from "@mui/system";

// Helper to calculate duration string from start and end dates
const calculateDuration = (startDate, endDate, current) => {
  if (!startDate) return "N/A";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : current ? new Date() : null;

  if (!end) return "N/A";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let result = "";
  if (years > 0) {
    result += `${years} year${years > 1 ? "s" : ""} `;
  }
  if (months > 0) {
    result += `${months} month${months > 1 ? "s" : ""}`;
  }
  return result.trim() || "Less than a month";
};

const WorkExperienceSection = ({
  profileData,
  isEditing,
  handleWorkChange,
  addWorkExperience,
  removeWorkExperience,
}) => {
  const workExperiences = Array.isArray(profileData.workExperiences)
    ? profileData.workExperiences
    : [];

  return (
    <>
      {isEditing ? (
        <>
          <Grid
            item
            size={{ xs: 12 }}
            display={"flex"}
            alignItems="center"
            justifyContent="space-between"
            marginBottom={2}
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 1.2,
              "& button": { width: { xs: "100%", sm: "auto" } },
            }}
          >
            <h3 style={{margin:'0'}}>Work Experience</h3>
            <Button
              startIcon={<Add />}
              variant="outlined"
              color="primary"
              onClick={addWorkExperience}
            >
              Add Work Experience
            </Button>
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {workExperiences.map((work, index) => (
                <Grid item size={{ xs: 12, sm: 4 }}>
                  <Box
                    key={work.id || index}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    border="1px solid #ccc"
                    padding={2}
                    borderRadius={1}
                  >
                    <TextField
                      label="Company"
                      value={work.company}
                      onChange={(e) =>
                        handleWorkChange(index, "company", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Job Title"
                      value={work.jobTitle}
                      onChange={(e) =>
                        handleWorkChange(index, "jobTitle", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Start Date"
                      type="date"
                      value={work.startDate || ""}
                      onChange={(e) =>
                        handleWorkChange(index, "startDate", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      value={work.endDate || ""}
                      onChange={(e) =>
                        handleWorkChange(index, "endDate", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      disabled={work.current}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <label>
                        <input
                          type="checkbox"
                          checked={work.current || false}
                          onChange={(e) =>
                            handleWorkChange(index, "current", e.target.checked)
                          }
                        />{" "}
                        Current Job
                      </label>
                    </Box>
                    <TextField
                      label="Job Description"
                      value={work.jobDescription}
                      onChange={(e) =>
                        handleWorkChange(
                          index,
                          "jobDescription",
                          e.target.value
                        )
                      }
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <Button
                      startIcon={<Delete />}
                      onClick={() => removeWorkExperience(index)}
                      color="error"
                      variant="outlined"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginLeft: { xs: 0, sm: "auto" },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid size={{ xs: 12 }}>
            <h3 style={{ marginBottom: "16px" }}>Work Experience</h3>
            {workExperiences.length === 0 ? (
              <Typography>No work experiences added.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 5, maxWidth: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Company</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Job Title</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Duration</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Current</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Description</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workExperiences.map((work, index) => (
                      <TableRow key={work.id || index}>
                        <TableCell sx={{ overflowWrap: "anywhere" }}>{work.company || "N/A"}</TableCell>
                        <TableCell sx={{ overflowWrap: "anywhere" }}>{work.jobTitle || "N/A"}</TableCell>
                        <TableCell>
                          {calculateDuration(
                            work.startDate,
                            work.endDate,
                            work.current
                          )}
                        </TableCell>
                        <TableCell>{work.current ? "Yes" : "No"}</TableCell>
                        <TableCell sx={{ minWidth: 220, overflowWrap: "anywhere" }}>{work.jobDescription || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default WorkExperienceSection;
