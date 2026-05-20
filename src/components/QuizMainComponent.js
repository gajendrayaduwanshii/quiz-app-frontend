import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/router";
import QuizModal from "./quiz/QuizModal";
import QuizStepper from "./quiz/QuizStepper";
import QuizQuestion from "./quiz/QuizQuestion";
import Timer from "./quiz/QuizTimer";
import QuizActions from "./quiz/QuizActions";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { BrainCircuit, CheckCircle2, Lightbulb, ListChecks, Shield, Sparkles } from "lucide-react";
import PremiumCard from "@/components/premium/PremiumCard";
import { escapeHtml, formatReportText } from "@/utils/textFormatting";

const getRandomQuestions = (questions, count = 10) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const createReportHtml = (report) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>SkillSync Quiz Report</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; line-height: 1.55; padding: 32px; }
      h1 { margin: 0 0 8px; }
      .meta { color: #64748B; margin-bottom: 24px; }
      pre { white-space: pre-wrap; font-family: inherit; }
      .report { border-top: 1px solid #E5E7EB; padding-top: 20px; }
    </style>
  </head>
  <body>
    <h1>SkillSync Quiz Report</h1>
    <div class="meta">Generated on ${new Date().toLocaleString()}</div>
    <pre class="report">${escapeHtml(formatReportText(report))}</pre>
  </body>
</html>`;

const QuizMainComponent = memo(({ questions, documentId, tech }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [startPromptOpen, setStartPromptOpen] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [reportText, setReportText] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  const timerRef = useRef(null);
  const router = useRouter();

  // Get random questions on load
  useEffect(() => {
    setSelectedQuestions(getRandomQuestions(questions));
  }, [questions]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!documentId) {
        alert("You are not logged in! Please login again.");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`/api/user/fetch?documentId=${documentId}`);
        const result = await response.json();
        
        if (response.ok && result.user) {
          setUserData(result.user);
        } else {
          console.error("Error fetching user data:", result.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [documentId, router]);

  // Start timer only after quiz starts
  useEffect(() => {
    if (startPromptOpen || submitted) return;

    if (timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else {
      handleSubmit(); // Auto submit on timeout
    }

    return () => clearInterval(timerRef.current);
  }, [startPromptOpen, timeLeft, submitted]);

  const handleNext = useCallback(() => {
    if (activeStep < selectedQuestions.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, selectedQuestions.length]);

  const handleBack = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  }, [activeStep]);

  const handleChange = useCallback((event) => {
    setAnswers((prev) => ({ ...prev, [activeStep]: event.target.value }));
  }, [activeStep]);

  const calculateResult = useCallback(() => {
    const correctCount = Object.keys(answers).reduce(
      (count, key) => count + (answers[key] === selectedQuestions[key]?.answer ? 1 : 0),
      0
    );
    return correctCount >= selectedQuestions.length / 2 ? "pass" : "fail";
  }, [answers, selectedQuestions]);

  const updateQuizResult = useCallback(async (quizResult) => {
    if (!userData) {
      alert("User data not loaded yet. Please wait...");
      return;
    }

    try {
      const existingQuizResults = Array.isArray(userData.quizResult) ? userData.quizResult : [];
      const updatedQuizResults = [...existingQuizResults, quizResult];

      const sanitizedQuizResults = updatedQuizResults.map(({ id, ...rest }) => {
        if (rest.quizQuestion && Array.isArray(rest.quizQuestion)) {
          rest.quizQuestion = rest.quizQuestion.map(({ id: qId, ...qRest }) => qRest);
        }
        return rest;
      });

      const updateResponse = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          data: {
            quizResult: sanitizedQuizResults,
          },
        }),
      });

      const result = await updateResponse.json();
      
      if (updateResponse.ok && result.user) {
        setUserData(result.user);
        
        // Trigger dashboard refresh
        localStorage.setItem('quizCompleted', 'true');
        window.dispatchEvent(new CustomEvent('quizCompleted'));
        
        // Also trigger storage event for same tab
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'quizCompleted',
          newValue: 'true',
          url: window.location.href
        }));
      } else {
        console.error("QuizMainComponent: Update failed", result);
      }
    } catch (error) {
      console.error("Error updating quiz result:", error.response?.data || error);
    }
  }, [documentId, userData]);

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);
    setOpen(true);
    clearInterval(timerRef.current);

    const quizResult = {
      result: calculateResult(),
      technology: tech,
      quizQuestion: selectedQuestions.map((question, index) => ({
        question: question.question,
        answer: answers[index] || null,
        correctAnswer: question.answer,
      })),
    };

    await updateQuizResult(quizResult);
  }, [calculateResult, tech, selectedQuestions, answers, updateQuizResult]);

  const handleShowResult = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleStartQuiz = useCallback(() => setStartPromptOpen(false), []);

 const handleRestartQuiz = async () => {
  clearInterval(timerRef.current);

  try {
    const response = await fetch(`/api/user/fetch?documentId=${documentId}`);
    const result = await response.json();
    
    if (response.ok && result.user) {
      setUserData(result.user);
    } else {
      console.error("Error fetching updated user data:", result.error);
    }
  } catch (error) {
    console.error("Error fetching updated user data:", error);
  }

  // Reset quiz state
  setOpen(false);
  setActiveStep(0);
	  setAnswers({});
	  setSubmitted(false);
	  setTimeLeft(300);
	  setReportText("");
	  setReportError("");
	  setSelectedQuestions(getRandomQuestions(questions));
	  setStartPromptOpen(true);
	};

  const handleGoToDashboard = useCallback(() => router.push("/dashboard"), [router]);
  const handleGoBack = useCallback(() => router.back(), [router]);

  const correctCount = useMemo(() => {
    return Object.keys(answers).reduce(
      (count, key) => count + (answers[key] === selectedQuestions[key]?.answer ? 1 : 0),
      0
    );
  }, [answers, selectedQuestions]);

  const incorrectCount = useMemo(() => {
    return selectedQuestions.length - correctCount;
  }, [selectedQuestions.length, correctCount]);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter(Boolean).length;
  }, [answers]);

  const progress = useMemo(() => {
    if (!selectedQuestions.length) return 0;
    return Math.round(((activeStep + 1) / selectedQuestions.length) * 100);
  }, [activeStep, selectedQuestions.length]);

  const quizTitle = tech ? `${String(tech).toUpperCase()} Assessment` : "AI Skill Assessment";

  const currentQuizResult = useMemo(() => ({
    result: calculateResult(),
    technology: tech,
    score: selectedQuestions.length
      ? Math.round((correctCount / selectedQuestions.length) * 100)
      : 0,
    correctCount,
    incorrectCount,
    totalQuestions: selectedQuestions.length,
    quizQuestion: selectedQuestions.map((question, index) => ({
      question: question.question,
      answer: answers[index] || null,
      correctAnswer: question.answer,
    })),
  }), [answers, calculateResult, correctCount, incorrectCount, selectedQuestions, tech]);

  const generateQuizReport = useCallback(async () => {
    if (reportText) return reportText;
    if (!userData) {
      setReportError("User data is still loading. Please try again shortly.");
      return "";
    }

    setReportLoading(true);
    setReportError("");

    try {
      const response = await fetch("/api/ai/quiz-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userData,
          quizResult: currentQuizResult,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to generate the report.");
      }

      const formattedReport = formatReportText(result.report || "");
      setReportText(formattedReport);
      if (result.warning) {
        setReportError(result.warning);
      }
      return formattedReport;
    } catch (error) {
      setReportError(error.message || "Unable to generate the report.");
      return "";
    } finally {
      setReportLoading(false);
    }
  }, [currentQuizResult, reportText, userData]);

  const handleDownloadReport = useCallback(async () => {
    const report = formatReportText(await generateQuizReport());
    if (!report || typeof window === "undefined") return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      setReportError("The popup was blocked. Please allow popups in your browser and try the PDF download again.");
      return;
    }

    printWindow.document.write(createReportHtml(report));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }, [generateQuizReport]);

  const handleEmailReport = useCallback(async () => {
    const report = formatReportText(await generateQuizReport());
    if (!report || typeof window === "undefined") return;

    window.location.href = `mailto:?subject=${encodeURIComponent(
      "SkillSync Quiz Report"
    )}&body=${encodeURIComponent(report)}`;
  }, [generateQuizReport]);

  const handleShareReportLink = useCallback(async () => {
    const report = formatReportText(await generateQuizReport());
    if (!report || typeof window === "undefined") return;

    const reportId = `quiz-report-${Date.now()}`;
    localStorage.setItem(
      `skillsyncQuizReport:${reportId}`,
      JSON.stringify({
        title: `${quizTitle} Report`,
        generatedAt: new Date().toISOString(),
        report,
      })
    );

    const reportUrl = `${window.location.origin}/quiz-report?reportId=${encodeURIComponent(reportId)}`;

    if (navigator.share) {
      await navigator.share({ title: "SkillSync Quiz Report", url: reportUrl });
      return;
    }

    await navigator.clipboard.writeText(reportUrl);
    setReportError("Shareable report link clipboard me copy ho gaya.");
  }, [generateQuizReport, quizTitle]);

  return (
    <>
      <QuizModal
        open={startPromptOpen}
        onStart={handleStartQuiz}
        title="Start the Quiz?"
        description="You have 5 minutes to complete the test."
        handleGoBack={handleGoBack}
      />
      {!startPromptOpen && (
        <Box
          sx={{
            minHeight: "calc(100vh - 160px)",
            px: { xs: 1, md: 2 },
            py: { xs: 1.5, md: 2.5 },
          }}
        >
          <PremiumCard
            hover={false}
            sx={{
              p: { xs: 2, md: 3 },
              mb: 2.5,
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.94), rgba(17,24,39,0.82)), radial-gradient(circle at 10% 0%, rgba(34,211,238,0.20), transparent 34%), radial-gradient(circle at 92% 8%, rgba(124,58,237,0.22), transparent 30%)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Chip
                  icon={<Sparkles size={15} />}
                  label="Premium Quiz Mode"
                  sx={{
                    mb: 1.2,
                    color: "#CFFAFE",
                    bgcolor: "rgba(6,182,212,0.12)",
                    border: "1px solid rgba(103,232,249,0.20)",
                    fontWeight: 800,
                  }}
                />
                <Typography variant="h4" sx={{ fontWeight: 950, letterSpacing: 0 }}>
                  {quizTitle}
                </Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary", maxWidth: 680 }}>
                  Answer with focus. Your score and selected answers will be saved to the dashboard.
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "row", sm: "row" }}
                spacing={1}
                sx={{ width: { xs: "100%", md: "auto" }, flexWrap: "wrap" }}
              >
                <Chip
                  icon={<BrainCircuit size={16} />}
                  label={`Question ${activeStep + 1}/${selectedQuestions.length}`}
                  sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", fontWeight: 800 }}
                />
                <Chip
                  icon={<CheckCircle2 size={16} />}
                  label={`${answeredCount} Answered`}
                  sx={{ color: "#fff", bgcolor: "rgba(34,197,94,0.13)", fontWeight: 800 }}
                />
                <Chip
                  icon={<ListChecks size={16} />}
                  label={`${progress}% Progress`}
                  sx={{ color: "#fff", bgcolor: "rgba(124,58,237,0.16)", fontWeight: 800 }}
                />
              </Stack>
            </Stack>
          </PremiumCard>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 320px" },
              gap: 2.2,
              alignItems: "start",
            }}
          >
            <Box>
              <QuizStepper
                activeStep={activeStep}
                questions={selectedQuestions}
                answers={answers}
                submitted={submitted}
              />
              <QuizQuestion
                question={selectedQuestions[activeStep]?.question}
                options={selectedQuestions[activeStep]?.options}
                value={answers[activeStep]}
                onChange={handleChange}
                submitted={submitted}
                answer={selectedQuestions[activeStep]?.answer}
                questionNumber={activeStep + 1}
                totalQuestions={selectedQuestions.length}
              />
              <QuizActions
                activeStep={activeStep}
                totalQuestions={selectedQuestions.length}
                onNext={handleNext}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onRestart={handleRestartQuiz}
                onGoToDashboard={handleGoToDashboard}
                answers={answers}
                submitted={submitted}
                showResultModal={handleShowResult}
              />
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
              <Timer
                timeLeft={timeLeft}
                totalSeconds={300}
                answeredCount={answeredCount}
                totalQuestions={selectedQuestions.length}
              />
              <PremiumCard hover={false} glow="rgba(6,182,212,0.14)" sx={{ p: 2.2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.4 }}>
                  <Lightbulb size={18} color="#F59E0B" />
                  <Typography sx={{ fontWeight: 950 }}>AI Focus Coach</Typography>
                </Stack>
                <Stack spacing={1}>
                  {[
                    { icon: Shield, text: "Read every option before selecting the closest production-safe answer." },
                    { icon: BrainCircuit, text: "Architecture and best-practice questions often reward tradeoff thinking." },
                    { icon: CheckCircle2, text: `${answeredCount}/${selectedQuestions.length} answered. Keep a steady pace.` },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Box
                        key={item.text}
                        sx={{
                          display: "flex",
                          gap: 1,
                          p: 1.15,
                          borderRadius: "14px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          bgcolor: "rgba(255,255,255,0.035)",
                        }}
                      >
                        <Icon size={15} color="#06B6D4" style={{ marginTop: 2, flex: "0 0 auto" }} />
                        <Typography sx={{ color: "text.secondary", fontSize: 12.5, lineHeight: 1.55 }}>
                          {item.text}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </PremiumCard>
            </Box>
          </Box>
          <QuizModal
            open={open}
            onClose={handleClose}
            title="Quiz Submitted!"
            description={`Correct: ${correctCount}, Wrong: ${incorrectCount}`}
            correctCount={correctCount}
            incorrectCount={incorrectCount}
            onRestart={handleRestartQuiz}
            onDownloadReport={handleDownloadReport}
            onEmailReport={handleEmailReport}
            onShareReportLink={handleShareReportLink}
            reportLoading={reportLoading}
            reportError={reportError}
          />
        </Box>
      )}
    </>
  );
});

QuizMainComponent.displayName = 'QuizMainComponent';

export default QuizMainComponent;
