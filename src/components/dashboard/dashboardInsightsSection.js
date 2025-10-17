const DashboardInsightsSection = ({ dashboardInsights }) => {
  const safeRender = (content) => {
    if (!content) return "";
    if (typeof content === "string") {
      return content.trim() === "" ? "" : content;
    }
    if (Array.isArray(content)) {
      return content.map(item => {
        if (typeof item === "object") {
          return JSON.stringify(item, null, 2);
        }
        return item;
      }).join("\n\n");
    }
    if (typeof content === "object") {
      // If it's an object, try to extract meaningful text
      if (content.text) return content.text;
      if (content.description) return content.description;
      if (content.value) return content.value;
      if (content.name) return content.name;
      // Otherwise return formatted JSON
      return JSON.stringify(content, null, 2);
    }
    return String(content);
  };

  if (!dashboardInsights) {
    return (
      <div className="dashboard-section">
        <h3>🤖 AI Insights</h3>
        <p>Loading insights...</p>
      </div>
    );
  }

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
      {dashboardInsights.skillGaps && (
        <div className="dashboard-section">
          <h3>⚠️ Critical Skill Gaps</h3>
          <p>{safeRender(dashboardInsights.skillGaps)}</p>
        </div>
      )}
      {dashboardInsights.marketInsights && (
        <div className="dashboard-section">
          <h3>📈 Market Insights & Trends</h3>
          <p>{safeRender(dashboardInsights.marketInsights)}</p>
        </div>
      )}
      {dashboardInsights.careerPath && (
        <div className="dashboard-section">
          <h3>🚀 Career Progression Path</h3>
          <p>{safeRender(dashboardInsights.careerPath)}</p>
        </div>
      )}
    </>
  );
};

export default DashboardInsightsSection;
