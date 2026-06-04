import { generateAIText } from "@/lib/aiClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user, latestQuestions = [] } = req.body;
    
    if (!user) {
      return res.status(400).json({ error: 'User data is required' });
    }

    const skills = Array.isArray(user.skills) ? user.skills : [];
    const experience = user.yearsExperience || 0;
    const quizResults = Array.isArray(user.quizResult) ? user.quizResult : [];
    const educations = Array.isArray(user.educations) ? user.educations : [];
    const skillSummary = skills.slice(0, 12).map((skill) => ({
      name: skill.skillName || skill.skill || "Skill",
      level: skill.level || "Intermediate",
      yearsExperience: Number(skill.yearsExperience || skill.experienceYears || 0),
    }));
    const quizSummary = quizResults.slice(-5).map((quiz, index) => {
      const questions = Array.isArray(quiz?.quizQuestion) ? quiz.quizQuestion : [];
      const correct = questions.filter(
        (question) =>
          String(question?.answer || "").trim().toLowerCase() ===
          String(question?.correctAnswer || "").trim().toLowerCase()
      ).length;

      return {
        no: index + 1,
        technology: quiz?.technology || "Unknown",
        totalQuestions: questions.length,
        correct,
        accuracy: questions.length ? Math.round((correct / questions.length) * 100) : 0,
      };
    });
    const latestQuizQuestions = Array.isArray(latestQuestions)
      ? latestQuestions.slice(0, 10)
      : [];
    const latestQuizSummary = latestQuizQuestions.map((question, index) => ({
      no: index + 1,
      question: question?.question || "",
      userAnswer: question?.answer || "",
      correctAnswer: question?.correctAnswer || "",
      isCorrect:
        String(question?.answer || "").trim().toLowerCase() ===
        String(question?.correctAnswer || "").trim().toLowerCase(),
    }));

    const prompt = `
You are an expert AI learning coach for software developers.
Create a detailed, practical learning plan using only the profile data below. Avoid generic advice.

Developer profile:
- Years of experience: ${experience}
- Saved skills: ${JSON.stringify(skillSummary)}
- Education count: ${educations.length}
- Recent quiz performance: ${JSON.stringify(quizSummary)}
- Latest quiz answer review: ${JSON.stringify(latestQuizSummary)}

Rules:
- Be specific to the saved skills and quiz mistakes.
- If a skill has weak quiz accuracy, prioritize remediation before advanced topics.
- If quiz data is missing, create a baseline plan and ask the learner to take a quiz for measurement.
- Do not invent exact course prices, badges, streaks, or completed achievements.
- Prefer actionable steps, mini projects, practice drills, and measurable outcomes.
- Keep each card useful as a dashboard card: detailed, practical, and easy to scan.

Return one detailed AI-generated learning plan as plain text only.
Do not return JSON. Do not wrap the answer in markdown code fences.
Use these exact section headings:
Title
Personalized Summary
Profile Signals Used
Priority Focus Areas
Detailed Roadmap
Portfolio Project Plan
Quiz Improvement Plan
Recommended Resources
Weekly Schedule
Success Metrics

Make every section specific to the profile. Use bullets and numbered lists where helpful.
`;

    const output = await generateAIText(prompt, {
      temperature: 0.2,
      maxTokens: 3200,
    });

    const aiGeneratedContent = String(output || "").trim();

    if (!aiGeneratedContent) {
      throw new Error("AI response was empty");
    }

    const titleMatch = aiGeneratedContent.match(/(?:^|\n)\s*Title\s*:?\s*\n?(.+)/i);
    const recommendations = {
      detailedLearningPlan: {
        title: titleMatch?.[1]?.trim() || "AI-Based Detailed Learning Plan",
        aiGeneratedContent,
      },
    };
    
    res.status(200).json({ recommendations });
  } catch (error) {
    console.error('Error in /api/ai/learning-recommendations:', error);
    res.status(500).json({
      error:
        error?.message ||
        'Unable to generate AI learning recommendations right now',
    });
  }
}
