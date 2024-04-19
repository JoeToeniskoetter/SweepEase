import { AddCircleOutline, Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useCreateTemplate } from "../hooks/useCreateTemplate";
import { useInspectionTemplates } from "../hooks/useInspectionTemplates";
import { InspectionTemplateGrid } from "./InspectionTemplateGrid";
import { EmptyTemplates } from "./EmptyTemplates";
import { ProtectedComponent } from "./ProtectedComponent";

interface InspectionTemplatesProps {}

export const InspectionTemplates: React.FC<InspectionTemplatesProps> = () => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { data, isLoading } = useInspectionTemplates();
  const [templateName, setTemplateName] = useState<string>("");
  const [inspectionLevel, setInspectionLevel] = useState<
    "Level One" | "Level Two" | "Level Three"
  >("Level One");

  const { mutateAsync: createTemplate, isPending, error } = useCreateTemplate();

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"start"}
        justifyContent={"start"}
        width={"100%"}
        bgcolor={theme.palette.secondary.main}
        sx={{ height: 120, p: 4 }}
        flexDirection={"column"}
      >
        <Typography variant="h5" sx={{ color: "white" }} fontWeight={"bold"}>
          Inspection Templates
        </Typography>
        <Typography sx={{ color: "white", fontWeight: "light" }}>
          View, edit, and save your templates.
        </Typography>
      </Box>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
        maxWidth="lg"
      >
        <Box display={"flex"} mt={2}>
          <ProtectedComponent
            allowedRoles={[]}
            fallbackComponent={
              <Tooltip title="Missing required permissions. Contact your company admin to create a template">
                <span>
                  <Button
                    disabled
                    startIcon={<AddCircleOutline fontSize="small" />}
                    variant="outlined"
                  >
                    Create Template
                  </Button>
                </span>
              </Tooltip>
            }
          >
            <Button
              variant="outlined"
              onClick={() => setOpenModal(true)}
              startIcon={<AddCircleOutline color="primary" fontSize="small" />}
            >
              Create Template
            </Button>
          </ProtectedComponent>
        </Box>
        {error && <Alert severity="error">Failed to create template</Alert>}
        {!isLoading && data?.length == 0 ? <EmptyTemplates /> : null}
        <InspectionTemplateGrid data={data ?? []} isLoading={isLoading} />
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 5,
              p: 4,
            }}
          >
            <Box display={"flex"} justifyContent={"end"}>
              <IconButton onClick={() => setOpenModal(false)}>
                <Close />
              </IconButton>
            </Box>
            <Typography variant="h5" fontWeight={"bold"}>
              Create Template
            </Typography>
            <Typography fontWeight={"light"}>
              Add something information about this template
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
                defaultValue={inspectionLevel}
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
                    createTemplate({
                      name: templateName,
                      inspectionLevel: inspectionLevel,
                    });
                    setOpenModal(false);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                {isPending ? (
                  <CircularProgress color="secondary" />
                ) : (
                  <Typography
                    fontWeight={"bold"}
                    color={"white"}
                    variant="body2"
                  >
                    Save
                  </Typography>
                )}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </>
  );
};
