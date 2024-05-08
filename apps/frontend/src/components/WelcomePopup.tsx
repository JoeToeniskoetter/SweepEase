import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import React from "react";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "../context/AuthContext";
import { Close } from "@mui/icons-material";
import { useCompleteFirstLogin } from "../hooks/useCompleteFirstLogin";

interface WelcomePopupProps {}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export const WelcomePopup: React.FC<WelcomePopupProps> = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile({ enabled: user !== null });
  const { mutateAsync: completeFirstLogin } = useCompleteFirstLogin();

  const shouldOpen = profile ? profile.firstLogin : true;

  return (
    <Modal
      open={shouldOpen}
      onClose={async () => {
        await completeFirstLogin();
      }}
    >
      <Box sx={modalStyle}>
        <Box display={"flex"} alignItems={"center"} justifyContent={"end"}>
          <IconButton onClick={async () => await completeFirstLogin()}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="h5" fontWeight={"bold"}>
          Welcome to SweepInspectr.
        </Typography>
        <Typography variant="body1">Getting started</Typography>
        <Box>
          <ol>
            <li>
              <Typography>
                To begin, head to the Templates tab to create your first
                inspection template.
              </Typography>
            </li>
            <li>
              <Typography>
                Next head to the Inspections tab create a new inspection order
                using your new template
              </Typography>
            </li>
            <li>
              <Typography>
                Finally, start your inspection and generate your first
                inspection report
              </Typography>
            </li>
          </ol>
        </Box>
        <Box display={"flex"} alignItems={"center"} justifyContent={"end"}>
          <Button
            variant="contained"
            sx={{ color: "white" }}
            onClick={async () => await completeFirstLogin()}
          >
            Let's Go
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
