import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useProfile } from "../hooks/useProfile";

interface ProtectedRouteProps {}

export const OnboardedRoutes: React.FC<ProtectedRouteProps> = () => {
  const { user, initializing } = useAuth();
  const { data: profile, isLoading } = useProfile({ enabled: user !== null });

  if (initializing || isLoading) {
    return <CircularProgress />;
  }

  if (user && profile?.company !== null) {
    return <Outlet />;
  }

  if (user && profile?.company === null) {
    return <Navigate to={"/company-setup"} replace />;
  }

  return <Navigate to={"/signin"} />;
};
