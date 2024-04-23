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
import { BetaOverlay } from "../components/BetaOverlay";

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

const exampleSections = [
  {
    name: "Create an inspection template",
    description:
      "Add quick condition options to make the inspection process a breeze.",
    image: "/template.png",
  },
  {
    name: "Conduct the inspection",
    description:
      "Technicians can follow the predefined template to conduct inspections",
    image: "/inspect.png",
  },
  {
    name: "Review and save",
    description: "Complete your inspection and save the report details",
    image: "/report.png",
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
          mt={10}
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
        <Grid container spacing={2} sx={{ minHeight: "50vh" }}>
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
      </Container>
      <Container maxWidth="xl">
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <Typography variant="h4" fontWeight={"bold"}>
            How it works
          </Typography>
        </Box>
        <Grid container spacing={0}>
          {exampleSections.map((sec) => (
            <Grid item key={sec.name} sm={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  flexDirection: "column",
                }}
              >
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Typography fontWeight={"bold"} variant="h6">
                    {sec.name}
                  </Typography>
                  <Typography fontWeight={"light"} textAlign={"center"}>
                    {sec.description}
                  </Typography>
                </Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <img
                    src={sec.image}
                    width={"100%"}
                    style={{ borderRadius: 10, display: "flex" }}
                  />
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
        <BetaOverlay>
          <Grid container spacing={4} justifyContent="center" mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <PricingOption
                title="Starter"
                subtitle="Try SweepInspectr before you commit!"
                price="Free"
                options={[
                  "1 Inspection template",
                  "Generate up to 10 inspection reports per month",
                  "Up to 3 months Inspection History",
                  "Basic email support",
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PricingOption
                title="Company"
                subtitle="Relevant for multiple users, extended & premium support."
                price="$15"
                monthly
                options={[
                  "3 Inspection templates",
                  "Generate up to 25 inspection reports per month",
                  "Up to 3 Months Inspection History",
                  "Basic email support",
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PricingOption
                title="Enterprise"
                subtitle="Best for large scale uses and extended redistribution rights."
                price="$60"
                monthly
                options={[
                  "Unlimited Inspection Templates",
                  "Unlimited Inspection Report Generation",
                  "10 Years Inspection History",
                  "Basic email support",
                ]}
              />
            </Grid>
          </Grid>
        </BetaOverlay>
      </Container>
    </div>
  );
};
