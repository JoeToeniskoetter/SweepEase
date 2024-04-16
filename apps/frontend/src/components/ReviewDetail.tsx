import { FireplaceTwoTone } from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import React from "react";

interface ReviewDetailProps {
  insepectionDetail?: InspectionDetail[];
}

export const ReviewDetail: React.FC<ReviewDetailProps> = ({
  insepectionDetail,
}) => {
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
        {insepectionDetail?.map((detail) => (
          <Box py={2} key={detail.id}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {detail.item}
            </Typography>
            <Divider />
            <Typography>Condition: {detail.condition?.name}</Typography>
            <Typography>Reason: {detail.condition?.description}</Typography>
            {detail.notes && <Typography>Notes: {detail.notes}</Typography>}
            {detail.photoUrl && <img src={detail.photoUrl} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
