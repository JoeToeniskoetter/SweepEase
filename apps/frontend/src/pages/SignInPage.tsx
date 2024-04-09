import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface SignInPageProps {}

export const SignInPage: React.FC<SignInPageProps> = () => {
  const { signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (user) {
    return <Navigate to={"/dashboard"} replace={true} />;
  }

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
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
              <Logo />
              <Typography fontWeight={"light"} p={0}>
                {isSignUp
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
            <Typography fontWeight={"bold"} fontSize={14}>
              Forgot Password?
            </Typography>
          </Box>
          <CardActions style={{ padding: 0, marginTop: 15 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ boxShadow: 0, color: "white" }}
              disabled={email.trim() === "" || password.trim() === ""}
              onClick={async () => {
                try {
                  if (isSignUp) {
                    await signUp(email, password);
                  } else {
                    await signIn(email, password);
                  }
                } catch (e) {
                  setError("Invalid email or password");
                }
              }}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </Container>
  );
};
