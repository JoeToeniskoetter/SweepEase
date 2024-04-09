import { ChevronRight } from "@mui/icons-material";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { Navbar } from "../components/Navbar";
import { PricingOption } from "../components/PricingOption";
import { Link } from "react-router-dom";

interface LandingPageProps {}

export const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    <div>
      <Navbar />
      <Container maxWidth="lg">
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          textAlign={"center"}
          flexDirection={"column"}
          gap={2}
          mb={4}
          minHeight={"50vh"}
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
              Chimney Sweep Professionals
            </span>
          </Typography>
          <Box maxWidth={"md"}>
            <Typography color={"gray"} textAlign={"center"} padding={2}>
              Providing the tools for your business to succeed. Scheduling,
              Inspection Reports, Certification Management and more.
            </Typography>
          </Box>
          <Button
            onClick={() => console.log("clicked")}
            variant="contained"
            component={Link}
            sx={{
              backgroundColor: "#F57F37",
              textTransform: "none",
              borderRadius: 2,
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
