import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* Layout */
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";
import { AnimatePresence } from "framer-motion";

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
import DoctorPatientRecords from "./pages/DoctorPatientRecords";

/* Auth Guard */
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* HOME */}
          <Route
            path="/"
            element={
              <PageTransition>
                <Layout>
                  <Home />
                </Layout>
              </PageTransition>
            }
          />

          {/* EMERGENCY */}
          <Route
            path="/emergency"
            element={
              <PageTransition>
                <Layout>
                  <EmergencyAccess />
                </Layout>
              </PageTransition>
            }
          />

          {/* AUTH */}
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/login/patient" element={<PageTransition><PatientLogin /></PageTransition>} />
          <Route path="/login/doctor" element={<PageTransition><DoctorLogin /></PageTransition>} />
          <Route path="/login/hospital" element={<PageTransition><HospitalLogin /></PageTransition>} />
          <Route path="/verify-otp" element={<PageTransition><VerifyOtp /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/register/patient" element={<PageTransition><Signup /></PageTransition>} />
          <Route path="/register/doctor" element={<PageTransition><DoctorRegister /></PageTransition>} />
          <Route path="/register/hospital" element={<PageTransition><HospitalRegister /></PageTransition>} />

          {/* PATIENT */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute role="PATIENT">
                <PageTransition>
                  <PatientDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute role="PATIENT">
                <PageTransition>
                  <Profile />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/records"
            element={
              <ProtectedRoute role="PATIENT">
                <PageTransition>
                  <PatientRecords />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* DOCTOR */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute role="DOCTOR">
                <PageTransition>
                  <DoctorDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/add-record"
            element={
              <ProtectedRoute role="DOCTOR">
                <PageTransition>
                  <AddMedicalRecord />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/patient/:id"
            element={
              <ProtectedRoute role="DOCTOR">
                <PageTransition>
                  <DoctorPatientRecords />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* HOSPITAL */}
          <Route
            path="/hospital"
            element={
              <ProtectedRoute role="HOSPITAL">
                <PageTransition>
                  <HospitalDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
