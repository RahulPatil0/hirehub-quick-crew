import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  role: "ADMIN" | "OWNER" | "WORKER";
}

export default function ProtectedRoute({ children, role }: Props) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" replace />;

  // If logged in but wrong role -> redirect automatically to correct dashboard
  if (userRole !== role) {
    if (userRole === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (userRole === "OWNER") return <Navigate to="/owner/dashboard" replace />;
    if (userRole === "WORKER") return <Navigate to="/worker/dashboard" replace />;
    return <Navigate to="/auth" replace />;
  }

  return children;
}
