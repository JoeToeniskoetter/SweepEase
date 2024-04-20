import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  onCancel: () => void;
  onAccept: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  content,
  onAccept,
  onCancel,
  title,
}) => {
  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      //   TransitionProps={{ onEntering: handleEntering }}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onAccept}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};
