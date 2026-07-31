import VoiceInterviewAI from "./voiceInterviewAI";

export default function VoiceInterviewPage() {
  const mockQuestions = [
    { id: 1, question: "What is React?" },
    { id: 2, question: "Explain the virtual DOM." },
    { id: 3, question: "What are React hooks?" },
  ];

  return <VoiceInterviewAI questions={mockQuestions} />;
}