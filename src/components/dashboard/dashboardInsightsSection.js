
const DashboardInsightsSection = ({ dashboardInsights }) => (
  <>
    {dashboardInsights.summary && (
      <div className="dashboard-section">
        <h3>🧾 Profile Summary</h3>
        <p>{dashboardInsights.summary}</p>
      </div>
    )}
    {dashboardInsights.rolesAndResponsibilities && (
      <div className="dashboard-section">
        <h3>🎯 Suitable Roles & Responsibilities</h3>
        <p>{dashboardInsights.rolesAndResponsibilities}</p>
      </div>
    )}
    {dashboardInsights.studyPlan && (
      <div className="dashboard-section">
        <h3>📚 Study & Focus Recommendations</h3>
        <p>{dashboardInsights.studyPlan}</p>
      </div>
    )}
  </>
);
export default DashboardInsightsSection;