import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role")?.toUpperCase();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!token && !hasShownToast.current) {
      toast.error("Please login to continue");
      hasShownToast.current = true;
    } else if (token && userRole && !allowedRoles.includes(userRole) && !hasShownToast.current) {
      toast.error("Access denied. Redirecting to your dashboard.");
      hasShownToast.current = true;
    }
  }, [token, userRole, allowedRoles]);

  // No token - redirect to auth
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Token exists but role doesn't match - redirect to correct dashboard
  if (userRole && !allowedRoles.includes(userRole)) {
    const redirectPath = getRedirectPath(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const getRedirectPath = (role: string): string => {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "OWNER":
      return "/owner-dashboard";
    case "WORKER":
      return "/worker-dashboard";
    default:
      return "/auth";
  }
};

export default ProtectedRoute;
