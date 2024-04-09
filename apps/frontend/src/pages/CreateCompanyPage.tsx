import { Box, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import { CreateCompanyForm } from "../components/CreateCompanyForm";
import { useNavigate } from "react-router-dom";
import OnboardingStepper from "../components/OnboardingStepper";
import { Logo } from "../components/Logo";

interface CreateCompanyPageProps {}

export const CreateCompanyPage: React.FC<CreateCompanyPageProps> = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Grid container sx={{ height: "90vh" }}>
      <Grid item sm={4}>
        <Box
          bgcolor={theme.palette.primary.light}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Logo />
        </Box>
        <Box
          bgcolor={theme.palette.primary.light}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          height={"100%"}
          p={4}
        >
          <OnboardingStepper />
        </Box>
      </Grid>
      <Grid
        item
        sm={8}
        display={"flex"}
        alignItems={"start"}
        justifyContent={"center"}
      >
        <Box
          borderColor={"#c3c3c3"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          height={"100%"}
        >
          <Box pb={4}>
            <Typography variant="h5" fontWeight={"bold"}>
              Company Info
            </Typography>
            <Typography fontWeight={"light"}>
              Some basic info about your business
            </Typography>
          </Box>
          <CreateCompanyForm
            onSave={() => {
              return navigate("/dashboard", { replace: true });
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
