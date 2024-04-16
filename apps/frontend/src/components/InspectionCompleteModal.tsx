import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  ArrowBack,
  CheckCircle,
  Close,
  PrintTwoTone,
} from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface InspectionCompleteModalProps {
  open: boolean;
  onClose: () => void;
}

export const InspectionCompleteModal: React.FC<
  InspectionCompleteModalProps
> = ({ open, onClose }) => {
  const navigate = useNavigate();
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
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <CheckCircle color="success" sx={{ fontSize: 48 }} />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Inspection Complete
            </Typography>
          </Box>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <Button
              startIcon={<PrintTwoTone />}
              fullWidth
              color="primary"
              variant="outlined"
            >
              Print Report
            </Button>
            <Button
              startIcon={<ArrowBack />}
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Return To Inspections
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
