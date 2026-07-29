import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth";
import type { JSX } from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
