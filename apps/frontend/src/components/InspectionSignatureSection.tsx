import { HistoryEduTwoTone } from "@mui/icons-material";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";

interface InspectionSignatureSectionProps {
  inspection?: InspectionOrder;
  customerSignature: string | undefined;
  techSignature: string | undefined;
}

export const InspectionSignatureSection: React.FC<
  InspectionSignatureSectionProps
> = ({ customerSignature, techSignature, inspection }) => {
  if (
    (!customerSignature || !techSignature) &&
    inspection?.status === "COMPLETE"
  ) {
    return null;
  }
  return (
    <Box width={"100%"} mt={2} mb={2} maxHeight={200}>
      <Typography
        sx={{ fontSize: 18 }}
        color="text.secondary"
        gutterBottom
        display={"flex"}
        gap={1}
      >
        <HistoryEduTwoTone />
        SIGN
      </Typography>
      <Divider />
      <Box
        mt={2}
        display={"flex"}
        justifyContent={"space-evenly"}
        width={"100%"}
        gap={2}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"50%"}
          alignItems={"center"}
        >
          <Typography fontWeight={"bold"}>Customer Signature</Typography>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {customerSignature && (
              <img
                src={customerSignature}
                style={{
                  maxHeight: 100,
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </Paper>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"50%"}
          alignItems={"center"}
        >
          <Typography fontWeight={"bold"}>Technician Signature</Typography>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            {techSignature && (
              <img
                src={techSignature}
                style={{
                  maxHeight: 100,
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
