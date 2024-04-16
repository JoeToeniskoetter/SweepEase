import { FireplaceTwoTone } from "@mui/icons-material";
import { Box, Typography, Divider } from "@mui/material";
import React, { useState } from "react";
import { InspectItem } from "./InspectItem";

interface InspectionInspectionItemsProps {
  inspectionId: string;
  inspectionOrderDetails: InspectionDetail[];
}

export const InspectionInspectionItems: React.FC<
  InspectionInspectionItemsProps
> = ({ inspectionOrderDetails, inspectionId }) => {
  const [openInspectionItem, setOpenInspectionItem] = useState<string>();

  return (
    <Box mt={2} display={"flex"} flexDirection={"column"}>
      <Typography
        sx={{ fontSize: 18 }}
        color="text.secondary"
        gutterBottom
        display={"flex"}
        gap={1}
      >
        <FireplaceTwoTone />
        INSPECTION ITEMS
      </Typography>
      <Divider />
      <Box pt={2}>
        {inspectionOrderDetails?.map((iod, idx) => (
          <InspectItem
            inspectionId={inspectionId ?? ""}
            item={iod}
            idx={idx}
            key={iod.id}
            openInspectionItem={openInspectionItem}
            setOpenInspectionItem={setOpenInspectionItem}
          />
        ))}
      </Box>
    </Box>
  );
};
