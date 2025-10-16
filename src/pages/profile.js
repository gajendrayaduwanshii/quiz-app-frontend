import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, IconButton, Box, Button, Grid } from "@mui/material";
import { Edit, Save, Cancel } from "@mui/icons-material";
import { useUser } from "@/customHooks/useUser";
import { useUserSummary } from "@/customHooks/useUserSummary";
import Loader from "@/components/Loader";

import BasicInfo from "../components/profile/basicInfo";
import SkillsSection from "../components/profile/skillsSection";
import WorkExperienceSection from "../components/profile/workExperienceSection";
import EducationSection from "../components/profile/educationSection";
import CertificationsSection from "../components/profile/certificationsSection";

const Profile = () => {
  const { user, loadingUser } = useUser();
  const { loadingDashboard } = useUserSummary();
  const documentId = user?.documentId;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    currentJobTitle: "",
    currentCompany: "",
    yearsExperience: "",
    desiredJobType: "",
    skills: [],
    workExperiences: [],
    educations: [],
    certifications: [],
    quizResult: [],
    uploadResume: null,
    password: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      router.push("/login");
      return;
    }
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        dob: user.dob || "",
        gender: user.gender || "",
        currentJobTitle: user.currentJobTitle || "",
        currentCompany: user.currentCompany || "",
        yearsExperience: user.yearsExperience || "",
        desiredJobType: user.desiredJobType || "",
        skills: user.skills || [],
        workExperiences: user.workExperiences || [],
        educations: user.educations || [],
        certifications: user.certifications || [],
        quizResult: user.quizResult || [],
        uploadResume: user.uploadResume || null,
        password: user.password || "",
      });
    }
  }, [user]);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const mapEducation = (educationArr) =>
    educationArr.map((edu) => ({
      degree: edu.degree,
      institution: edu.institution,
      passingYear: edu.passingYear || edu.year || "",
      grade: edu.grade,
    }));

  const mapWorkExperience = (workArr) =>
    workArr.map((work) => ({
      jobTitle: work.jobTitle || work.title || "",
      company: work.company || "",
      startDate: formatDate(work.startDate),
      endDate: work.current ? null : formatDate(work.endDate),
      jobDescription: work.jobDescription || work.description || "",
      current: work.current || false,
    }));

  const mapSkills = (skillsArr) =>
    skillsArr.map((skill) => ({
      skillName: skill.skillName || skill.skill || "",
      level: skill.level || "",
      yearsExperience: skill.yearsExperience || skill.experienceYears || "",
    }));

  const getAgeFromDOB = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleFileChange = (e) => {
    if (!e || !e.target || !e.target.files) return;
    const file = e.target.files[0];
    setProfileData((prev) => ({ ...prev, uploadResume: file }));
  };

  const handleSave = async () => {
    if (!documentId) {
      alert("User ID missing! Cannot save profile.");
      return;
    }

    setIsSaving(true);

    let uploadedFile = null;

    if (profileData.uploadResume instanceof File) {
      const formData = new FormData();
      formData.append("files", profileData.uploadResume);

      try {
        const uploadResponse = await axios.post(
          "http://localhost:1337/api/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedFile = uploadResponse.data[0]; 
      } catch (uploadErr) {
        console.error("Resume upload failed:", uploadErr);
        alert("Resume upload failed.");
        setIsSaving(false);
        return;
      }
    }

    const payload = {
      name: profileData.name,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber || "",
      dob: profileData.dob,
      gender: profileData.gender,
      currentJobTitle: profileData.currentJobTitle,
      currentCompany: profileData.currentCompany,
      yearsExperience: profileData.yearsExperience,
      desiredJobType: profileData.desiredJobType,
      certifications: profileData.certifications,
      password: profileData.password || undefined,

      uploadResume: uploadedFile
        ? uploadedFile.id
        : profileData.uploadResume?.id || null,

      skills: mapSkills(profileData.skills),
      workExperiences: mapWorkExperience(profileData.workExperiences),
      educations: mapEducation(profileData.educations),
    };

    try {
      const response = await axios.put(
        `http://localhost:1337/api/userlists/${documentId}`,
        { data: payload }
      );

      const updated = response.data?.data;

      if (updated) {
        setProfileData((prev) => ({
          ...prev,
          ...updated,
          uploadResume: uploadedFile || user.uploadResume || prev.uploadResume,
        }));

        alert("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error updating profile.");
    }

    setIsSaving(false);
  };

  if (loadingUser || loadingDashboard) {
    return <Loader />;
  }

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <h3 className="page-title" style={{marginBottom:'0'}}>User Profile</h3>
        <Box display="flex" alignItems="center" gap={1}>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              sx={{ mr: 1 }}
              disabled={isSaving}
              className="bg-btn-color-1 custom-btn"
            >
              Update
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setProfileData((prev) => ({
                  ...prev,
                  uploadResume: user.uploadResume,
                }));
              }}
              disabled={isSaving}
               className="custom-btn bg-btn-color-3"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
              setProfileData((prev) => ({
                ...prev,
                uploadResume:
                  prev.uploadResume instanceof File ? null : prev.uploadResume,
              }));
            }}
           className="custom-btn bg-btn-color-2"
          >
            Edit Profile
          </button>
        )}
        </Box>
      </Box>
     <Grid container spacing={0}>
      <BasicInfo
        profileData={profileData}
        isEditing={isEditing}
        handleChange={(field, value) =>
          setProfileData((prev) => ({ ...prev, [field]: value }))
        }
        getAgeFromDOB={getAgeFromDOB}
        handleFileChange={handleFileChange} // pass file handler here
      />

      <SkillsSection
        profileData={profileData}
        isEditing={isEditing}
        handleSkillChange={(index, field, value) => {
          const newSkills = [...profileData.skills];
          newSkills[index] = { ...newSkills[index], [field]: value };
          setProfileData((prev) => ({ ...prev, skills: newSkills }));
        }}
        addSkill={() =>
          setProfileData((prev) => ({
            ...prev,
            skills: [
              ...prev.skills,
              { id: Date.now(), skillName: "", level: "", yearsExperience: "" },
            ],
          }))
        }
        removeSkill={(index) =>
          setProfileData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
          }))
        }
      />

      <WorkExperienceSection
        profileData={profileData}
        isEditing={isEditing}
        handleWorkChange={(index, field, value) => {
          const newWork = [...profileData.workExperiences];
          newWork[index] = { ...newWork[index], [field]: value };
          setProfileData((prev) => ({ ...prev, workExperiences: newWork }));
        }}
        addWorkExperience={() =>
          setProfileData((prev) => ({
            ...prev,
            workExperiences: [
              ...prev.workExperiences,
              {
                id: Date.now(),
                company: "",
                jobTitle: "",
                startDate: "",
                endDate: "",
                jobDescription: "",
                current: false,
              },
            ],
          }))
        }
        removeWorkExperience={(index) =>
          setProfileData((prev) => ({
            ...prev,
            workExperiences: prev.workExperiences.filter((_, i) => i !== index),
          }))
        }
      />

      <EducationSection
        profileData={profileData}
        isEditing={isEditing}
        handleEducationChange={(index, field, value) => {
          const newEdu = [...profileData.educations];
          newEdu[index] = { ...newEdu[index], [field]: value };
          setProfileData((prev) => ({ ...prev, educations: newEdu }));
        }}
        addEducation={() =>
          setProfileData((prev) => ({
            ...prev,
            educations: [
              ...prev.educations,
              {
                id: Date.now(),
                degree: "",
                institution: "",
                passingYear: "",
                grade: "",
              },
            ],
          }))
        }
        removeEducation={(index) =>
          setProfileData((prev) => ({
            ...prev,
            educations: prev.educations.filter((_, i) => i !== index),
          }))
        }
      />

      <CertificationsSection
        profileData={profileData}
        isEditing={isEditing}
        handleCertificationChange={(index, field, value) => {
          const newCerts = [...profileData.certifications];
          newCerts[index] = { ...newCerts[index], [field]: value };
          setProfileData((prev) => ({ ...prev, certifications: newCerts }));
        }}
        addCertification={() =>
          setProfileData((prev) => ({
            ...prev,
            certifications: [
              ...prev.certifications,
              {
                id: Date.now(),
                name: "",
                issuingOrganization: "",
                issueDate: "",
                expirationDate: "",
              },
            ],
          }))
        }
        removeCertification={(index) =>
          setProfileData((prev) => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index),
          }))
        }
      />
      </Grid>
    </Box>
  );
};

export default Profile;
