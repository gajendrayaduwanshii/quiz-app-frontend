const DashboardInsightsSection = ({ dashboardInsights }) => {
  const safeRender = (content) => {
    if (!content) return "";
    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.join(", ");
    if (typeof content === "object") return JSON.stringify(content, null, 2);
    return String(content);
  };

  return (
    <>
      {dashboardInsights.summary && (
        <div className="dashboard-section">
          <h3>🧾 Profile Summary</h3>
          <p>{safeRender(dashboardInsights.summary)}</p>
        </div>
      )}
      {dashboardInsights.rolesAndResponsibilities && (
        <div className="dashboard-section">
          <h3>🎯 Suitable Roles & Responsibilities</h3>
          <p>{safeRender(dashboardInsights.rolesAndResponsibilities)}</p>
        </div>
      )}
      {dashboardInsights.studyPlan && (
        <div className="dashboard-section">
          <h3>📚 Study & Focus Recommendations</h3>
          <p>{safeRender(dashboardInsights.studyPlan)}</p>
        </div>
      )}
    </>
  );
};

export default DashboardInsightsSection;
