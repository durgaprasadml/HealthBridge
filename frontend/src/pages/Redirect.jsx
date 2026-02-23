import { Navigate } from "react-router-dom";

export default function Redirect() {
  const role = localStorage.getItem("role");

  if (role === "PATIENT") return <Navigate to="/patient" />;
  if (role === "DOCTOR") return <Navigate to="/doctor" />;
  if (role === "HOSPITAL") return <Navigate to="/hospital" />;

  return <Navigate to="/" />;
}