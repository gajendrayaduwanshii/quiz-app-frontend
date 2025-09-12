import { useState } from "react";
import {
  validateEmail,
  validatePhone,
  validateDate,
  validatePassword,
  validateExperienceYears,
  validateEducation,
  validateWorkExperience,
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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (!validateDate(formData.dob)) {
      newErrors.dob = "Invalid date";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job Title is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.jobType.trim()) {
      newErrors.jobType = "Professional summary is required";
    }

    if (!validateExperienceYears(formData.experienceYears)) {
      newErrors.experienceYears = "Invalid experience";
    }

    // Skills validation
    const skillsData = Array.isArray(formData.skills) ? formData.skills : [];
    if (!skillsData.length) {
      newErrors.skills = "Please add at least one skill";
    } else {
      const skillsErrors = skillsData.map((skill) => {
        const err = {};
        if (!skill.skill || skill.skill.trim() === "") {
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

      if (skillsErrors.some((e) => Object.keys(e).length > 0)) {
        newErrors.skills = skillsErrors;
      }
    }

    // Education validation
    const educationData = Array.isArray(formData.education) ? formData.education : [];
    const educationErrors = validateEducation(educationData);
    if (educationErrors.some((e) => Object.keys(e).length > 0)) {
      newErrors.education = educationErrors;
    }

    // Work experience validation
    const workData = Array.isArray(formData.workExperience) ? formData.workExperience : [];
    const workErrors = validateWorkExperience(workData);
    if (workErrors.some((e) => Object.keys(e).length > 0)) {
      newErrors.workExperience = workErrors;
    }

    if (
      formData.certifications !== undefined &&
      formData.certifications.trim().length === 0
    ) {
      newErrors.certifications = "Certifications cannot be empty";
    }

    if (!formData.resumeFile) {
      newErrors.resumeFile = "Please upload your resume";
    }

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
    setFormData((prev) => ({ ...prev, resumeFile: file }));

    if (errors.resumeFile) {
      setErrors((prev) => ({ ...prev, resumeFile: null }));
    }
  };

  return {
    formData,
    errors,
    validate,
    handleChange,
    handleArrayChange,
    addField,
    removeField,
    handleFileChange,
  };
}
