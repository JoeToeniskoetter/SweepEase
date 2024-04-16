import { InfoTwoTone } from "@mui/icons-material";
import { Typography, Divider, Box } from "@mui/material";
import { format } from "date-fns";
import React from "react";

interface InspectionCustomerInfoProps {
  inspection?: InspectionOrder;
}

export const InspectionCustomerInfo: React.FC<InspectionCustomerInfoProps> = ({
  inspection,
}) => {
  return (
    <>
      <Typography
        sx={{ fontSize: 18 }}
        color="text.secondary"
        gutterBottom
        display={"flex"}
        gap={1}
      >
        <InfoTwoTone />
        CUSTOMER INFO
      </Typography>
      <Divider />
      <Box display={"flex"} flexDirection={"column"} gap={1} p={1}>
        <Box>
          <Typography fontWeight="bold">Customer name:</Typography>
          <Typography>{inspection?.customerName}</Typography>
        </Box>
        <Box>
          <Typography fontWeight="bold">Address:</Typography>
          <Typography>{inspection?.address}</Typography>
          <Typography>
            {inspection?.city}, {inspection?.state} {inspection?.zip}
          </Typography>
        </Box>
        <Box>
          <Typography fontWeight="bold">Phone:</Typography>
          <Typography>{inspection?.phone || "-"}</Typography>
        </Box>
        <Box>
          <Typography fontWeight="bold">Inspection Date:</Typography>
          <Typography>
            {format(new Date(inspection?.createdAt ?? new Date()), "MM/d/yyyy")}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
