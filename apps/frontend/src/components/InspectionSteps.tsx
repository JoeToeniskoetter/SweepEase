import { Box } from "@mui/material";
import React from "react";
import { InspectItem } from "./InspectItem";

interface InspectionStepsProps {
  items: InspectionDetail[];
}

export const InspectionSteps: React.FC<InspectionStepsProps> = ({ items }) => {
  return (
    <Box>
      {items.map((i) => (
        <InspectItem key={i.id} item={i} />
      ))}
    </Box>
  );
};
