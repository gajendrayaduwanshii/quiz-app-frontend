import React, { useState } from 'react';
import { useSkillAssessment } from '../../customHooks/useSkillAssessment';

const AISkillAssessment = ({ user }) => {
  const [selectedSkill, setSelectedSkill] = useState('');
  const { assessmentData, loading, error, assessSkill } = useSkillAssessment();

  const handleAssess = () => {
    if (selectedSkill && user) {
      assessSkill(user, selectedSkill);
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
      <h3>🎯 AI Skill Assessment</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <select 
          value={selectedSkill} 
          onChange={(e) => setSelectedSkill(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '4px' }}
        >
          <option value="">Select a skill to assess</option>
          {user?.skills?.map((skill, index) => (
            <option key={index} value={skill.skillName}>
              {skill.skillName} ({skill.level})
            </option>
          ))}
        </select>
        <button 
          onClick={handleAssess}
          disabled={!selectedSkill || loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Assessing...' : 'Assess Skill'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      {assessmentData && (
        <div>
          {assessmentData.currentLevel && (
            <div style={{ marginBottom: '15px' }}>
              <h4>📊 Current Level</h4>
              <p>{safeRender(assessmentData.currentLevel)}</p>
            </div>
          )}
          
          {assessmentData.skillScore && (
            <div style={{ marginBottom: '15px' }}>
              <h4>⭐ Skill Score: {assessmentData.skillScore}/10</h4>
            </div>
          )}

          {assessmentData.strengths && (
            <div style={{ marginBottom: '15px' }}>
              <h4>💪 Strengths</h4>
              <p>{safeRender(assessmentData.strengths)}</p>
            </div>
          )}

          {assessmentData.weaknesses && (
            <div style={{ marginBottom: '15px' }}>
              <h4>⚠️ Areas for Improvement</h4>
              <p>{safeRender(assessmentData.weaknesses)}</p>
            </div>
          )}

          {assessmentData.learningPath && (
            <div style={{ marginBottom: '15px' }}>
              <h4>📚 Learning Path</h4>
              <p>{safeRender(assessmentData.learningPath)}</p>
            </div>
          )}

          {assessmentData.nextSteps && (
            <div style={{ marginBottom: '15px' }}>
              <h4>🚀 Next Steps</h4>
              <p>{safeRender(assessmentData.nextSteps)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISkillAssessment;
