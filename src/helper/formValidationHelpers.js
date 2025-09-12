export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone) => /^\+?[0-9]{7,15}$/.test(phone);

export const validateDate = (date) => !isNaN(new Date(date).getTime());

export const validatePassword = (password) => password && password.length >= 6;

export const validateExperienceYears = (years) =>
  years !== "" && !isNaN(years) && Number(years) >= 0;

export const validateYear = (year) => /^\d{4}$/.test(year);

// ✅ This was missing
export const validateEducation = (education) => {
  return education.map((edu) => {
    const errors = {};

    if (!(edu.degree && edu.degree.trim()))
      errors.degree = "Degree is required";

    if (!(edu.institution && edu.institution.trim()))
      errors.institution = "Institution is required";

    if (!(edu.year && edu.year.trim()))
      errors.year = "Passing year is required";
    else if (!validateYear(edu.year))
      errors.year = "Year must be a valid 4-digit year";

    if (!(edu.grade && edu.grade.trim()))
      errors.grade = "Grade/CGPA is required";

    return errors;
  });
};

export const validateWorkExperience = (workExperience) => {
  return workExperience.map((work) => {
    const errors = {};

    if (!(work.company && work.company.trim()))
      errors.company = "Company is required";

    if (!(work.title && work.title.trim()))
      errors.title = "Job title is required";

    if (!work.startDate) {
      errors.startDate = "Start date is required";
    } else if (isNaN(new Date(work.startDate).getTime())) {
      errors.startDate = "Invalid start date";
    }

    if (!work.current) {
      if (!work.endDate) {
        errors.endDate = "End date is required";
      } else if (isNaN(new Date(work.endDate).getTime())) {
        errors.endDate = "Invalid end date";
      } else {
        const start = new Date(work.startDate).setHours(0, 0, 0, 0);
        const end = new Date(work.endDate).setHours(0, 0, 0, 0);

        if (end < start) {
          errors.endDate = "End date cannot be before start date";
        }
      }
    }

    if (!(work.description && work.description.trim()))
      errors.description = "Description is required";

    return errors;
  });
};
