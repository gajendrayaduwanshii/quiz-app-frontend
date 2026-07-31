export const dashboardService = {
  calculateLatestQuizScore(quizResults = []) {
    const latestQuiz = quizResults[quizResults.length - 1];
    const questions = latestQuiz?.quizQuestion || [];
    if (!questions.length) return 0;

    const correct = questions.filter(
      (question) => question.answer?.trim() === question.correctAnswer?.trim()
    ).length;

    return Math.round((correct / questions.length) * 100);
  },
};
