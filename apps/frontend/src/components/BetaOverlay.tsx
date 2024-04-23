import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";

interface props {
  children: React.ReactNode;
}

export const BetaOverlay = (props: props) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        mb: 4,
      }}
    >
      {/* Background content */}
      <Box sx={{ opacity: 0.1 }}>{props.children}</Box>

      {/* Overlay content */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.04)", // Darker overlay for readability
          zIndex: 2, // Ensures overlay is on top
          padding: 4,
          borderRadius: 5,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            maxWidth: 600,
            textAlign: "center",
            backgroundColor: "#fff", // Adjust background color as needed
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            fontWeight={"bold"}
            sx={{ marginBottom: 2 }}
          >
            Join the SweepInspectr Beta Program
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            Sign up today for exclusive early access to SweepInspectr. Use all
            our features for free during the beta phase and help shape the
            future of our product!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log("clicked")}
            component={Link}
            sx={{
              backgroundColor: "#F57F37",
              textTransform: "none",
              borderRadius: 2,
              color: "white",
            }}
            to={"/signin"}
            endIcon={<ChevronRight />}
          >
            Sign Up Now - Free Beta Access
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default BetaOverlay;
