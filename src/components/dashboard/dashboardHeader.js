import React, { memo, useMemo } from 'react';

const DashboardHeader = memo(({ user, onLearningQuiz }) => {
  const resumeUrl = useMemo(() => {
    if (!user.uploadResume?.url) return null;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${user.uploadResume.url}`;
  }, [user.uploadResume?.url]);

  const resumeName = useMemo(() => {
    return user.uploadResume?.name || "resume.pdf";
  }, [user.uploadResume?.name]);

  return (
    <div className="dashboard-header">
      <h2 className="page-title">Welcome, {user.name}</h2>

      <div className="headerButtons">
        {resumeUrl && (
          <a
            href={resumeUrl}
            download={resumeName}
            className="custom-btn bg-btn-color-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Resume
          </a>
        )}

        <button className="bg-btn-color-1 custom-btn" onClick={onLearningQuiz}>
          Interactive Learning
        </button>
      </div>
    </div>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export default DashboardHeader;