import { Close } from "@mui/icons-material";
import { Box, Container, Modal, Typography, useTheme } from "@mui/material";
import React from "react";
import { CreateCompanyForm } from "./CreateCompanyForm";

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        display={"flex"}
        alignItems={"start"}
        justifyContent={"start"}
        width={"100%"}
        bgcolor={theme.palette.secondary.main}
        sx={{ height: 120, p: 4 }}
        flexDirection={"column"}
      >
        <Typography variant="h5" sx={{ color: "white" }} fontWeight={"bold"}>
          Home
        </Typography>
      </Box>
      <Container maxWidth="lg"></Container>
    </>
  );
};
