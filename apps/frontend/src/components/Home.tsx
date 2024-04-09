import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { CreateCompanyForm } from "./CreateCompanyForm";
import { Close } from "@mui/icons-material";

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = useProfile({ enabled: true });
  return (
    <Box>
      <Typography variant="h4" fontWeight={"bold"}>
        Home
      </Typography>
      {isLoading && <CircularProgress />}
      {!isLoading && data?.company == null ? (
        <Alert severity="info">
          <Box>
            <Typography>Please setup your company to continue</Typography>
            <Button
              variant="text"
              style={{ textTransform: "none" }}
              onClick={() => setOpen(true)}
            >
              <Typography>Setup Company</Typography>
            </Button>
          </Box>
        </Alert>
      ) : null}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
          }}
        >
          <Box display={"flex"} justifyContent={"end"}>
            <Close onClick={() => setOpen(false)} sx={{ cursor: "pointer" }} />
          </Box>
          <Typography fontWeight={"bold"} fontSize={24} py={2}>
            Create Company
          </Typography>
          <CreateCompanyForm onSave={() => setOpen(false)} />
        </Box>
      </Modal>
    </Box>
  );
};
