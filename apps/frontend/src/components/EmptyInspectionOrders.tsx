import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { AddCircleOutline, SummarizeTwoTone } from "@mui/icons-material";
import { ProtectedComponent } from "./ProtectedComponent";

interface EmptyReportsProps {
  onCreateOrder: () => void;
}

export const EmptyInspectionOrders: React.FC<EmptyReportsProps> = ({
  onCreateOrder,
}) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
    >
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
        <SummarizeTwoTone
          color="secondary"
          sx={{ fontSize: 120, opacity: 0.75 }}
        />
        <Typography variant="h5" color={"background"} fontWeight={"light"}>
          No Orders Found
        </Typography>
        <ProtectedComponent allowedRoles={["ADMIN", "CREATOR"]}>
          <Button
            startIcon={<AddCircleOutline />}
            style={{ opacity: 1 }}
            onClick={onCreateOrder}
          >
            Create Order
          </Button>
        </ProtectedComponent>
      </Paper>
    </Box>
  );
};
