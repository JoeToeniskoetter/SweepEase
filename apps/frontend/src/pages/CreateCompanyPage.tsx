import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { CreateCompanyForm } from "../components/CreateCompanyForm";
import { Navigate, useNavigate } from "react-router-dom";
import OnboardingStepper from "../components/OnboardingStepper";
import { Logo } from "../components/Logo";
import { useProfile } from "../hooks/useProfile";

interface CreateCompanyPageProps {}

export const CreateCompanyPage: React.FC<CreateCompanyPageProps> = () => {
  const { isLoading, data: profile } = useProfile({ enabled: true });
  const navigate = useNavigate();
  const theme = useTheme();

  if (isLoading) {
    return <CircularProgress />;
  }

  if (profile?.company !== null) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <Grid container sx={{ height: "90vh" }} spacing={2}>
      <Grid item sm={12} md={4} width={"100%"}>
        <Box
          bgcolor={theme.palette.primary.light}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Logo variant="dark" />
        </Box>
        <Box
          bgcolor={theme.palette.primary.light}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          p={4}
          sx={{
            height: {
              md: "100%",
            },
          }}
        >
          <OnboardingStepper />
        </Box>
      </Grid>
      <Grid
        item
        sm={12}
        md={8}
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
          <Box p={4}>
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
        </Box>
      </Grid>
    </Grid>
  );
};
