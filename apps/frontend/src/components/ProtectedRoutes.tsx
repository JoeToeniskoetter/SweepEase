import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";

interface ProtectedRouteProps {}

export const ProtectedRoutes: React.FC<ProtectedRouteProps> = () => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <CircularProgress />;
  }

  if (user) {
    return <Outlet />;
  }

  return (
    <Navigate
      to={`/signin?redirect=${window.location.pathname}${window.location.search}`}
    />
  );
};
