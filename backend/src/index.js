import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import hospitalAuthRoutes from "./routes/hospital.auth.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import medicalRoutes from "./routes/medical.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";
import emergencyRoutes from "./routes/emergency.routes.js";

dotenv.config();

const app = express();

/* 🔥 IMPORTANT */
app.use(express.json());   // <-- THIS FIXES YOUR ERROR
app.use(cors());

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/hospital", hospitalAuthRoutes); // Hospital signup/login
app.use("/hospital", hospitalRoutes);    // Hospital protected routes
app.use("/medical", medicalRoutes);
app.use("/profile", profileRoutes);
app.use("/reminder", reminderRoutes);
app.use("/emergency", emergencyRoutes);

app.get("/", (req, res) => {
  res.send("HealthBridge API running");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});