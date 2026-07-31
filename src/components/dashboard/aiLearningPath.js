import React, { useState } from 'react';
import { useLearningPath } from '../../customHooks/useLearningPath';

const AILearningPath = ({ user }) => {
  const [goal, setGoal] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('Part-time (5-10 hours/week)');
  const { learningData, loading, error, generateLearningPath } = useLearningPath();

  const handleGenerate = () => {
    if (goal && user) {
      generateLearningPath(user, goal, timeCommitment);
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
      <h3>📚 AI Learning Path Generator</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <input 
          type="text"
          placeholder="Enter learning goal (e.g., Master React, Learn Machine Learning)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', width: '300px' }}
        />
        <select 
          value={timeCommitment} 
          onChange={(e) => setTimeCommitment(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '4px' }}
        >
          <option value="Part-time (5-10 hours/week)">Part-time (5-10 hours/week)</option>
          <option value="Full-time (20+ hours/week)">Full-time (20+ hours/week)</option>
          <option value="Weekend only (5-8 hours/week)">Weekend only (5-8 hours/week)</option>
        </select>
        <button 
          onClick={handleGenerate}
          disabled={!goal || loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#6f42c1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate Path'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      {learningData && (
        <div>
          {learningData.overview && (
            <div style={{ marginBottom: '15px' }}>
              <h4>📋 Overview</h4>
              <p>{safeRender(learningData.overview)}</p>
            </div>
          )}

          {learningData.timeline && (
            <div style={{ marginBottom: '15px' }}>
              <h4>⏰ Timeline</h4>
              <p>{safeRender(learningData.timeline)}</p>
            </div>
          )}

          {learningData.phases && learningData.phases.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4>🎯 Learning Phases</h4>
              {learningData.phases.slice(0, 3).map((phase, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>{phase.phase}</strong> ({phase.duration})
                  <p><strong>Objectives:</strong> {phase.objectives}</p>
                  <p><strong>Topics:</strong> {phase.topics}</p>
                </div>
              ))}
            </div>
          )}

          {learningData.projects && learningData.projects.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4>🛠️ Recommended Projects</h4>
              {learningData.projects.slice(0, 3).map((project, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <strong>{project.name}</strong> ({project.difficulty})
                  <p>{project.description}</p>
                  <small>Technologies: {project.technologies} | Timeline: {project.timeline}</small>
                </div>
              ))}
            </div>
          )}

          {learningData.careerImpact && (
            <div style={{ marginBottom: '15px' }}>
              <h4>🚀 Career Impact</h4>
              <p>{safeRender(learningData.careerImpact)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AILearningPath;
