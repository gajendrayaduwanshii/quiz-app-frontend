import { lazy, Suspense } from 'react';
import LoaderTwo from './LoaderTwo';

// Lazy load heavy components
export const LazyDashboardInsightsSection = lazy(() => 
  import('./dashboard/dashboardInsightsSection')
);

export const LazyQuizResultsAccordion = lazy(() => 
  import('./dashboard/quizResultsAccordion')
);

export const LazyChartsRow = lazy(() => 
  import('./dashboard/chartsRow')
);

export const LazyEducationSection = lazy(() => 
  import('./dashboard/educationSection')
);

export const LazyWorkExperienceSection = lazy(() => 
  import('./dashboard/workExperienceSection')
);

export const LazyCertificationsSection = lazy(() => 
  import('./dashboard/certificationsSection')
);

export const LazyUpskillInsightSection = lazy(() => 
  import('./dashboard/upskillInsightSection')
);

export const LazyQuizResultsSummery = lazy(() => 
  import('./dashboard/quizResultsSummery')
);

// Wrapper components with Suspense
export const DashboardInsightsSection = (props) => (
  <Suspense fallback={<LoaderTwo text="Loading insights..." />}>
    <LazyDashboardInsightsSection {...props} />
  </Suspense>
);

export const QuizResultsAccordion = (props) => (
  <Suspense fallback={<LoaderTwo text="Loading quiz results..." />}>
    <LazyQuizResultsAccordion {...props} />
  </Suspense>
);

export const ChartsRow = (props) => (
  <Suspense fallback={<LoaderTwo text="Loading charts..." />}>
    <LazyChartsRow {...props} />
  </Suspense>
);

export const EducationSection = (props) => (
  <Suspense fallback={<LoaderTwo text="Loading education..." />}>
    <LazyEducationSection {...props} />
  </Suspense>
);

export const WorkExperienceSection = (props) => (
  <Suspense fallback={<LoaderTwo text="Loading work experience..." />}>
    <LazyWorkExperienceSection {...props} />
  </Suspense>
);

export const CertificationsSection = (props) => (
  <Suspense fallback={<LoaderTwo text="Loading certifications..." />}>
    <LazyCertificationsSection {...props} />
  </Suspense>
);

export const UpskillInsightSection = (props) => (
  <Suspense fallback={<LoaderTwo text="Loading insights..." />}>
    <LazyUpskillInsightSection {...props} />
  </Suspense>
);

export const QuizResultsSummery = (props) => (
  <Suspense fallback={<LoaderTwo text="Loading quiz summary..." />}>
    <LazyQuizResultsSummery {...props} />
  </Suspense>
);
