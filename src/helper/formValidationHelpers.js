// Validate email format using a basic regex
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// Validate phone number: allows optional +, digits only, length 7-15
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  return /^\+?[0-9]{7,15}$/.test(phone.trim());
};

// Validate if input is a valid date string
export const validateDate = (date) => {
  if (!date) return false;
  const time = new Date(date).getTime();
  return !isNaN(time);
};

// Validate password length >= 6
export const validatePassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

// Validate experience years: must be number >= 0 (empty string invalid)
export const validateExperienceYears = (years) => {
  if (years === null || years === undefined) return false;
  const num = Number(years);
  return !isNaN(num) && num >= 0;
};

// Validate year as 4 digit number string, e.g., "2024"
export const validateYear = (year) => {
  if (!year || typeof year !== "string") return false;
  return /^\d{4}$/.test(year.trim());
};

// Validate array of education objects, returning array of error objects
export const validateEducation = (education) => {
  if (!Array.isArray(education)) return [];
  return education.map((edu) => {
    const errors = {};

    if (!(edu.degree && typeof edu.degree === "string" && edu.degree.trim()))
      errors.degree = "Degree is required";

    if (!(edu.institution && typeof edu.institution === "string" && edu.institution.trim()))
      errors.institution = "Institution is required";

    if (!(edu.year && typeof edu.year === "string" && edu.year.trim()))
      errors.year = "Passing year is required";
    else if (!validateYear(edu.year))
      errors.year = "Year must be a valid 4-digit year";

    if (!(edu.grade && typeof edu.grade === "string" && edu.grade.trim()))
      errors.grade = "Grade/CGPA is required";

    return errors;
  });
};

// Validate array of work experience objects, returning array of error objects
export const validateWorkExperience = (workExperience) => {
  if (!Array.isArray(workExperience)) return [];
  return workExperience.map((work) => {
    const errors = {};

    if (!(work.company && typeof work.company === "string" && work.company.trim()))
      errors.company = "Company is required";

    if (!(work.title && typeof work.title === "string" && work.title.trim()))
      errors.title = "Job title is required";

    // Validate start date
    if (!work.startDate) {
      errors.startDate = "Start date is required";
    } else if (isNaN(new Date(work.startDate).getTime())) {
      errors.startDate = "Invalid start date";
    }

    // Validate end date only if not current job
    if (!work.current) {
      if (!work.endDate) {
        errors.endDate = "End date is required";
      } else if (isNaN(new Date(work.endDate).getTime())) {
        errors.endDate = "Invalid end date";
      } else {
        // Check end date is not before start date
        const start = new Date(work.startDate).setHours(0, 0, 0, 0);
        const end = new Date(work.endDate).setHours(0, 0, 0, 0);

        if (end < start) {
          errors.endDate = "End date cannot be before start date";
        }
      }
    }

    if (!(work.description && typeof work.description === "string" && work.description.trim()))
      errors.description = "Description is required";

    return errors;
  });
};


