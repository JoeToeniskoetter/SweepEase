import { InfoTwoTone } from "@mui/icons-material";
import { Typography, Divider, Box } from "@mui/material";
import { common } from "@mui/material/colors";
import { format } from "date-fns";
import React from "react";

interface InspectionCustomerInfoProps {
  inspection?: InspectionOrder;
}

const CustomerInfoLabel: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Typography
      fontWeight="bold"
      textTransform={"uppercase"}
      color={common.black[100]}
    >
      {label}
    </Typography>
  );
};

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
          <CustomerInfoLabel label={"customer name"} />
          <Typography>{inspection?.customerName}</Typography>
        </Box>
        <Box>
          <CustomerInfoLabel label={"address"} />
          <Typography>{inspection?.address}</Typography>
          <Typography>
            {inspection?.city}, {inspection?.state} {inspection?.zip}
          </Typography>
        </Box>
        <Box>
          <CustomerInfoLabel label={"phone"} />
          <Typography>{inspection?.phone || "-"}</Typography>
        </Box>
        <Box>
          <CustomerInfoLabel label={"inspection date"} />
          <Typography>
            {format(new Date(inspection?.createdAt ?? new Date()), "MM/d/yyyy")}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
