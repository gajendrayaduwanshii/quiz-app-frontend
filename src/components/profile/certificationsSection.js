import React from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

const CertificationsSection = ({
  profileData,
  isEditing,
  handleCertificationChange,
}) => {
  const certificationsRaw = profileData.certifications;

  // Ensure it's a string
  const certifications =
    typeof certificationsRaw === "string" ? certificationsRaw : "";

  // Split by newline or comma
  const certificationList = certifications
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <>
      {isEditing ? (
        <>
          <Grid item size={{ xs: 12 }}>
            <h3 style={{marginBottom:"20px"}}>Certifications / Awards</h3>
          </Grid>
          <TextField
            label="Certifications / Awards"
            multiline
            rows={4}
            fullWidth
            value={certifications}
            onChange={(e) => handleCertificationChange(e.target.value)}
          />
        </>
      ) : (
        <Grid item size={{ xs: 12}}>
          <h3 style={{ marginBottom: "16px" }}>Certifications & Awards</h3>
          {certificationList.length === 0 ? (
            <Typography>No certifications or awards added.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 5 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Certification / Award</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificationList.map((cert, index) => (
                    <TableRow key={index}>
                      <TableCell>{cert}</TableCell>
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

export default CertificationsSection;
