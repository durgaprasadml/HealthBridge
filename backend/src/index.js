import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ROUTES
import authRoutes from "./routes/auth.routes.js";
import accessRoutes from "./routes/access.routes.js";
import hospitalAuthRoutes from "./routes/hospital.auth.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import doctorAuthRoutes from "./routes/doctor.auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import medicalRoutes from "./routes/medical.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";

dotenv.config();

const app = express();

/* ===============================
   MIDDLEWARES
================================ */
app.use(cors());
app.use(express.json());

/* ===============================
   ROUTE REGISTRATION
================================ */
app.use("/auth", authRoutes);                 // patient auth
app.use("/access", accessRoutes);             // access control
app.use("/hospital", hospitalAuthRoutes);    // hospital signup/login
app.use("/hospital", hospitalRoutes);        // hospital monitoring
app.use("/doctor", doctorAuthRoutes);        // doctor login
app.use("/doctor", doctorRoutes);            // doctor actions
app.use("/medical", medicalRoutes);          // medical records
app.use("/reminders", reminderRoutes);        // reminders
app.use("/profile", profileRoutes);          // user profile
app.use("/emergency", emergencyRoutes);      // public emergency access

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("HealthBridge API running");
});

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});