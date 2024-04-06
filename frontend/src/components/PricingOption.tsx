import { Check } from "@mui/icons-material";
import { Card, CardHeader, Box, Typography, CardContent } from "@mui/material";
import React from "react";

interface PricingOptionProps {
  title: string;
  subtitle: string;
  price: string;
  monthly?: boolean;
  options: string[];
}

export const PricingOption: React.FC<PricingOptionProps> = ({
  title,
  subtitle,
  price,
  monthly,
  options,
}) => {
  return (
    <Card variant="outlined" sx={{ minHeight: 460, borderRadius: 2 }}>
      <CardHeader
        title={
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            pb={2}
          >
            <Typography fontWeight={"bold"} fontSize={24} p={1}>
              {title}
            </Typography>
          </Box>
        }
        subheader={
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Typography textAlign={"center"}>{subtitle}</Typography>
          </Box>
        }
      />
      <CardContent>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
        >
          <Typography fontWeight={"bold"} fontSize={40}>
            {price}
            <span
              style={{
                fontSize: 16,
                fontWeight: "lighter",
              }}
            >
              {monthly && "/month"}
            </span>
          </Typography>
          <Box display={"flex"} flexDirection={"column"}>
            {options.map((i) => {
              return (
                <Box p={1} display={"flex"} gap={1}>
                  <Check sx={{ color: "green" }} />
                  <Typography>{i}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
