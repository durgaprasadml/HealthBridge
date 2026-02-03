import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { auditLog } from "../utils/audit.js";

const router = express.Router();

/* ===============================
   DOCTOR → REQUEST NORMAL ACCESS
================================ */
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { role, doctorId } = req.user;
    const { patientUid, durationHours } = req.body;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors can request access" });
    }

    if (!patientUid || !durationHours) {
      return res.status(400).json({ message: "patientUid and durationHours required" });
    }

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const access = await prisma.accessRequest.create({
      data: {
        doctorId,
        patientId: patient.id,
        expiresAt: new Date(Date.now() + durationHours * 60 * 60 * 1000),
      },
    });

    // 🔍 AUDIT LOG
    await auditLog({
      actorRole: "DOCTOR",
      actorId: doctorId,
      action: "REQUEST_ACCESS",
      targetId: patient.id,
    });

    res.json({
      message: "Access request created",
      requestId: access.id,
      status: access.status,
      expiresAt: access.expiresAt,
    });
  } catch (err) {
    console.error("ACCESS REQUEST ERROR:", err);
    res.status(500).json({ message: "Failed to create access request" });
  }
});

/* ===============================
   DOCTOR → START EMERGENCY ACCESS
================================ */
router.post("/emergency/start", verifyToken, async (req, res) => {
  try {
    const { role, doctorId, hospitalId } = req.user;
    const { patientUid, reason } = req.body;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors can start emergency access" });
    }

    if (!patientUid || !reason) {
      return res.status(400).json({ message: "patientUid and reason required" });
    }

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const emergency = await prisma.emergencyAccess.create({
      data: {
        doctorId,
        patientId: patient.id,
        hospitalId,
        reason,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs
      },
    });

    // 🔍 AUDIT LOG
    await auditLog({
      actorRole: "DOCTOR",
      actorId: doctorId,
      action: "EMERGENCY_ACCESS_START",
      targetId: patient.id,
    });

    res.json({
      message: "Emergency access started",
      emergencyId: emergency.id,
      expiresAt: emergency.expiresAt,
    });
  } catch (err) {
    console.error("EMERGENCY ACCESS ERROR:", err);
    res.status(500).json({ message: "Failed to start emergency access" });
  }
});

/* ===============================
   DOCTOR → VIEW PATIENT DATA
   (NORMAL or EMERGENCY)
================================ */
router.get("/patient/:patientUid", verifyToken, async (req, res) => {
  try {
    const { role, doctorId } = req.user;
    const { patientUid } = req.params;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors can view patient data" });
    }

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const now = new Date();

    const approvedAccess = await prisma.accessRequest.findFirst({
      where: {
        doctorId,
        patientId: patient.id,
        status: "APPROVED",
        expiresAt: { gt: now },
      },
    });

    const emergencyAccess = await prisma.emergencyAccess.findFirst({
      where: {
        doctorId,
        patientId: patient.id,
        status: "ACTIVE",
        expiresAt: { gt: now },
      },
    });

    if (!approvedAccess && !emergencyAccess) {
      return res.status(403).json({
        message: "No permission to access patient data",
      });
    }

    // 🔍 AUDIT LOG
    await auditLog({
      actorRole: "DOCTOR",
      actorId: doctorId,
      action: "VIEW_PATIENT_DATA",
      targetId: patient.id,
    });

    res.json({
      patient: {
        name: patient.name,
        healthUid: patient.healthUid,
        role: patient.role,
        accessedVia: approvedAccess ? "NORMAL" : "EMERGENCY",
      },
    });
  } catch (err) {
    console.error("VIEW PATIENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch patient data" });
  }
});

export default router;