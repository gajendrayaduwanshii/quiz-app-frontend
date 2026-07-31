"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Checks if the Web Speech API is available in the browser
const isSpeechSupported = () =>
  typeof window !== "undefined" &&
  ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

export default function VoiceInput({ onTranscript, disabled = false }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    setSupported(isSpeechSupported());
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    setInterimText("");
  }, []);

  const startListening = useCallback(() => {
    if (!isSpeechSupported()) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;       // keep listening until manually stopped
    recognition.interimResults = true;   // show partial results live

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let interim = "";
      let newFinal = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          newFinal += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimText(interim);
      if (newFinal.trim()) onTranscript(newFinal.trim());
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e.error);
      stopListening();
    };

    recognition.onend = () => {
      setListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript, stopListening]);

  const toggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!supported) {
    return (
      <Tooltip title="Voice input is not supported in this browser. Please use Chrome or Edge." arrow>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.8,
            px: 1.6,
            py: 0.8,
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#475569",
            cursor: "not-allowed",
            fontSize: "0.8rem",
          }}
        >
          <MicOff size={15} />
          <Typography sx={{ fontSize: "0.78rem" }}>Voice unavailable</Typography>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1.2}>
      {/* ── Mic toggle button ── */}
      <Box
        onClick={disabled ? undefined : toggle}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 1.8,
          py: 0.9,
          borderRadius: "12px",
          border: listening
            ? "1px solid rgba(34,197,94,0.5)"
            : "1px solid rgba(124,58,237,0.35)",
          background: listening
            ? "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(6,182,212,0.08))"
            : "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "all 0.2s",
          "&:hover": disabled ? {} : { opacity: 0.88 },
          userSelect: "none",
        }}
      >
        {/* Animated pulse ring when listening */}
        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
          {listening && (
            <Box
              component={motion.div}
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              sx={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                bgcolor: "rgba(34,197,94,0.3)",
              }}
            />
          )}
          {listening ? (
            <Volume2 size={16} color="#22C55E" />
          ) : (
            <Mic size={16} color="#7C3AED" />
          )}
        </Box>
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: listening ? "#22C55E" : "#A78BFA",
          }}
        >
          {listening ? "Listening... (click to stop)" : "Speak Answer"}
        </Typography>
      </Box>

      {/* ── Live interim transcript chip ── */}
      <AnimatePresence>
        {interimText && (
          <Chip
            component={motion.div}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            label={`"${interimText.slice(0, 50)}${interimText.length > 50 ? "..." : ""}"`}
            size="small"
            sx={{
              bgcolor: "rgba(34,197,94,0.1)",
              color: "#86EFAC",
              border: "1px solid rgba(34,197,94,0.2)",
              maxWidth: 280,
              fontSize: "0.72rem",
              fontStyle: "italic",
            }}
          />
        )}
      </AnimatePresence>
    </Stack>
  );
}
