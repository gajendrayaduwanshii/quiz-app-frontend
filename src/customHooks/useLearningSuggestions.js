import { useMemo } from "react";

export const useLearningSuggestions = (user, questions) => {
  const suggestions = useMemo(() => {
    if (!user) return [];

    const skills = Array.isArray(user.skills)
      ? user.skills.filter((skill) => skill?.skillName)
      : [];
    const attemptedQuestions = Array.isArray(questions) ? questions : [];
    const weakQuestions = attemptedQuestions.filter((question) => {
      const answer = typeof question.answer === "string" ? question.answer.trim() : "";
      const correctAnswer =
        typeof question.correctAnswer === "string" ? question.correctAnswer.trim() : "";
      return correctAnswer && answer !== correctAnswer;
    });

    const levelRank = {
      Beginner: 0,
      Intermediate: 1,
      Expert: 2,
    };

    const focusSkills = [...skills]
      .sort((a, b) => {
        const levelDiff = (levelRank[a.level] ?? 1) - (levelRank[b.level] ?? 1);
        if (levelDiff !== 0) return levelDiff;
        return Number(a.yearsExperience || 0) - Number(b.yearsExperience || 0);
      })
      .slice(0, 3);
    const strongestSkill = [...skills].sort(
      (a, b) => Number(b.yearsExperience || 0) - Number(a.yearsExperience || 0)
    )[0];

    const generatedSuggestions = [];

    if (focusSkills.length) {
      generatedSuggestions.push({
        title: "Priority Skill Roadmap",
        detail: focusSkills
          .map(
            (skill, index) =>
              `${index + 1}. ${skill.skillName}: revise fundamentals, build one mini project, and complete a 10-question practice quiz.`
          )
          .join("\n"),
      });
    } else {
      generatedSuggestions.push({
        title: "Build Your First Skill Roadmap",
        detail:
          "Add your skills from the profile page, then start with one core skill, one practice project, and one quiz. SkillSync AI will use that data to make this page more personalized.",
      });
    }

    if (weakQuestions.length) {
      generatedSuggestions.push({
        title: "Fix Weak Quiz Topics",
        detail: weakQuestions
          .slice(0, 5)
          .map(
            (question, index) =>
              `${index + 1}. Revisit: ${question.question}\n   Correct answer: ${question.correctAnswer}`
          )
          .join("\n\n"),
      });
    }

    if (strongestSkill) {
      generatedSuggestions.push({
        title: `Showcase ${strongestSkill.skillName}`,
        detail:
          "Create one portfolio-ready project, write 4-5 bullet points about the problem you solved, and add measurable impact to your resume/profile.",
      });
    }

    generatedSuggestions.push(
      {
        title: "7-Day Learning Sprint",
        detail:
          "Day 1-2: revise core concepts from your weakest skill.\nDay 3-4: build a small practical example.\nDay 5: take a quiz and review wrong answers.\nDay 6: write interview notes.\nDay 7: retake the quiz and compare your score.",
      },
      {
        title: "Interview Preparation",
        detail:
          "Prepare short answers for fundamentals, one real project explanation, common debugging scenarios, and trade-offs for your strongest skill.",
      }
    );

    return generatedSuggestions;
  }, [user, questions]);

  return { suggestions, loadingSuggestions: false };
};
