import { useState } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PersonalInformation = ({ formData, handleChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Grid item className="section-wrapper">
      <Typography variant="h6" className="form-sub-title">
        Personal Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors?.name)}
            helperText={errors?.name}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors?.email)}
            helperText={errors?.email}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            label="Phone Number"
            name="phone"
            fullWidth
            value={formData.phone}
            onChange={handleChange}
            error={Boolean(errors?.phone)}
            helperText={errors?.phone}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={handleChange}
            error={Boolean(errors?.dob)}
            helperText={errors?.dob}
          />
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            select
            label="Gender"
            name="gender"
            fullWidth
            value={formData.gender}
            onChange={handleChange}
            error={Boolean(errors?.gender)}
            helperText={errors?.gender}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors?.password)}
            helperText={errors?.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PersonalInformation;
