import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Fade,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Logo } from "../components/Logo";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../context/firebase";
import { CheckCircle } from "@mui/icons-material";

interface ForgotPasswordProps {}

export const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const [email, setEmail] = useState<string>("");
  const { mutateAsync, isPending, error, isSuccess } = useMutation({
    mutationFn: (email: string) => {
      return sendPasswordResetEmail(auth, email);
    },
  });

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        elevation={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingLeft: 2,
          paddingRight: 2,
          paddingBottom: 2,
          width: 400,
        }}
      >
        {isSuccess ? (
          <Fade in={isSuccess}>
            <Box
              p={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CheckCircle color="success" sx={{ fontSize: 48 }} />
              <Typography textAlign={"center"}>
                An email has been sent to {email} with instructions
              </Typography>
              <Link to={"/signin"}>
                <Button>Return to login</Button>
              </Link>
            </Box>
          </Fade>
        ) : (
          <>
            <CardHeader
              sx={{ height: 80 }}
              title={
                <Box>
                  <Logo variant="dark" />
                  <Typography fontWeight={"light"} p={0}>
                    Enter the email for your account
                  </Typography>
                </Box>
              }
            />
            <CardContent>
              {error && (
                <Alert
                  variant="standard"
                  severity="error"
                  sx={{ marginBottom: 2 }}
                >
                  {error.message}
                </Alert>
              )}
              <FormControl
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Box>
                  <Typography fontWeight={"bold"}>Email</Typography>
                  <TextField
                    fullWidth
                    placeholder="email@email.com"
                    margin="none"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </Box>
              </FormControl>
              <Box display={"flex"} justifyContent={"space-between"} p={1}>
                <Link
                  to={"/signin"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Typography
                    fontWeight={"bold"}
                    fontSize={14}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    Have an account? Sign in.
                  </Typography>
                </Link>
              </Box>
              <CardActions style={{ padding: 0, marginTop: 15 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ boxShadow: 0, color: "white" }}
                  disabled={email.trim() === ""}
                  onClick={async () => {
                    await mutateAsync(email);
                  }}
                  startIcon={
                    isPending && (
                      <CircularProgress sx={{ color: "white" }} size={24} />
                    )
                  }
                >
                  Send Reset Email
                </Button>
              </CardActions>
            </CardContent>
          </>
        )}
      </Card>
    </Container>
  );
};
