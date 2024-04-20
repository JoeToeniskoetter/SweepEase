import { AddCircleOutline, FeedTwoTone } from "@mui/icons-material";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import React from "react";
import { ProtectedComponent } from "./ProtectedComponent";

interface EmptyTemplatesProps {
  onCreateTemplate: () => void;
}

export const EmptyTemplates: React.FC<EmptyTemplatesProps> = ({
  onCreateTemplate,
}) => {
  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <Paper
        sx={{
          borderRadius: 25,
          p: 6,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
        elevation={0}
      >
        <FeedTwoTone color="secondary" sx={{ fontSize: 120, opacity: 0.75 }} />
        <Typography variant="h5" color={"background"} fontWeight={"light"}>
          No Templates Found
        </Typography>
        <ProtectedComponent
          allowedRoles={["ADMIN", "CREATOR"]}
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
          <Button onClick={onCreateTemplate} startIcon={<AddCircleOutline />}>
            Create Template
          </Button>
        </ProtectedComponent>
      </Paper>
    </Box>
  );
};
