import { Chip, useTheme } from "@mui/material";
import React from "react";

interface InspectionOrderStatusProps {
  status: string;
}

export const InspectionOrderStatus: React.FC<InspectionOrderStatusProps> = ({
  status,
}) => {
  const {
    palette: {
      success: { light },
    },
  } = useTheme();
  return (
    <Chip label={status} sx={{ backgroundColor: light, color: "white" }} />
  );
};
