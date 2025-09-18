const EducationSection = ({ educations }) => (
  <div className="dashboard-section">
    <h3>🎓 Education</h3>
    <ul>
      {educations?.map((edu, i) => (
        <li key={i}>
          {edu.degree} - {edu.institution} ({edu.passingYear}) - Grade: {edu.grade}%
        </li>
      ))}
    </ul>
  </div>
);
export default EducationSection;