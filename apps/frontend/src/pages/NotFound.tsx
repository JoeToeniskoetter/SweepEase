import { Container, Box, Typography, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  const linkProps = { to: "/" };
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography
          variant="h1"
          component="h1"
          color="primary"
          sx={{ fontSize: "72px" }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ mt: 2, mb: 3 }}>
          Oops! We can't find the page you're looking for.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          The page may have been moved or deleted, or perhaps you just mistyped
          the address. Don't worry, you can find your way back:
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mx: 1, color: "white" }}
            LinkComponent={Link}
            {...linkProps}
          >
            Go back home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
