import { Navigate } from "react-router-dom";
import { getRole, isLoggedIn } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (role && getRole() !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}