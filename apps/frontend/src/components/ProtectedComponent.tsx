import React from "react";
import { useProfile } from "../hooks/useProfile";
import { UserRole } from "../context/UserRole";

interface ProtectedComponentProps {
  children?: React.ReactNode;
  allowedRoles: Array<keyof typeof UserRole>;
  fallbackComponent?: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  ...props
}) => {
  console.log(props);
  const { data: profile } = useProfile({ enabled: true });

  const hasRole =
    profile != undefined && props.allowedRoles.includes(profile.role);
  if (hasRole) {
    return <>{props.children}</>;
  }

  if (!hasRole && props.fallbackComponent) {
    return <>{props.fallbackComponent}</>;
  }
  return null;
};
