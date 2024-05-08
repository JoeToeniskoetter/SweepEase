import { Alert, CircularProgress } from "@mui/material";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useInspectionTemplate } from "../hooks/useTemplate";
import { EditTemplateForm } from "./EditTemplateForm";
import { useProfile } from "../hooks/useProfile";

export const EditInspectionTemplate: React.FC = () => {
  const { data: profile } = useProfile({ enabled: true });
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const {
    data: template,
    isLoading,
    error,
  } = useInspectionTemplate({ id: id || "" });

  const canEdit =
    (profile?.role === "ADMIN" || profile?.role === "CREATOR") &&
    searchParams.get("edit") === "true";

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {error && <Alert severity="error">Error loading template</Alert>}
      {isLoading && <CircularProgress />}
      <EditTemplateForm
        template={template}
        id={id || ""}
        edit={canEdit}
        setEdit={(canEdit: boolean) => {
          const newParams = new URLSearchParams();
          if (canEdit) {
            newParams.set("edit", "true");
          }
          setSearchParams(newParams);
        }}
      />
    </div>
  );
};
