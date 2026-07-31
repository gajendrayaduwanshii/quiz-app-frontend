import React from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Autocomplete,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import skillsData from "./../../data/skills";

const SkillsSection = ({
  profileData,
  isEditing,
  handleSkillChange,
  addSkill,
  removeSkill,
}) => {
  const levelOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Expert", label: "Expert" },
  ];

  const skills = Array.isArray(profileData.skills) ? profileData.skills : [];

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
            <h3 style={{ marginBottom: "0" }}>Skills</h3>
            <Button
              startIcon={<Add />}
              variant="outlined"
              color="primary"
              onClick={addSkill}
            >
              Add Skill
            </Button>
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {skills.map((skill, index) => (
                <Grid item size={{ xs: 12, sm: 4 }}>
                  <Box
                    key={skill.id || index}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    border="1px solid #ccc"
                    padding={2}
                    borderRadius={1}
                  >
                    <Autocomplete
                      options={skillsData.map((s) => s.skillName)}
                      value={skill.skillName || ""}
                      onChange={(event, newValue) =>
                        handleSkillChange(index, "skillName", newValue || "")
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Skill Name" fullWidth />
                      )}
                      freeSolo={false}
                    />
                    <Autocomplete
                      options={levelOptions}
                      getOptionLabel={(option) => option.label}
                      value={
                        levelOptions.find((opt) => opt.value === skill.level) ||
                        null
                      }
                      onChange={(event, newValue) =>
                        handleSkillChange(
                          index,
                          "level",
                          newValue ? newValue.value : ""
                        )
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Level" fullWidth />
                      )}
                    />
                    <TextField
                      label="Experience (in years)"
                      value={skill.yearsExperience}
                                        onChange={(e) =>
                        handleSkillChange(index, "yearsExperience", e.target.value)
                      }
                      fullWidth
                    />
                    <Button
                      startIcon={<Delete />}
                      onClick={() => removeSkill(index)}
                      color="error"
                      variant="outlined"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginLeft: "auto",
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
        <Grid size={{ xs: 12 }}>
          <h3 style={{ marginBottom: "16px" }}>Skills</h3>
          {skills.length === 0 ? (
            <Typography>No skills added.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 5, maxWidth: "100%" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Skill Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Level</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Experience</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {skills.map((skill, index) => (
                    <TableRow key={skill.id || index}>
                      <TableCell>{skill.skillName || "N/A"}</TableCell>
                      <TableCell>{skill.level || "N/A"}</TableCell>
                      <TableCell>{skill.yearsExperience || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      )}
    </>
  );
};

export default SkillsSection;
