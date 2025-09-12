import {
  Grid,
  TextField,
  Typography,
  Button,
  FormHelperText,
  Box,
} from "@mui/material";

const CertificationsResumeSection = ({
  formData,
  handleChange,
  handleFileChange,
  errors,
}) => {
  // Show the name of the selected file, if any
  const resumeFileName = formData.resumeFile ? formData.resumeFile.name : "";

  return (
    <Grid className="section-wrapper border-0" container spacing={2}>
      {/* Certifications Field */}
      <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6 }}> 
        <Typography variant="h6" className="form-sub-title">
          Certifications
        </Typography>
        <Grid container size={{ xs: 12}} spacing={2}>
          <Grid item size={{ xs: 12}}>
            <TextField
              label="Certifications / Trainings"
              name="certifications"
              fullWidth
              multiline
              rows={3}
              value={formData.certifications}
              onChange={handleChange}
              error={Boolean(errors?.certifications)}
              helperText={errors?.certifications || ""}
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Resume Upload */}
      <Grid item size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
        <Box sx={{ padding: "20px 0 28px" }}>
          <Typography variant="body1" className="form-sub-title">
            Upload Resume (PDF/DOC)
          </Typography>

          <Button variant="outlined" component="label">
            Choose File
            <input
              type="file"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          {/* Show selected file name */}
          {resumeFileName && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {resumeFileName}
            </Typography>
          )}

          {/* Show error related to resumeFile */}
          {errors?.resumeFile && (
            <FormHelperText error sx={{ mt: 1 }}>
              {errors.resumeFile}
            </FormHelperText>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default CertificationsResumeSection;
