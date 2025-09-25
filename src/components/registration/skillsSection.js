import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Button,
  Autocomplete,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import skillsData from "./../../data/skills"; 

const levelOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Expert", label: "Expert" },
];

const SkillsSection = ({
  formData,
  handleArrayChange,
  addField,
  removeField,
  errors,
}) => {
  return (
    <Grid item className="section-wrapper">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" className="form-sub-title">
          Skills
        </Typography>
        <Button
          onClick={() =>
            addField("skills", { skill: "", level: "", experienceYears: "" })
          }
          startIcon={<AddCircle />}
          sx={{ padding: 0, minWidth: "auto" }}
        />
      </Box>

      {formData.skills.map((skill, index) => (
        <Grid container spacing={2} key={index} alignItems="center" mb={3}>
          {/* Searchable Skill Autocomplete */}
          <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <Autocomplete
              options={skillsData.map((s) => s.skillName)}
              value={skill.skill || ""}
              onChange={(event, newValue) =>
                handleArrayChange("skills", index, "skill", newValue || "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Skill"
                  fullWidth
                  error={Boolean(errors?.[index]?.skill)}
                  helperText={errors?.[index]?.skill}
                />
              )}
              freeSolo={false}
            />
          </Grid>

          {/* Searchable Level Autocomplete */}
          <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <Autocomplete
              options={levelOptions}
              getOptionLabel={(option) => option.label}
              value={levelOptions.find((opt) => opt.value === skill.level) || null}
              onChange={(event, newValue) =>
                handleArrayChange(
                  "skills",
                  index,
                  "level",
                  newValue ? newValue.value : ""
                )
              }
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Level"
                  fullWidth
                  error={Boolean(errors?.[index]?.level)}
                  helperText={errors?.[index]?.level}
                />
              )}
            />
          </Grid>

          {/* Experience Field */}
          <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <TextField
              label="Years of Experience"
              name="experienceYears"
              type="number"
              inputProps={{ min: 0 }}
              fullWidth
              value={skill.experienceYears}
              onChange={(e) =>
                handleArrayChange(
                  "skills",
                  index,
                  "experienceYears",
                  e.target.value
                )
              }
              error={Boolean(errors?.[index]?.experienceYears)}
              helperText={errors?.[index]?.experienceYears}
            />
          </Grid>

          {/* Remove Button */}
          <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 1 }}>
            {formData.skills.length > 1 && (
              <Button
                onClick={() => removeField("skills", index)}
                color="error"
                startIcon={<RemoveCircle />}
                sx={{ minWidth: "auto" }}
              />
            )}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkillsSection;
