import { Chip } from "@mui/material";
import React from "react";

interface InspectionOrderStatusProps {
  status: string;
}

export const InspectionOrderStatus: React.FC<InspectionOrderStatusProps> = ({
  status,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "NEW":
        return "slateblue";
      case "IN PROGRESS":
        return "green";
      case "COMPLETE":
        return "gray";
    }
  };
  return (
    <Chip
      label={status}
      sx={{ backgroundColor: getStatusColor(), color: "white" }}
    />
  );
};
