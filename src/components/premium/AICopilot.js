import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Fab,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { authService } from "@/services/authService";
import { normalizeAIText } from "@/utils/textFormatting";
import PremiumButton from "./PremiumButton";

const starterPrompts = [
  "Summarize my weakest topics",
  "Create a 7-day quiz plan",
  "What should I improve in my resume?",
];

const initialMessages = [
  {
    role: "assistant",
    content:
      "Hi, I am SkillSync Chatbot. I will answer using your profile, skills, resume, and quiz data.",
  },
];

const chatButtonBottom = { xs: 18, md: 24 };
const chatPanelBottom = { xs: 154, md: 168 };

const AICopilot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  const documentId = useMemo(() => authService.getStoredUser()?.documentId, []);

  const loadUserData = useCallback(async () => {
    if (!documentId) return null;
    if (userData) return userData;
    if (loadingUser) return null;

    setLoadingUser(true);
    setError("");

    try {
      const response = await fetch(`/api/user/fetch?documentId=${documentId}`);
      const result = await response.json();

      if (!response.ok || !result.user) {
        throw new Error(result.error || "Unable to load user data");
      }

      setUserData(result.user);
      return result.user;
    } catch (err) {
      setError(err.message || "Unable to load user data.");
      return null;
    } finally {
      setLoadingUser(false);
    }
  }, [documentId, loadingUser, userData]);

  useEffect(() => {
    if (open) {
      loadUserData();
    }
  }, [loadUserData, open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const askChatbot = useCallback(
    async (messageText) => {
      const trimmed = messageText.trim();
      if (!trimmed || sending) return "";

      setError("");

      let contextUser = userData;
      if (!contextUser) {
        contextUser = await loadUserData();
      }

      if (!contextUser) {
        setError("Please wait until your user data is loaded, then try again.");
        return "";
      }

      const nextMessages = [...messages, { role: "user", content: trimmed }];
      setMessages(nextMessages);
      setInput("");
      setSending(true);

      try {
        const response = await fetch("/api/ai/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            user: contextUser,
            history: messages,
            pageUrl: typeof window !== "undefined" ? window.location.pathname : "",
          }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Chatbot failed");
        }

        const answer = normalizeAIText(
          result.answer || "I could not generate an answer for this request."
        );
        setMessages((current) => [...current, { role: "assistant", content: answer }]);

        return answer;
      } catch (err) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content:
              "Sorry, I am unable to generate a response right now. Please try again shortly.",
          },
        ]);
        setError(err.message || "AI request failed.");
        return "";
      } finally {
        setSending(false);
      }
    },
    [loadUserData, messages, sending, userData]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    askChatbot(input);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            sx={{
              position: "fixed",
              right: { xs: 14, md: 24 },
              bottom: chatPanelBottom,
              width: { xs: "calc(100vw - 28px)", sm: 420 },
              maxHeight: {
                xs: "calc(100dvh - 170px)",
                md: "calc(100dvh - 192px)",
              },
              zIndex: 1500,
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "linear-gradient(145deg, rgba(11,17,32,0.98), rgba(5,8,22,0.96))",
              boxShadow: "0 30px 90px rgba(0,0,0,0.55), 0 0 46px rgba(6,182,212,0.16)",
              backdropFilter: "blur(24px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: "14px", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #2563EB, #14B8A6)" }}>
                  <Bot size={19} color="#fff" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 950 }}>SkillSync Chatbot</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.75rem", overflowWrap: "anywhere" }}>
                    {loadingUser ? "Loading your data..." : "Answers from your profile, resume, and quizzes"}
                  </Typography>
                </Box>
              </Stack>
              <IconButton onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}>
                <X size={18} />
              </IconButton>
            </Stack>

            <Box
              ref={scrollRef}
              sx={{
                p: { xs: 1.5, sm: 2 },
                height: { xs: "auto", sm: 350 },
                minHeight: 180,
                flex: 1,
                overflowY: "auto",
              }}
            >
              <Stack spacing={1.2}>
                {messages.map((message, index) => {
                  const isUser = message.role === "user";
                  return (
                    <Box
                      key={`${message.role}-${index}`}
                      sx={{
                        alignSelf: isUser ? "flex-end" : "flex-start",
                        maxWidth: "88%",
                        p: 1.25,
                        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        bgcolor: isUser ? "rgba(20,184,166,0.18)" : "rgba(255,255,255,0.055)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: isUser ? "#ECFEFF" : "text.secondary",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        fontSize: "0.8125rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {normalizeAIText(message.content)}
                    </Box>
                  );
                })}

                {sending && (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                    <CircularProgress size={16} />
                    <span>AI thinking...</span>
                  </Stack>
                )}
              </Stack>
            </Box>

            <Stack spacing={1.25} sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {error && (
                <Alert severity={error.includes("copy") ? "success" : "warning"} sx={{ py: 0.25, fontSize: "0.75rem" }}>
                  {error}
                </Alert>
              )}

              <Stack direction="row" spacing={0.8} sx={{ overflowX: "auto", pb: 0.3 }}>
                {starterPrompts.map((prompt) => (
                  <Box
                    component="button"
                    key={prompt}
                    type="button"
                    onClick={() => askChatbot(prompt)}
                    disabled={sending || loadingUser}
                    sx={{
                      flex: "0 0 auto",
                      border: "1px solid rgba(255,255,255,0.10)",
                      bgcolor: "rgba(255,255,255,0.045)",
                      color: "#CBD5E1",
                      borderRadius: "999px",
                      px: 1.2,
                      py: 0.75,
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    {prompt}
                  </Box>
                ))}
              </Stack>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    placeholder="Ask about quiz, resume, interview..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    disabled={sending || loadingUser}
                    fullWidth
                    multiline
                    maxRows={3}
                  />
                  <PremiumButton type="submit" disabled={sending || loadingUser || !input.trim()} sx={{ minWidth: 46, px: 1.2 }}>
                    <Send size={17} />
                  </PremiumButton>
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
      </AnimatePresence>
      <Fab
        onClick={() => setOpen((value) => !value)}
        sx={{
          position: "fixed",
          right: { xs: 16, md: 24 },
          bottom: chatButtonBottom,
          zIndex: 1400,
          color: "#fff",
          background: "linear-gradient(135deg, #2563EB, #14B8A6)",
          boxShadow: "0 18px 50px rgba(20,184,166,0.30)",
          "&:hover": { background: "linear-gradient(135deg, #1D4ED8, #0D9488)" },
        }}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </Fab>
    </>
  );
};

export default AICopilot;
