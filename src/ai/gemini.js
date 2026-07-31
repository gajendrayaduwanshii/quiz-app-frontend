import React, { useState } from 'react';

const Gemini = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const callAIAPI = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tech: 'React',
          user: {
            yearsExperience: 1,
            skills: [{ skillName: 'React', level: 'Beginner', yearsExperience: 1 }],
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Error fetching response');
      }

      setResponse(JSON.stringify(data.questions || [], null, 2));
    } catch (error) {
      console.error('Error calling AI API:', error);
      setResponse('Error fetching response');
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={callAIAPI} disabled={loading}>
        {loading ? 'Loading...' : 'Ask AI'}
      </button>
      <pre><strong>Response:</strong> {response}</pre>
    </div>
  );
};

export default Gemini;
