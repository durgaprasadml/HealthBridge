import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * DOCTOR → REQUEST ACCESS TO PATIENT
 */
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { role, doctorUid } = req.user;
    const { patientUid, durationHours } = req.body;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors can request access" });
    }

    if (!patientUid || !durationHours) {
      return res
        .status(400)
        .json({ message: "patientUid and durationHours required" });
    }

    // ✅ find doctor by doctorUid (NOT random id)
    const doctor = await prisma.doctor.findUnique({
      where: { doctorUid },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const access = await prisma.accessRequest.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        expiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1000),
      },
    });

    res.json({
      message: "Access request created",
      status: access.status,
      expiresAt: access.expiresAt,
    });
  } catch (err) {
    console.error("ACCESS REQUEST ERROR:", err);
    res.status(500).json({ message: "Failed to create access request" });
  }
});

export default router;