import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import accessRoutes from "./routes/access.routes.js";

dotenv.config();

const app = express();

app.use("/access", accessRoutes);

app.use(cors());
app.use(express.json());

/**
 * PUBLIC HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.send("HealthBridge Backend is running 🚀");
});

/**
 * AUTH ROUTES (PUBLIC — NO JWT)
 */
app.use("/auth", authRoutes);

/**
 * 🔒 PROTECTED ROUTES GO BELOW (LATER)
 * app.use("/records", verifyToken, recordsRoutes);
 */

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
