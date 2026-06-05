import React, { useEffect, useState } from "react";
import { Avatar, Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { BriefcaseBusiness, Edit3, Mail, Save, ShieldCheck, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/customHooks/useUser";
import Loader from "@/components/Loader";
import PremiumCard from "@/components/premium/PremiumCard";
import PremiumButton from "@/components/premium/PremiumButton";
import SectionHeader from "@/components/premium/SectionHeader";
import PremiumPage from "@/components/premium/PremiumPage";
import { authService } from "@/services/authService";

import BasicInfo from "../components/profile/basicInfo";
import SkillsSection from "../components/profile/skillsSection";
import WorkExperienceSection from "../components/profile/workExperienceSection";
import EducationSection from "../components/profile/educationSection";
import CertificationsSection from "../components/profile/certificationsSection";

const Profile = () => {
  const router = useRouter();
  const { user, loading } = useUser();
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
    const storedUser = authService.getStoredUser();
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
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString().split("T")[0];
  };

  const mapEducation = (educationArr) =>
    (Array.isArray(educationArr) ? educationArr : []).map((edu) => ({
      degree: edu.degree || "",
      institution: edu.institution || "",
      passingYear: edu.passingYear || edu.year || "",
      grade: edu.grade || "",
    }));

  const mapWorkExperience = (workArr) =>
    (Array.isArray(workArr) ? workArr : []).map((work) => ({
      jobTitle: work.jobTitle || work.title || "",
      company: work.company || "",
      startDate: formatDate(work.startDate),
      endDate: work.current ? null : formatDate(work.endDate),
      jobDescription: work.jobDescription || work.description || "",
      current: work.current || false,
    }));

  const mapSkills = (skillsArr) =>
    (Array.isArray(skillsArr) ? skillsArr : []).map((skill) => ({
      skillName: skill.skillName || skill.skill || "",
      level: skill.level || "",
      yearsExperience: skill.yearsExperience || skill.experienceYears || "",
    }));

  const normalizeCertifications = (certifications) => {
    if (Array.isArray(certifications)) {
      return certifications
        .map((cert) => {
          if (typeof cert === "string") return cert;
          return cert?.name || cert?.title || cert?.certification || "";
        })
        .filter(Boolean)
        .join(", ");
    }

    return certifications || "";
  };

  const removeUndefinedFields = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

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
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await uploadResponse.json();
        if (uploadResponse.ok && result.file) {
          uploadedFile = result.file;
        } else {
          throw new Error(result.error || "Upload failed");
        } 
      } catch (uploadErr) {
        console.error("Resume upload failed:", uploadErr);
        alert("Resume upload failed.");
        setIsSaving(false);
        return;
      }
    }

    const payload = removeUndefinedFields({
      name: profileData.name,
      email: profileData.email,
      phoneNumber: profileData.phoneNumber || "",
      dob: formatDate(profileData.dob),
      gender: profileData.gender || "",
      currentJobTitle: profileData.currentJobTitle,
      currentCompany: profileData.currentCompany,
      yearsExperience: profileData.yearsExperience,
      desiredJobType: profileData.desiredJobType,
      certifications: normalizeCertifications(profileData.certifications),
      password: profileData.password || undefined,

      uploadResume: uploadedFile
        ? uploadedFile.id
        : profileData.uploadResume?.id || null,

      skills: mapSkills(profileData.skills),
      workExperiences: mapWorkExperience(profileData.workExperiences),
      educations: mapEducation(profileData.educations),
    });

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          data: payload,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      const updated = result.user;

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
      alert(err.message || "Error updating profile.");
    }

    setIsSaving(false);
  };

  if (loading) {
    return <Loader />;
  }

  const profileInitial = profileData.name?.[0]?.toUpperCase() || profileData.email?.[0]?.toUpperCase() || "S";
  const profileCompleteness = Math.min(
    100,
    35 +
      (profileData.skills?.length || 0) * 8 +
      (profileData.workExperiences?.length || 0) * 10 +
      (profileData.educations?.length || 0) * 8 +
      (profileData.uploadResume ? 12 : 0)
  );

  return (
    <PremiumPage className="profile-page" sx={{ pb: 4 }}>
      <PremiumCard hover={false} sx={{ p: { xs: 2.4, md: 3.4 }, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ width: "100%", minWidth: 0 }}
          >
            <Avatar
              sx={{
                width: 74,
                height: 74,
                fontSize: 30,
                fontWeight: 900,
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                boxShadow: "0 0 42px rgba(124,58,237,0.34)",
                border: "2px solid rgba(255,255,255,0.12)",
              }}
            >
              {profileInitial}
            </Avatar>
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Chip
                icon={<Sparkles size={14} />}
                label="SkillSync AI Profile"
                sx={{
                  mb: 1,
                  color: "#fff",
                  border: "1px solid rgba(6,182,212,0.32)",
                  bgcolor: "rgba(6,182,212,0.10)",
                }}
              />
              <Typography
                variant="h3"
                className="gradient-text"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.08,
                  fontSize: { xs: 30, sm: 36, md: 48 },
                  overflowWrap: "anywhere",
                }}
              >
                {profileData.name || "User Profile"}
              </Typography>
              <Stack direction="row" spacing={1.2} sx={{ mt: 1, flexWrap: "wrap", rowGap: 1 }}>
                <Chip icon={<Mail size={14} />} label={profileData.email || "No email"} />
                <Chip icon={<BriefcaseBusiness size={14} />} label={profileData.currentJobTitle || "Role pending"} />
                <Chip icon={<ShieldCheck size={14} />} label={`${profileCompleteness}% complete`} />
              </Stack>
            </Box>
          </Stack>

          <Box
            display="flex"
            alignItems="center"
            gap={1.2}
            flexWrap="wrap"
            sx={{ width: { xs: "100%", md: "auto" }, "& button": { width: { xs: "100%", sm: "auto" } } }}
          >
            {isEditing ? (
              <>
                <PremiumButton
                  onClick={handleSave}
                  disabled={isSaving}
                  startIcon={<Save size={17} />}
                >
                  {isSaving ? "Updating..." : "Update Profile"}
                </PremiumButton>
                <PremiumButton
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData((prev) => ({
                      ...prev,
                      uploadResume: user.uploadResume,
                    }));
                  }}
                  disabled={isSaving}
                  startIcon={<X size={17} />}
                  sx={{
                    background: "linear-gradient(135deg, #EF4444, #F59E0B)",
                    boxShadow: "0 16px 34px rgba(239,68,68,0.22)",
                  }}
                >
                  Cancel
                </PremiumButton>
              </>
            ) : (
              <PremiumButton
                onClick={() => {
                  setIsEditing(true);
                  setProfileData((prev) => ({
                    ...prev,
                    uploadResume:
                      prev.uploadResume instanceof File ? null : prev.uploadResume,
                  }));
                }}
                startIcon={<Edit3 size={17} />}
              >
                Edit Profile
              </PremiumButton>
            )}
          </Box>
        </Box>
      </PremiumCard>

      <SectionHeader
        eyebrow={isEditing ? "Update Mode" : "Profile Overview"}
        title={isEditing ? "Update Profile Details" : "Career Profile"}
        description={isEditing ? "Edit your profile information and save changes." : "Your current profile data synced from Strapi."}
      />
     <Grid container spacing={2.4}>
      <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 3 }, width: "100%" }}>
      <BasicInfo
        profileData={profileData}
        isEditing={isEditing}
        handleChange={(field, value) =>
          setProfileData((prev) => ({ ...prev, [field]: value }))
        }
        getAgeFromDOB={getAgeFromDOB}
        handleFileChange={handleFileChange} // pass file handler here
      />
      </PremiumCard>

      <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 3 }, width: "100%" }}>
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
      </PremiumCard>

      <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 3 }, width: "100%" }}>
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
      </PremiumCard>

      <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 3 }, width: "100%" }}>
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
      </PremiumCard>

      <PremiumCard hover={false} sx={{ p: { xs: 2.2, md: 3 }, width: "100%" }}>
      <CertificationsSection
        profileData={profileData}
        isEditing={isEditing}
        handleCertificationChange={(value) => {
          setProfileData((prev) => ({ ...prev, certifications: value }));
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
      </PremiumCard>
      </Grid>
    </PremiumPage>
  );
};

export default Profile;
