const WorkExperienceSection = ({ workExperiences }) => (
  <div className="dashboard-section">
    <h3>🏢 Work Experience</h3>
    <ul>
      {workExperiences?.map((job, i) => (
        <li key={i}>
          <strong>{job.jobTitle}</strong> @ {job.company} ({job.startDate} to{" "}
          {job.endDate || "Present"})
        </li>
      ))}
    </ul>
  </div>
);
export default WorkExperienceSection;