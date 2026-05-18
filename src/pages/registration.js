"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";

import PersonalInformation from "../components/registration/personalInformation";
import ProfessionalSummary from "../components/registration/professionalSummary";
import EducationSection from "../components/registration/educationSection";
import WorkExperienceSection from "../components/registration/workExperienceSection";
import SkillsSection from "../components/registration/skillsSection";
import CertificationsResumeSection from "../components/registration/certificationsResumeSection";
import { useAuth } from "../context/AuthContext";
import useRegistrationForm from "../customHooks/useRegistrationForm";

import axios from "axios";
import { BrainCircuit, Save, UploadCloud } from "lucide-react";

 
const STRAPI_URL = "http://localhost:1337";

const steps = [
  "Personal Info",
  "Professional Summary",
  "Education",
  "Work Experience",
  "Skills",
  "Certifications & Resume",
];

const RegistrationForm = () => {
  const router = useRouter();
  const { setRegistrationCompleted } = useAuth(); 
  const {
    formData,
    errors,
    validate,
    handleChange,
    handleArrayChange,
    addField,
    removeField,
    handleFileChange,
  } = useRegistrationForm();

  const [activeStep, setActiveStep] = useState(0);
  const [stepErrors, setStepErrors] = useState({}); // Track error per step
  const [loading, setLoading] = useState(false);

  const errorMap = {
    0: ["name", "email", "phone", "dob", "gender", "password"],
    1: ["jobTitle", "company", "experienceYears", "jobType"],
    2: ["education"],
    3: ["workExperience"],
    4: ["skills"],
    5: ["certifications", "resumeFile"],
  };

  useEffect(() => {
    const newStepErrors = {};

    Object.entries(errorMap).forEach(([stepIndex, fieldKeys]) => {
      const hasError = fieldKeys.some((key) => {
        const err = errors[key];
        if (Array.isArray(err)) {
          return err.some((e) => Object.values(e).some((val) => val));
        }
        return Boolean(err);
      });
      newStepErrors[stepIndex] = hasError;
    });

    setStepErrors(newStepErrors);
  }, [errors]);

  // Upload file to Strapi and get uploaded file object
  const uploadFileToStrapi = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.file) {
        return result.file; // uploaded file object
      } else {
        console.error("Upload failed:", result.error);
        return null;
      }
    } catch (error) {
      console.error("Error uploading file to Strapi:", error.response || error.message);
      return null;
    }
  };

  // Map arrays to backend expected structure
  const mapEducation = (educationArr) =>
    educationArr.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      passingYear: edu.year,
      grade: edu.grade,
    }));
// ✅ Utility to format date to yyyy-MM-dd
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // yyyy-MM-dd
};

// ✅ Updated work experience mapping
const mapWorkExperience = (workArr) =>
  workArr.map((work) => ({
    jobTitle: work.title,
    company: work.company,
    startDate: formatDate(work.startDate),
    endDate: work.current ? null : formatDate(work.endDate),
    jobDescription: work.description,
    current: work.current || false, // 👈 Add this line
  }));

  const mapSkills = (skillsArr) =>
    skillsArr.map((skill) => ({
      skillName: skill.skill,
      level: skill.level,
      yearsExperience: skill.experienceYears,
    }));

  // Submit form data to Strapi userlists
  const submitFormData = async (uploadedFileId) => {
    const yearsExpValue = formData.experienceYears || "0";

    const payload = {
      data: {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
         password: formData.password, 
        currentJobTitle: formData.jobTitle,
        currentCompany: formData.company,
        yearsExperience: yearsExpValue,
        desiredJobType: formData.jobType,
        certifications: formData.certifications,
        educations: mapEducation(formData.education || []),
        workExperiences: mapWorkExperience(formData.workExperience || []),
        skills: mapSkills(formData.skills || []),
        uploadResume: uploadedFileId,
      },
    };

    try {
      const res = await fetch("/api/data/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "/api/userlists",
          data: payload,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        return result.data;
      } else {
        throw new Error(result.error || "Registration failed");
      }
    } catch (error) {
      console.error(
        "Error submitting userlist entry:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      if (!validate()) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!formData.uploadResume) {
        alert("Please upload your resume PDF file");
        return;
      }

      if (formData.uploadResume.type !== "application/pdf") {
        alert("Please upload a PDF file for your resume");
        return;
      }

      setLoading(true);

      try {
        // 1. Upload resume file
        const uploadedFile = await uploadFileToStrapi(formData.uploadResume);

        if (!uploadedFile) {
          alert("File upload failed. Please try again.");
          setLoading(false);
          return;
        }

        // 2. Submit form data with uploaded file ID
        await submitFormData(uploadedFile.id);

         // ✅ 2. Show form data in console before submitting
      console.log("Form data being submitted:", {
        ...formData,
        uploadResume: uploadedFile,
      });

        setLoading(false);
        setRegistrationCompleted(true);
        router.push("/dashboard");
      } catch (error) {
        alert("An error occurred during submission. Please try again.");
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalInformation
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <ProfessionalSummary
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <EducationSection
            education={formData.education}
            handleArrayChange={handleArrayChange}
            addField={addField}
            removeField={removeField}
            errors={errors.education || []}
          />
        );
      case 3:
        return (
          <WorkExperienceSection
            workExperience={formData.workExperience}
            handleArrayChange={handleArrayChange}
            addField={addField}
            removeField={removeField}
            errors={errors.workExperience || []}
          />
        );
      case 4:
        return (
          <SkillsSection
            formData={formData}
            handleArrayChange={handleArrayChange}
            addField={addField}
            removeField={removeField}
            errors={errors.skills || []}
          />
        );
      case 5:
        return (
         <CertificationsResumeSection
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          errors={{
            certifications: errors.certifications,
            uploadResume: errors.uploadResume,
          }}
        />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      className="login-wrapper custom-form"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: { xs: 1.5, md: 3 },
      }}
    >
      <Box className="skillsync-glow-grid" />
      <Card
        sx={{
          maxWidth: 1240,
          minHeight: "680px",
          width: "100%",
          borderRadius: "30px",
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.03))",
          backdropFilter: "blur(24px)",
          boxShadow: "0 30px 110px rgba(0,0,0,0.46), 0 0 60px rgba(124,58,237,0.16)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2.2, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToLogin}
              sx={{ color: "text.secondary" }}
            >
              Back to Login
            </Button>

            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <BrainCircuit size={22} color="#06B6D4" />
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  SkillSync AI Registration
                </Typography>
              </Box>
              <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                Build your Naukri-style career profile in guided AI-ready steps.
              </Typography>
            </Box>

            <Box sx={{ width: "120px" }} />
          </Box>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 3,
              p: 2,
              borderRadius: "22px",
              border: "1px solid rgba(255,255,255,0.08)",
              bgcolor: "rgba(255,255,255,0.035)",
            }}
          >
            {steps.map((label, index) => (
              <Step key={label} error={stepErrors[index] ? true : undefined}>
                <StepLabel error={stepErrors[index] ? true : undefined}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={2}>
              {renderStepContent(activeStep)}
            </Grid>
          </form>
        </CardContent>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            background: "rgba(5,8,22,0.76)",
            backdropFilter: "blur(18px)",
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
            sx={{ borderColor: "rgba(255,255,255,0.14)", color: "#fff" }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading}
            startIcon={activeStep === steps.length - 1 ? <UploadCloud size={17} /> : <Save size={17} />}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              "Submit"
            ) : (
              "Next"
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default RegistrationForm;
