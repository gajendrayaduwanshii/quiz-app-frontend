const SummaryCards = ({ user, strongest, weakest, years }) => (
  <div className="summarySection">
    <div className="summaryCard">
      <h4>💼 Current Job</h4>
      <p>
        {user.currentJobTitle} @ {user.currentCompany}
      </p>
    </div>
    <div className="summaryCard">
      <h4>🧑‍💻 Experience</h4>
      <p>{years} years</p>
    </div>
    <div className="summaryCard">
      <h4>💪 Strongest Skill</h4>
      <p>
        {strongest[0]} ({strongest[1]} yrs)
      </p>
    </div>
    <div className="summaryCard">
      <h4>🛠️ Weakest Skill</h4>
      <p>
        {weakest[0]} ({weakest[1]} yrs)
      </p>
    </div>
  </div>
);

export default SummaryCards;