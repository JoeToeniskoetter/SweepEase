import { Close } from "@mui/icons-material";
import {
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useCopyTemplate } from "../hooks/useCopyTemplate";

interface CopyDialogProps {
  template: InspectionTemplate;
  open: boolean;
  onClose: () => void;
}

export const CopyTemplateDialog: React.FC<CopyDialogProps> = ({
  onClose,
  open,
  template,
}) => {
  const { isPending, error, mutateAsync } = useCopyTemplate();
  const [templateName, setTemplateName] = useState<string>(template.name);
  const [inspectionLevel, setInspectionLevel] = useState<
    "Level One" | "Level Two" | "Level Three"
    //@ts-ignore
  >(template.inspectionLevel);
  return (
    <Modal open={open} onClose={() => onClose()}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 5,
          p: 4,
        }}
      >
        <Box display={"flex"} justifyContent={"end"}>
          <IconButton onClick={() => onClose()}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="h5" fontWeight={"bold"}>
          Copy Template
        </Typography>
        <Typography fontWeight={"light"}>
          Adjust information about this template
        </Typography>
        <Box display={"flex"} flexDirection={"column"} gap={2} mt={2}>
          <TextField
            placeholder="Visual Inspection"
            label="Template Name"
            fullWidth
            onChange={(e) => setTemplateName(e.target.value)}
            value={templateName}
          />
          <TextField
            select
            fullWidth
            value={inspectionLevel}
            defaultValue={template.inspectionLevel}
            onChange={(e) =>
              setInspectionLevel(
                e.target.value as "Level One" | "Level Two" | "Level Three"
              )
            }
            label="Inspection Level"
          >
            <MenuItem value={"Level One"}>Level 1</MenuItem>
            <MenuItem value={"Level Two"}>Level 2</MenuItem>
            <MenuItem value={"Level Three"}>Level 3</MenuItem>
          </TextField>
          {error && <Alert severity="error">Error creating template</Alert>}
          <Button
            variant="contained"
            fullWidth
            disabled={templateName.trim() === ""}
            onClick={async () => {
              try {
                await mutateAsync({
                  id: template.id,
                  name: templateName,
                  inspectionLevel: inspectionLevel,
                });
                onClose();
                // navigate(`${newTemplate.id}?edit=true`);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            {isPending ? (
              <CircularProgress color="secondary" />
            ) : (
              <Typography fontWeight={"bold"} color={"white"} variant="body2">
                Save
              </Typography>
            )}
          </Button>
        </Box>
        <Typography variant="caption" fontWeight={"bold"}>
          Disclaimer: SweepInspectr is a tool designed to assist with chimney
          sweep inspections and report generation. It is the user’s
          responsibility to ensure that all inspection templates and resulting
          reports comply with local laws, codes, and safety standards.
          SweepInspectr does not guarantee compliance with such regulations and
          shall not be held liable for any lapses in compliance.
        </Typography>
      </Box>
    </Modal>
  );
};
