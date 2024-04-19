import React from "react";
import { useProfile } from "../hooks/useProfile";
import { UserRole } from "../context/UserRole";

interface ProtectedComponentProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackComponent?: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  allowedRoles,
  fallbackComponent,
}) => {
  const { data: profile } = useProfile({ enabled: true });
  const hasRole = allowedRoles.includes(profile?.role);
  if (hasRole) {
    return <>{children}</>;
  }

  if (!hasRole && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }
  return null;
};
