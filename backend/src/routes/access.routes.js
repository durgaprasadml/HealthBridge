import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * =====================================================
 * DOCTOR → REQUEST ACCESS TO PATIENT
 * =====================================================
 */
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { role, doctorId } = req.user;
    const { patientUid, durationHours } = req.body;

    // 🔒 Role check
    if (role !== "DOCTOR") {
      return res
        .status(403)
        .json({ message: "Only doctors can request access" });
    }

    if (!patientUid || !durationHours) {
      return res
        .status(400)
        .json({ message: "patientUid and durationHours are required" });
    }

    // 🔎 Find patient
    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // 🕒 Calculate expiry
    const expiresAt = new Date(
      Date.now() + Number(durationHours) * 60 * 60 * 1000
    );

    // 📝 Create access request
    const request = await prisma.accessRequest.create({
      data: {
        doctorId,
        patientId: patient.id,
        expiresAt,
        status: "PENDING",
      },
    });

    // 🧾 Audit log
    await prisma.auditLog.create({
      data: {
        actorRole: "DOCTOR",
        actorId: doctorId,
        action: "REQUEST_ACCESS",
        targetId: patient.id,
      },
    });

    res.json({
      message: "Access request created",
      requestId: request.id,
      status: request.status,
      expiresAt,
    });
  } catch (err) {
    console.error("ACCESS REQUEST ERROR:", err);
    res.status(500).json({ message: "Failed to create access request" });
  }
});

export default router;