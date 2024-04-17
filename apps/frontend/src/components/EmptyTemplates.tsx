import { FeedTwoTone } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";

interface EmptyTemplatesProps {}

export const EmptyTemplates: React.FC<EmptyTemplatesProps> = ({}) => {
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
        <FeedTwoTone color="secondary" sx={{ fontSize: 120 }} />
        <Typography variant="h5" color={"background"} fontWeight={"light"}>
          No Templates Found
        </Typography>
      </Paper>
    </Box>
  );
};
