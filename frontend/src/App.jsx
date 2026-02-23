import { Routes, Route, Navigate } from "react-router-dom";

/* Layout */
import Layout from "./components/Layout";

/* Public Pages */
import Home from "./pages/Home";
import Login from "./pages/Login";
import PatientLogin from "./pages/PatientLogin";
import DoctorLogin from "./pages/DoctorLogin";
import HospitalLogin from "./pages/HospitalLogin";
import VerifyOtp from "./pages/VerifyOtp";
import Signup from "./pages/Signup";
import Register from "./pages/Register";
import DoctorRegister from "./pages/DoctorRegister";
import HospitalRegister from "./pages/HospitalRegister";
import EmergencyAccess from "./pages/EmergencyAccess";

/* Dashboards */
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

/* Profile & Records */
import Profile from "./pages/Profile";
import PatientRecords from "./pages/PatientRecords";
import AddMedicalRecord from "./pages/AddMedicalRecord";

/* Auth Guard */
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      {/* EMERGENCY */}
      <Route
        path="/emergency"
        element={
          <Layout>
            <EmergencyAccess />
          </Layout>
        }
      />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/login/patient" element={<PatientLogin />} />
      <Route path="/login/doctor" element={<DoctorLogin />} />
      <Route path="/login/hospital" element={<HospitalLogin />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/patient" element={<Signup />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />
      <Route path="/register/hospital" element={<HospitalRegister />} />

      {/* PATIENT */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute role="PATIENT">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute role="PATIENT">
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/records"
        element={
          <ProtectedRoute role="PATIENT">
            <PatientRecords />
          </ProtectedRoute>
        }
      />

      {/* DOCTOR */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute role="DOCTOR">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/add-record"
        element={
          <ProtectedRoute role="DOCTOR">
            <AddMedicalRecord />
          </ProtectedRoute>
        }
      />

      {/* HOSPITAL */}
      <Route
        path="/hospital"
        element={
          <ProtectedRoute role="HOSPITAL">
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
