const DashboardHeader = ({ user, onLearningQuiz }) => (
  <div className="dashboard-header">
    <h2 className="page-title">Welcome, {user.name}</h2>

    <div className="headerButtons">
      {user.uploadResume?.url && (
        <a
          href={`http://localhost:1337${user.uploadResume.url}`}
          download={user.uploadResume.name || "resume.pdf"}
          className="custom-btn bg-btn-color-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Resume
        </a>
      )}

      <button className="bg-btn-color-1 custom-btn" onClick={onLearningQuiz}>
        Learning & Quiz 
      </button>
    </div>
  </div>
);

export default DashboardHeader;