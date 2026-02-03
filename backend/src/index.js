import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import hospitalAuthRoutes from "./routes/hospital.auth.routes.js";
import doctorAuthRoutes from "./routes/doctor.auth.routes.js";
import accessRoutes from "./routes/access.routes.js";
import hospitalMonitorRoutes from "./routes/hospital.monitor.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // ⬅️ MUST be before routes

app.use("/auth", authRoutes);
app.use("/hospital", hospitalAuthRoutes);
app.use("/doctor", doctorAuthRoutes); // ⬅️ THIS IS THE KEY LINE
app.use("/access", accessRoutes);
app.use("/hospital", hospitalMonitorRoutes);

app.get("/", (req, res) => {
  res.send("HealthBridge API running");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});