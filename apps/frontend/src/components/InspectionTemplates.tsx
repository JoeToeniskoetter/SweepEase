import { AddCircleOutline, Article } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useInspectionTemplates } from "../hooks/useInspectionTemplates";
import { useCreateTemplate } from "../hooks/useCreateTemplate";
import { Link } from "react-router-dom";

interface InspectionTemplatesProps {}

export const InspectionTemplates: React.FC<InspectionTemplatesProps> = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { data } = useInspectionTemplates();
  const [templateName, setTemplateName] = useState<string>("");
  const { mutateAsync: createTemplate, isPending, error } = useCreateTemplate();
  return (
    <Container disableGutters maxWidth={"lg"}>
      <Box display={"flex"} gap={2} flexDirection={"column"} maxWidth={"md"}>
        <Box display={"flex"} gap={2}>
          <Typography variant="h4" fontWeight={"bold"}>
            Templates
          </Typography>
          <IconButton onClick={() => setOpenModal(true)}>
            <AddCircleOutline color="primary" />
          </IconButton>
        </Box>
        <Grid container spacing={2}>
          {data?.map((template) => (
            <Grid item minWidth={200}>
              <Link
                to={`${template.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <Box
                  sx={{ cursor: "pointer" }}
                  display={"flex"}
                  alignItems={"center"}
                  maxWidth={200}
                  border={1}
                  borderColor={"#c6c6c6"}
                  borderRadius={5}
                  p={2}
                >
                  <Article fontSize={"large"} />
                  <CardHeader title={template.name} subheader={"Test"} />
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
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
          <Typography variant="h5" fontWeight={"bold"}>
            Create Template
          </Typography>
          <Typography fontWeight={"light"}>Name your template</Typography>
          <Box display={"flex"} flexDirection={"column"} gap={2} mt={2}>
            <TextField
              placeholder="Level 1"
              fullWidth
              onChange={(e) => setTemplateName(e.target.value)}
              value={templateName}
            />
            {error && <Alert severity="error">Error creating template</Alert>}
            <Button
              variant="contained"
              fullWidth
              disabled={templateName.trim() === ""}
              onClick={async () => {
                try {
                  createTemplate({ name: templateName });
                  setOpenModal(false);
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
        </Box>
      </Modal>
    </Container>
  );
};
