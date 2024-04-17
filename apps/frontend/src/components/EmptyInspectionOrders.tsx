import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { SummarizeTwoTone } from "@mui/icons-material";

interface EmptyReportsProps {}

export const EmptyInspectionOrders: React.FC<EmptyReportsProps> = ({}) => {
  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <Paper
        sx={{
          borderRadius: 25,
          p: 6,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
        elevation={0}
      >
        <SummarizeTwoTone color="secondary" sx={{ fontSize: 120 }} />
        <Typography variant="h5" color={"background"} fontWeight={"light"}>
          No Orders Found
        </Typography>
      </Paper>
    </Box>
  );
};
