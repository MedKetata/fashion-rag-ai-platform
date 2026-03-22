import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { JSX, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  role?: string;
}

const AuthGuard = ({ children, role }: AuthGuardProps): JSX.Element => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;