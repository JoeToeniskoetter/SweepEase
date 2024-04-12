import { Alert, CircularProgress } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useInspectionTemplate } from "../hooks/useTemplate";
import { EditTemplateForm } from "./EditTemplateForm";

export const EditInspectionTemplate: React.FC = () => {
  const { id } = useParams();
  const {
    data: template,
    isLoading,
    error,
  } = useInspectionTemplate({ id: id || "" });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {error && <Alert severity="error">Error loading template</Alert>}
      {isLoading && <CircularProgress />}
      <EditTemplateForm template={template} id={id || ""} />
    </div>
  );
};
