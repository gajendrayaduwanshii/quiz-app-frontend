import { useState } from "react";
import {
  validateEmail,
  validatePhone,
  validateDate,
  validatePassword,
  validateExperienceYears,
} from "../helper/formValidationHelpers";

export default function useRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    gender: "",
    jobTitle: "",
    company: "",
    experienceYears: "",
    jobType: "",
    skills: [{ skill: "", level: "", experienceYears: "" }],
    certifications: "",
    resumeFile: null,
    uploadedResume: null,
    education: [{ degree: "", institution: "", year: "", grade: "" }],
    workExperience: [
      {
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});

  const validLevels = ["Beginner", "Intermediate", "Expert"];
  const validGenders = ["male", "female", "other"];
  const requiredStepFields = {
    0: ["name", "email", "phone", "dob", "gender", "password"],
    1: ["jobTitle", "company", "experienceYears", "jobType"],
    2: ["education"],
    3: ["workExperience"],
    4: ["skills"],
    5: ["resumeFile"],
  };

  const hasFilledValue = (value) => {
    if (typeof value === "boolean") return value;
    return value !== undefined && value !== null && String(value).trim() !== "";
  };

  const hasAnyRowValue = (row, keys) => keys.some((key) => hasFilledValue(row?.[key]));

  const hasErrors = (value) => {
    if (Array.isArray(value)) {
      return value.some((item) => hasErrors(item));
    }

    if (value && typeof value === "object") {
      return Object.values(value).some((item) => hasErrors(item));
    }

    return Boolean(value);
  };

  const validatePersonalInfo = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Enter a valid mobile number";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (!validateDate(formData.dob)) {
      newErrors.dob = "Invalid date of birth";
    } else if (new Date(formData.dob) > new Date()) {
      newErrors.dob = "Date of birth cannot be in the future";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    } else if (!validGenders.includes(formData.gender)) {
      newErrors.gender = "Select a valid gender";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const validateProfessionalSummary = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job Title is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.jobType.trim()) {
      newErrors.jobType = "Desired job type is required";
    }

    if (formData.experienceYears === "" || !validateExperienceYears(formData.experienceYears)) {
      newErrors.experienceYears = "Valid experience is required";
    }

    return newErrors;
  };

  const validateEducationRows = () => {
    const educationData = Array.isArray(formData.education) ? formData.education : [];
    const keys = ["degree", "institution", "year", "grade"];
    const startedRows = educationData.filter((item) => hasAnyRowValue(item, keys));
    const educationErrors = educationData.map((edu) => {
      const err = {};
      const rowStarted = hasAnyRowValue(edu, keys);

      if (!rowStarted) return err;

      if (!edu.degree?.trim()) err.degree = "Degree is required";
      if (!edu.institution?.trim()) err.institution = "Institution is required";
      if (!edu.year?.trim()) {
        err.year = "Passing year is required";
      } else if (!/^\d{4}$/.test(edu.year.trim())) {
        err.year = "Year must be a valid 4-digit year";
      }
      if (!edu.grade?.trim()) err.grade = "Grade/CGPA is required";

      return err;
    });

    if (!startedRows.length) {
      educationErrors[0] = {
        ...(educationErrors[0] || {}),
        degree: "Add at least one education row",
      };
    }

    return hasErrors(educationErrors) ? { education: educationErrors } : {};
  };

  const validateWorkExperienceRows = () => {
    const workData = Array.isArray(formData.workExperience) ? formData.workExperience : [];
    const keys = ["company", "title", "startDate", "endDate", "current", "description"];
    const startedRows = workData.filter((item) => hasAnyRowValue(item, keys));
    const workErrors = workData.map((work) => {
      const err = {};
      const rowStarted = hasAnyRowValue(work, keys);

      if (!rowStarted) return err;

      if (!work.company?.trim()) err.company = "Company is required";
      if (!work.title?.trim()) err.title = "Job title is required";
      if (!work.startDate) {
        err.startDate = "Start date is required";
      } else if (isNaN(new Date(work.startDate).getTime())) {
        err.startDate = "Invalid start date";
      }

      if (!work.current) {
        if (!work.endDate) {
          err.endDate = "End date is required";
        } else if (isNaN(new Date(work.endDate).getTime())) {
          err.endDate = "Invalid end date";
        } else if (work.startDate && new Date(work.endDate) < new Date(work.startDate)) {
          err.endDate = "End date cannot be before start date";
        }
      }

      if (!work.description?.trim()) err.description = "Description is required";

      return err;
    });

    if (!startedRows.length) {
      workErrors[0] = {
        ...(workErrors[0] || {}),
        company: "Add at least one work experience row",
      };
    }

    return hasErrors(workErrors) ? { workExperience: workErrors } : {};
  };

  const validateSkillRows = () => {
    const skillsData = Array.isArray(formData.skills) ? formData.skills : [];
    const keys = ["skill", "level", "experienceYears"];
    const startedRows = skillsData.filter((item) => hasAnyRowValue(item, keys));
    const skillsErrors = skillsData.map((skill) => {
      const err = {};
      const rowStarted = hasAnyRowValue(skill, keys);

      if (!rowStarted) return err;

      if (!skill.skill?.trim()) {
        err.skill = "Skill is required";
      }

      if (!skill.level || !validLevels.includes(skill.level)) {
        err.level = `Level must be one of: ${validLevels.join(", ")}`;
      }

      if (
        skill.experienceYears === undefined ||
        skill.experienceYears === "" ||
        isNaN(skill.experienceYears) ||
        Number(skill.experienceYears) < 0
      ) {
        err.experienceYears = "Valid experience is required";
      }

      return err;
    });

    if (!startedRows.length) {
      skillsErrors[0] = {
        ...(skillsErrors[0] || {}),
        skill: "Add at least one skill",
      };
    }

    return hasErrors(skillsErrors) ? { skills: skillsErrors } : {};
  };

  const validateResume = () => {
    if (!formData.resumeFile) {
      return { resumeFile: "Please upload your resume" };
    }

    if (formData.resumeFile.type !== "application/pdf") {
      return { resumeFile: "Please upload a PDF file for your resume" };
    }

    return {};
  };

  const validateStep = (step) => {
    const validators = {
      0: validatePersonalInfo,
      1: validateProfessionalSummary,
      2: validateEducationRows,
      3: validateWorkExperienceRows,
      4: validateSkillRows,
      5: validateResume,
    };
    const stepErrors = validators[step]?.() || {};

    setErrors((prev) => {
      const nextErrors = { ...prev };
      (requiredStepFields[step] || []).forEach((key) => {
        delete nextErrors[key];
      });
      return { ...nextErrors, ...stepErrors };
    });

    return Object.keys(stepErrors).length === 0;
  };

  const validate = () => {
    const newErrors = {
      ...validatePersonalInfo(),
      ...validateProfessionalSummary(),
      ...validateEducationRows(),
      ...validateWorkExperienceRows(),
      ...validateSkillRows(),
      ...validateResume(),
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const updatedErrors = { ...prev };

      switch (name) {
        case "jobTitle":
          if (value.trim()) updatedErrors.jobTitle = null;
          break;
        case "company":
          if (value.trim()) updatedErrors.company = null;
          break;
        case "experienceYears":
          if (!isNaN(value) && Number(value) >= 0)
            updatedErrors.experienceYears = null;
          break;
        case "jobType":
          if (value) updatedErrors.jobType = null;
          break;
        case "name":
          if (value.trim()) updatedErrors.name = null;
          break;
        case "email":
          if (validateEmail(value)) updatedErrors.email = null;
          break;
        case "phone":
          if (validatePhone(value)) updatedErrors.phone = null;
          break;
        case "dob":
          if (validateDate(value)) updatedErrors.dob = null;
          break;
        case "gender":
          if (value) updatedErrors.gender = null;
          break;
        case "password":
          if (validatePassword(value)) updatedErrors.password = null;
          break;
        case "certifications":
          if (value.trim()) updatedErrors.certifications = null;
          break;
        default:
          break;
      }

      return updatedErrors;
    });
  };

  const handleArrayChange = (field, index, key, value) => {
    setFormData((prev) => {
      const updated = [...(prev[field] || [])];

      if (!updated[index]) {
        updated[index] = {};
      }

      updated[index] = { ...updated[index], [key]: value };

      return { ...prev, [field]: updated };
    });

    if (errors[field]) {
      setErrors((prev) => {
        const newFieldErrors = [...prev[field]];
        if (newFieldErrors[index]) {
          if (newFieldErrors[index][key]) {
            newFieldErrors[index] = { ...newFieldErrors[index], [key]: null };
            return { ...prev, [field]: newFieldErrors };
          }
        }
        return prev;
      });
    }
  };

  const addField = (field, template) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), template],
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), {}],
      }));
    }
  };

  const removeField = (field, index) => {
    const updated = [...(formData[field] || [])];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));

    if (errors[field]) {
      const updatedErrors = [...(errors[field] || [])];
      updatedErrors.splice(index, 1);
      setErrors((prev) => ({ ...prev, [field]: updatedErrors }));
    }
  };

  const handleFileChange = (e) => {
    if (!e || !e.target || !e.target.files) return;

    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, resumeFile: file, uploadedResume: null }));

    if (errors.resumeFile) {
      setErrors((prev) => ({ ...prev, resumeFile: null }));
    }
  };

  return {
    formData,
    errors,
    validate,
    validateStep,
    handleChange,
    handleArrayChange,
    addField,
    removeField,
    handleFileChange,
    setFormData,
    setErrors,
  };
}
