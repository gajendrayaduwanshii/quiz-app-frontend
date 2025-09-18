import React, { useState } from 'react';

const Gemini = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const callGeminiAPI = async () => {
    setLoading(true);

    const apiKey = 'AIzaSyBmbAFhkkfrVBSIGGWOZ_Kp2P0GH_WuJu8';
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    const headers = {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    };

    const body = JSON.stringify({
      contents: [
        {
          parts: [
            {
              // Yeh prompt aapke user data ke hisaab se dynamic kar sakte ho
              text: 'Generate a JSON array of 20 quiz questions with options and answers based on user experience and skills in the following format: [{"id":1,"question":"...","answer":"...","options":[{"id":101,"option":"..."},{"id":102,"option":"..."}]}]'
            }
          ]
        }
      ],
    });

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      const data = await res.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response found.';

      console.log("Raw Gemini output:", output);

      try {
        // JSON extract karne ki koshish kar rahe hain (array ke form me)
        const jsonMatch = output.match(/\[.*\]/s);

        if (jsonMatch) {
          const quizData = JSON.parse(jsonMatch[0]);
          console.log("Parsed Quiz Questions:", quizData);
          setResponse(JSON.stringify(quizData, null, 2));
        } else {
          console.warn("JSON array not found in the response");
          setResponse("No valid JSON found in the response.");
        }
      } catch (parseError) {
        console.error("Error parsing Gemini JSON response:", parseError);
        setResponse("Failed to parse quiz questions JSON.");
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setResponse('Error fetching response');
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={callGeminiAPI} disabled={loading}>
        {loading ? 'Loading...' : 'Ask Gemini'}
      </button>
      <pre><strong>Response:</strong> {response}</pre>
    </div>
  );
};

export default Gemini;
