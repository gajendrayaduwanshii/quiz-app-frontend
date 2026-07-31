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

const EducationSection = ({
  profileData,
  isEditing,
  handleEducationChange,
  addEducation,
  removeEducation,
}) => {
  const educations = Array.isArray(profileData.educations)
    ? profileData.educations
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
            <h3 style={{ margin: 0 }}>Education</h3>
            <Button
              startIcon={<Add />}
              variant="outlined"
              color="primary"
              onClick={addEducation}
            >
              Add Education
            </Button>
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {educations.map((edu, index) => (
                <Grid item size={{ xs: 12, sm: 4 }}>
                  <Box
                    key={edu.id || index}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    border="1px solid #ccc"
                    padding={2}
                    borderRadius={1}
                  >
                    <TextField
                      label="Institution"
                      value={edu.institution}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                    <TextField
                      label="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        handleEducationChange(index, "degree", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Passing Year"
                      value={edu.passingYear}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "passingYear",
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                    <TextField
                      label="Grade"
                      value={edu.grade}
                      onChange={(e) =>
                        handleEducationChange(index, "grade", e.target.value)
                      }
                      fullWidth
                    />
                    <Button
                      startIcon={<Delete />}
                      onClick={() => removeEducation(index)}
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
              <Grid item size={{ xs: 12 }}></Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid size={{ xs: 12}}>
            <h3 style={{ marginBottom: "16px" }}>Education</h3>
            {educations.length === 0 ? (
              <Typography>No education records added.</Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 5, maxWidth: "100%" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Institution</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Degree</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Passing Year</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Grade</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {educations.map((edu, index) => (
                      <TableRow key={edu.id || index}>
                        <TableCell sx={{ overflowWrap: "anywhere" }}>{edu.institution || "N/A"}</TableCell>
                        <TableCell sx={{ overflowWrap: "anywhere" }}>{edu.degree || "N/A"}</TableCell>
                        <TableCell>{edu.passingYear || "N/A"}</TableCell>
                        <TableCell>{edu.grade || "N/A"}</TableCell>
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

export default EducationSection;
