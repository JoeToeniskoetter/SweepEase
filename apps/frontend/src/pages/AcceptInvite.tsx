import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useAcceptInvite } from "../hooks/useAcceptInvite";
import { useProfile } from "../hooks/useProfile";

interface AcceptInviteProps {}

export const AcceptInvite: React.FC<AcceptInviteProps> = () => {
  const { data: profile } = useProfile({ enabled: true });
  const { mutate, isPending, error } = useAcceptInvite();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const accept = useCallback(() => {
    if (code) {
      mutate({ code });
    }
  }, [code, mutate]);

  useEffect(() => {
    accept();
  }, [accept]);

  if (profile && profile.company !== null) {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <Container sx={{ height: "100vh" }}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        height={"100%"}
      >
        {isPending && <CircularProgress />}
        <Typography variant="h5">
          {error && "Error "} Joining Company
          {error && (
            <Alert severity="error" variant="standard">
              <Box display={"flex"} flexDirection={"column"}>
                <Typography>{error?.response?.data?.message}</Typography>
                <Typography>
                  Contact your administrator for assistance
                </Typography>
              </Box>
            </Alert>
          )}
        </Typography>
      </Box>
    </Container>
  );
};
