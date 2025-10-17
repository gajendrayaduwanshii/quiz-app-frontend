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
  MenuItem,
} from "@mui/material";
import { Grid } from "@mui/system";

const BasicInfo = ({
  profileData,
  isEditing,
  handleChange,
  getAgeFromDOB,
  handleFileChange,
}) => {
  const jobTypeOptions = [
    { label: "Full-Time", value: "Full-Time" },
    { label: "Part-Time", value: "Part-Time" },
    { label: "Remote", value: "Remote" },
  ];
  return (
    <>
      {isEditing ? (
        <>
          <Grid item size={{ xs: 12 }}>
            <h3 style={{ marginBottom: "20px" }}>Basic Information</h3>
          </Grid>
          <Grid item size={{ xs: 12 }}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  label="Name"
                  value={profileData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  label="Email"
                  value={profileData.email}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  label="Phone"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={profileData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  select
                  label="Gender"
                  name="gender"
                  fullWidth
                  value={profileData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  label="Current Job Title"
                  value={profileData.currentJobTitle}
                  onChange={(e) =>
                    handleChange("currentJobTitle", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  label="Current Company"
                  value={profileData.currentCompany}
                  onChange={(e) =>
                    handleChange("currentCompany", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  label="Years of Experience"
                  type="number"
                  value={profileData.yearsExperience}
                  onChange={(e) =>
                    handleChange("yearsExperience", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <TextField
                  select
                  label="Desired Job Type"
                  value={profileData.desiredJobType}
                  onChange={(e) =>
                    handleChange("desiredJobType", e.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="">Select</MenuItem>
                  {jobTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item size={{ xs: 12, sm: 6, lg: 4 }}>
                <Button variant="outlined" component="label">
                  Upload Resume
                  <input
                    type="file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
                {profileData.uploadResume && (
                  <Typography variant="body2" mt={1}>
                    Selected file: {profileData.uploadResume.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid size={{ xs: 12 }}>
            <h3 style={{ marginBottom: "16px" }}>Basic Information</h3>
            <TableContainer component={Paper} sx={{ mb: 5 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Field</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Value</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{profileData.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>{profileData.email || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Phone</TableCell>
                    <TableCell>{profileData.phoneNumber || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>{profileData.dob || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Age</TableCell>
                    <TableCell>
                      {getAgeFromDOB(profileData.dob) || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gender</TableCell>
                    <TableCell>{profileData.gender || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Job Title</TableCell>
                    <TableCell>
                      {profileData.currentJobTitle || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Company</TableCell>
                    <TableCell>{profileData.currentCompany || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Years of Experience</TableCell>
                    <TableCell>
                      {profileData.yearsExperience || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Desired Job Type</TableCell>
                    <TableCell>{profileData.desiredJobType || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Resume</TableCell>
                    <TableCell>
                      {!isEditing && profileData.uploadResume && (
                        <Button
                          variant="outlined"
                          color="primary"
                          href={
                            profileData.uploadResume
                              ? `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${
                                  typeof profileData.uploadResume === "object"
                                    ? profileData.uploadResume.url
                                    : profileData.uploadResume
                                }`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          Download Resume
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}
    </>
  );
};

export default BasicInfo;
