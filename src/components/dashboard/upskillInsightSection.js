const UpskillInsightSection = ({ years , getUpskillSuggestion }) => (
  <div className="dashboard-section">
    <h3>🧠 Upskill Insight</h3>
    <p>
      <strong>Suggestion:</strong> {getUpskillSuggestion(years)}
    </p>
  </div>
);
export default UpskillInsightSection;