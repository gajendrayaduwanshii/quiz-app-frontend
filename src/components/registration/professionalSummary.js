import { Grid, TextField, Typography, Autocomplete } from "@mui/material";

const jobTypeOptions = [
  { label: "Full-Time", value: "Full-Time" },
  { label: "Part-Time", value: "Part-Time" },
  { label: "Remote", value: "Remote" },
];

const ProfessionalSummary = ({ formData, handleChange, errors }) => {
  const handleJobTypeChange = (event, newValue) => {
    handleChange({
      target: {
        name: "jobType",
        value: newValue ? newValue.value : "",
      },
    });
  };

  return (
    <Grid item className="section-wrapper">
      <Typography variant="h6" className="form-sub-title" gutterBottom>
        Professional Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            label="Current Job Title"
            name="jobTitle"
            fullWidth
            value={formData.jobTitle || ""}
            onChange={handleChange}
            error={Boolean(errors?.jobTitle)}
            helperText={errors?.jobTitle}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            label="Current Company"
            name="company"
            fullWidth
            value={formData.company || ""}
            onChange={handleChange}
            error={Boolean(errors?.company)}
            helperText={errors?.company}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            label="Years of Experience"
            name="experienceYears"
            type="number"
            inputProps={{ min: 0 }}
            fullWidth
            value={formData.experienceYears || ""}
            onChange={handleChange}
            error={Boolean(errors?.experienceYears)}
            helperText={errors?.experienceYears}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Autocomplete
            options={jobTypeOptions}
            getOptionLabel={(option) => option.label}
            value={jobTypeOptions.find(opt => opt.value === formData.jobType) || null}
            onChange={handleJobTypeChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Desired Job Type"
                fullWidth
                error={Boolean(errors?.jobType)}
                helperText={errors?.jobType}
              />
            )}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfessionalSummary;
