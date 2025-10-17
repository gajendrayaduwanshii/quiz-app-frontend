import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Grid,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useUser } from "@/customHooks/useUser";
import { validatePassword } from "./../helper/formValidationHelpers"; 
import { useAuth } from "../context/AuthContext"; 

const ChangePassword = () => {
  const router = useRouter();
  const { user, loadingUser, refreshUser } = useUser();
  const { logout } = useAuth(); 

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);


  const [message, setMessage] = useState({ text: "", type: "" });

  const [errors, setErrors] = useState({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/login");
    }
  }, [router]);

    const handleLogout = () => {
    setTimeout(() => {
      logout(); 
      router.push("/login");
    }, 200);
  };


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setMessage({ text: "", type: "" });

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (field === "newPassword") {
        if (!validatePassword(value)) {
          newErrors.newPassword = "Password must be at least 6 characters";
        } else {
          newErrors.newPassword = null;
        }
      }

      if (field === "confirmPassword") {
        if (value !== formData.newPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          newErrors.confirmPassword = null;
        }
      }

      if (field === "currentPassword") {
        if (!value.trim()) {
          newErrors.currentPassword = "Current password is required";
        } else {
          newErrors.currentPassword = null;
        }
      }

      return newErrors;
    });
  };

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ text: "Please fix the errors above.", type: "error" });
      return;
    }

    if (!user || !user.documentId) {
      setMessage({ text: "User not logged in or missing user ID.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const payload = {
        data: {
          password: formData.newPassword,
        },
      };

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: user.documentId,
          data: payload.data,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Password update failed");
      }

      setMessage({ text: "Password updated successfully!", type: "success" });
      handleLogout();
      if (refreshUser) {
        await refreshUser();
      }

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setErrors({
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,
      });
    } catch (error) {
      console.error("Password update failed:", error.response || error.message);
      setMessage({
        text:
          error.response?.data?.error?.message ||
          "Failed to update password. Please check your current password.",
        type: "error",
      });
    }

    setLoading(false);
  };

  if (loadingUser) return <div>Loading...</div>;

  return (
    <Box style={{ height: "calc(100vh - 180px)" }}>
      <h3 style={{ marginBottom: "10px" }}>Change Password</h3>

      {message.text && (
        <Typography
          variant="body2"
          color={message.type === "success" ? "success.main" : "error"}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item size={{xs:12,md:4}}>
            <TextField
              label="Current Password"
              type={showPassword.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              fullWidth
              required
              error={Boolean(errors.currentPassword)}
              helperText={errors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("current")}
                      edge="end"
                      aria-label="toggle current password visibility"
                    >
                      {showPassword.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item size={{xs:12,md:4}}>
            <TextField
              label="New Password"
              type={showPassword.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              fullWidth
              required
              error={Boolean(errors.newPassword)}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("new")}
                      edge="end"
                      aria-label="toggle new password visibility"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item size={{xs:12,md:4}}>
            <TextField
              label="Confirm Password"
              type={showPassword.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              fullWidth
              required
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword("confirm")}
                      edge="end"
                      aria-label="toggle confirm password visibility"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item size={{xs:12}}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ChangePassword;
