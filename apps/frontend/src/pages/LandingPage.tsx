import {
  AccountTreeTwoTone,
  AssignmentTwoTone,
  ChevronRight,
  TableChartTwoTone,
} from "@mui/icons-material";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { Navbar } from "../components/Navbar";
import { PricingOption } from "../components/PricingOption";
import { Link } from "react-router-dom";

interface LandingPageProps {}

const features = [
  {
    icon: <TableChartTwoTone color="primary" sx={{ fontSize: 48 }} />,
    title: "Flexible Inspection Templates",
    description:
      "Customize inspection templates to fit your unique business needs.",
  },
  {
    icon: <AccountTreeTwoTone color="primary" sx={{ fontSize: 48 }} />,
    title: "Simple Inspection Process",
    description: "Simplify and streamline the chimney inspection process.",
  },
  {
    icon: <AssignmentTwoTone color="primary" sx={{ fontSize: 48 }} />,
    title: "Detailed Inspection Reports",
    description:
      "Improve customer satisfaction with professional, detailed reports.",
  },
];

export const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <div>
      <Navbar sx={{}} />
      <Container
        maxWidth="lg"
        sx={{ display: "flex", flexDirection: "column", gap: 5 }}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          textAlign={"center"}
          flexDirection={"column"}
          minHeight={"30vh"}
        >
          <Typography
            sx={{
              fontSize: 60,
              fontWeight: "1000",
              letterSpacing: "-1.5px",
              lineHeight: "60px",
            }}
          >
            One stop shop for{" "}
            <span style={{ fontFamily: "lobster", color: "#F57F37" }}>
              Chimney Sweep
            </span>{" "}
            inspections
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  flexDirection: "column",
                  height: 150,
                }}
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  width={"100%"}
                >
                  {feature.icon}
                </Box>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography fontWeight={"bold"}>{feature.title}</Typography>
                  <Typography fontWeight={"light"} textAlign={"center"}>
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          p={4}
        >
          <Button
            onClick={() => console.log("clicked")}
            variant="contained"
            component={Link}
            sx={{
              backgroundColor: "#F57F37",
              textTransform: "none",
              borderRadius: 2,
              color: "white",
            }}
            to={"/signin"}
          >
            Get Started
            <ChevronRight />
          </Button>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          pb={4}
        >
          <Typography fontWeight={800} fontSize={30}>
            Simple Straight Forward Pricing
          </Typography>
          <Typography fontWeight={"light"}>
            Plan sizes that fit your business requirements.
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center" mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <PricingOption
              title="Starter"
              subtitle="Try SweepEase before you commit!"
              price="Free"
              options={[
                "Store up to 200 customers",
                "Up to 3 months appointment history",
                "Basic inspection report templates",
                "No setup, or hidden fees",
                "Basic email support",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PricingOption
              title="Company"
              subtitle="Relevant for multiple users, extended & premium support."
              price="$99"
              monthly
              options={[
                "Store up to 200 customers",
                "Basic inspection report templates",
                "No setup, or hidden fees",
                "Basic email support",
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PricingOption
              title="Enterprise"
              subtitle="Best for large scale uses and extended redistribution rights."
              price="$199"
              monthly
              options={[
                "Store up to 200 customers",
                "Basic inspection report templates",
                "No setup, or hidden fees",
                "Basic email support",
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
