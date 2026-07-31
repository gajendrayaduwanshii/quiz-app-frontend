import React, { useState } from 'react';
import { useInterviewPrep } from '../../customHooks/useInterviewPrep';

const AIInterviewPrep = ({ user }) => {
  const [jobRole, setJobRole] = useState('');
  const [companyType, setCompanyType] = useState('Tech Startup');
  const { prepData, loading, error, prepareInterview } = useInterviewPrep();

  const handlePrepare = () => {
    if (jobRole && user) {
      prepareInterview(user, jobRole, companyType);
    }
  };

  const safeRender = (content) => {
    if (!content) return "";
    if (typeof content === "string") {
      return content.trim() === "" ? "" : content;
    }
    if (Array.isArray(content)) return content.join(", ");
    if (typeof content === "object") return JSON.stringify(content, null, 2);
    return String(content);
  };

  return (
    <div className="dashboard-section">
      <h3>💼 AI Interview Preparation</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text"
          placeholder="Enter job role (e.g., Frontend Developer, Full Stack Engineer)"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', width: '300px' }}
        />
        <select 
          value={companyType} 
          onChange={(e) => setCompanyType(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '4px' }}
        >
          <option value="Tech Startup">Tech Startup</option>
          <option value="FAANG Company">FAANG Company</option>
          <option value="Enterprise">Enterprise</option>
          <option value="Consulting">Consulting</option>
        </select>
        <button 
          onClick={handlePrepare}
          disabled={!jobRole || loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Preparing...' : 'Prepare Interview'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      {prepData && (
        <div>
          {prepData.technicalQuestions && prepData.technicalQuestions.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4>🔧 Technical Questions</h4>
              {prepData.technicalQuestions.slice(0, 3).map((q, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>Q: {q.question}</strong>
                  <p><strong>Answer:</strong> {q.answer}</p>
                  <small>Difficulty: {q.difficulty} | Category: {q.category}</small>
                </div>
              ))}
            </div>
          )}

          {prepData.behavioralQuestions && prepData.behavioralQuestions.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4>🤝 Behavioral Questions</h4>
              {prepData.behavioralQuestions.slice(0, 2).map((q, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>Q: {q.question}</strong>
                  <p><strong>Answer:</strong> {q.answer}</p>
                  <small>Category: {q.category}</small>
                </div>
              ))}
            </div>
          )}

          {prepData.salaryNegotiation && (
            <div style={{ marginBottom: '15px' }}>
              <h4>💰 Salary Negotiation</h4>
              <p><strong>Market Range:</strong> {safeRender(prepData.salaryNegotiation.marketRange)}</p>
              <p><strong>Negotiation Tips:</strong> {safeRender(prepData.salaryNegotiation.negotiationTips)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInterviewPrep;
