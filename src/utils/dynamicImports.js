import { lazy } from 'react';

// Dynamic imports for better code splitting
export const dynamicImports = {
  // Dashboard components
  DashboardHeader: lazy(() => import('../components/dashboard/dashboardHeader')),
  SummaryCards: lazy(() => import('../components/dashboard/summaryCards')),
  ChartsRow: lazy(() => import('../components/dashboard/chartsRow')),
  EducationSection: lazy(() => import('../components/dashboard/educationSection')),
  WorkExperienceSection: lazy(() => import('../components/dashboard/workExperienceSection')),
  CertificationsSection: lazy(() => import('../components/dashboard/certificationsSection')),
  UpskillInsightSection: lazy(() => import('../components/dashboard/upskillInsightSection')),
  DashboardInsightsSection: lazy(() => import('../components/dashboard/dashboardInsightsSection')),
  QuizResultsSummery: lazy(() => import('../components/dashboard/quizResultsSummery')),
  QuizResultsAccordion: lazy(() => import('../components/dashboard/quizResultsAccordion')),
  
  // Quiz components
  QuizModal: lazy(() => import('../components/quiz/QuizModal')),
  QuizStepper: lazy(() => import('../components/quiz/QuizStepper')),
  QuizQuestion: lazy(() => import('../components/quiz/QuizQuestion')),
  QuizTimer: lazy(() => import('../components/quiz/QuizTimer')),
  QuizActions: lazy(() => import('../components/quiz/QuizActions')),
  
  // Profile components
  BasicInfo: lazy(() => import('../components/profile/basicInfo')),
  SkillsSection: lazy(() => import('../components/profile/skillsSection')),
  WorkExperienceSection: lazy(() => import('../components/profile/workExperienceSection')),
  EducationSection: lazy(() => import('../components/profile/educationSection')),
  CertificationsSection: lazy(() => import('../components/profile/certificationsSection')),
  
  // Registration components
  PersonalInformation: lazy(() => import('../components/registration/personalInformation')),
  ProfessionalSummary: lazy(() => import('../components/registration/professionalSummary')),
  SkillsSection: lazy(() => import('../components/registration/skillsSection')),
  WorkExperienceSection: lazy(() => import('../components/registration/workExperienceSection')),
  EducationSection: lazy(() => import('../components/registration/educationSection')),
  CertificationsResumeSection: lazy(() => import('../components/registration/certificationsResumeSection')),
  
  // Common components
  Loader: lazy(() => import('../components/Loader')),
  LoaderTwo: lazy(() => import('../components/LoaderTwo')),
  LoaderThree: lazy(() => import('../components/loaderThree')),
  Header: lazy(() => import('../components/Header')),
  HeaderSidebar: lazy(() => import('../components/HeaderSidebar')),
  Sidebar: lazy(() => import('../components/Sidebar')),
  Layout: lazy(() => import('../components/Layout')),
};

// Helper function to get dynamic component
export const getDynamicComponent = (componentName) => {
  return dynamicImports[componentName] || null;
};

// Preload components for better UX
export const preloadComponents = (componentNames) => {
  componentNames.forEach(name => {
    if (dynamicImports[name]) {
      dynamicImports[name]();
    }
  });
};
