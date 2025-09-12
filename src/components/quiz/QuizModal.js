import React from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuizResult from "./QuizResult";

const QuizModal = ({ open, onClose, title, description, onStart, onRestart, correctCount, incorrectCount, handleGoBack }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: onRestart ? 500 : 400,
          bgcolor: "white",
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
          textAlign: "center",
          position: "relative",
        }}
      > 
       {
        onRestart ? 
        <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
      >
        <CloseIcon />
      </IconButton> :
       <></>
       }
       

        <Typography variant="h6">{title}</Typography>

        {onRestart ? (
          <QuizResult correctAnswers={correctCount} incorrectAnswers={incorrectCount} />
        ) : (
          <>
            <Typography variant="body1" sx={{ mt: 2 }}>{description}</Typography>
            <Button variant="contained" color="primary" onClick={onStart} sx={{ mt: 2 }}>
              Start Quiz
            </Button>
            <Button variant="contained" color="secondary" onClick={handleGoBack} sx={{ mt: 2, ml:1 }}>
              Back
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default QuizModal;
