import { Mail } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useInviteUser } from "../hooks/useInviteUser";

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  onClose,
  open,
}) => {
  const [email, setEmail] = useState<string>("");
  const { mutateAsync, isPending } = useInviteUser();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5">Invite User</Typography>
        <Box pt={2} display={"flex"} flexDirection={"column"} gap={2}>
          <TextField
            label="Email"
            placeholder="email@email.com"
            fullWidth
            InputProps={{
              startAdornment: <Mail sx={{ color: "divider", mr: 1 }} />,
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            startIcon={
              isPending && (
                <CircularProgress sx={{ color: "white", fontSize: 18 }} />
              )
            }
            disabled={email.trim() === ""}
            onClick={async () => {
              await mutateAsync({ email: email });
            }}
            sx={{ color: "white" }}
          >
            Send Invite
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
