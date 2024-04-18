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
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

interface SignInPageProps {}

export const SignInPage: React.FC<SignInPageProps> = () => {
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { mutateAsync: authMutation, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }): Promise<void> => {
      if (isSignUp) {
        return await signUp(email, password);
      }
      return await signIn(email, password);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const redirect = searchParams.get("redirect");

  if (user) {
    if (redirect) {
      return <Navigate to={redirect} replace={true} />;
    }
    return <Navigate to={"/dashboard"} replace={true} />;
  }

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
        <CardHeader
          sx={{ height: 80 }}
          title={
            <Box>
              <Logo variant="dark" />
              <Typography fontWeight={"light"} p={0}>
                {!isSignUp
                  ? "Sign in to access your account"
                  : "Sign up to create an account"}
              </Typography>
            </Box>
          }
        />
        <CardContent>
          {error && (
            <Alert variant="standard" severity="error" sx={{ marginBottom: 2 }}>
              {error}
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
            <Box>
              <Typography fontWeight={"bold"}>Password</Typography>
              <TextField
                placeholder="Password"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
              />
            </Box>
          </FormControl>
          <Box display={"flex"} justifyContent={"space-between"} p={2}>
            <Typography
              fontWeight={"bold"}
              fontSize={14}
              sx={{
                cursor: "pointer",
              }}
              onClick={() => {
                setIsSignUp(!isSignUp);
              }}
            >
              {isSignUp
                ? "Have an account? Sign in."
                : "Not signed up? Sign up now."}
            </Typography>
            <Link
              to={"/forgot-password"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Typography fontWeight={"bold"} fontSize={14}>
                Forgot Password?
              </Typography>
            </Link>
          </Box>
          <CardActions style={{ padding: 0, marginTop: 15 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ boxShadow: 0, color: "white" }}
              disabled={email.trim() === "" || password.trim() === ""}
              onClick={async () => {
                await authMutation({ email, password });
              }}
              startIcon={
                isPending && (
                  <CircularProgress sx={{ color: "white" }} size={24} />
                )
              }
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </Container>
  );
};
