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
    formData.append("files", file);

    try {
      const res = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data[0]; // uploaded file object
      } else {
        console.error("Unexpected response format from upload:", res.data);
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
      const res = await axios.post(`${STRAPI_URL}/api/userlists`, payload);
      return res.data;
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

      if (!formData.resumeFile) {
        alert("Please upload your resume PDF file");
        return;
      }

      if (formData.resumeFile.type !== "application/pdf") {
        alert("Please upload a PDF file for your resume");
        return;
      }

      setLoading(true);

      try {
        // 1. Upload resume file
        const uploadedFile = await uploadFileToStrapi(formData.resumeFile);

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
        resumeFile: uploadedFile,
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
            resumeFile: errors.resumeFile,
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
      }}
    >
      <Card
        sx={{
          maxWidth: 1200,
          minHeight: "600px",
          width: "100%",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
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
              sx={{ textTransform: "none" }}
            >
              Back to Login
            </Button>

            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", flexGrow: 1, textAlign: "center" }}
              gutterBottom
            >
              Registration
            </Typography>

            <Box sx={{ width: "120px" }} />
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
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
            borderTop: "1px solid rgba(0,0,0,0.12)",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "background.paper",
            position: "sticky",
            bottom: 0,
            zIndex: 10,
          }}
        >
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading}
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
