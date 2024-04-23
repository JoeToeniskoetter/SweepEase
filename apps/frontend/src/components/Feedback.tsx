import { Close, FeedbackTwoTone } from "@mui/icons-material";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { useCreateFeedback } from "../hooks/useCreateFeedback";

export const Feedback: React.FC = () => {
  const {
    mutateAsync: createFeedback,
    isPending,
    isSuccess,
    reset,
    isError,
  } = useCreateFeedback();
  const [open, setOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} startIcon={<FeedbackTwoTone />}>
        Feedback
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          maxWidth={"sm"}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          gap={2}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 5,
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
          >
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          {isSuccess && (
            <Alert severity="success">Thank you for your feedback</Alert>
          )}
          {isError && (
            <Alert severity="error">
              Error submitting feedback. Please try again later
            </Alert>
          )}
          <Typography fontWeight={"bold"}>
            Give us your feedback and suggestions
          </Typography>
          <TextField
            fullWidth
            minRows={4}
            multiline
            sx={{ backgroundColor: "white" }}
            variant="outlined"
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ color: "white" }}
            disabled={feedback.trim() === ""}
            startIcon={
              isPending ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : null
            }
            onClick={async () => {
              await createFeedback({ feedback });
              setFeedback("");
            }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};
