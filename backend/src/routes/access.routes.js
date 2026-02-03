import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * =========================
 * DOCTOR → REQUEST ACCESS
 * =========================
 */
router.post("/request", verifyToken, async (req, res) => {
  try {
    const { patientUid } = req.body;
    const doctorUid = req.user.doctorUid;

    if (!doctorUid) {
      return res.status(403).json({ message: "Only doctors can request access" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { doctorUid },
      include: { hospital: true },
    });

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or patient not found" });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const access = await prisma.accessRequest.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        hospitalId: doctor.hospitalId,
        status: "PENDING",
        expiresAt,
      },
    });

    res.json({
      message: "Access request sent to patient",
      consentInfo: {
        doctorName: doctor.name,
        hospitalName: doctor.hospital.name,
        expiresAt,
      },
      accessId: access.id,
    });
  } catch (error) {
    console.error("ACCESS REQUEST ERROR:", error);
    res.status(500).json({ message: "Failed to request access" });
  }
});

/**
 * =========================
 * PATIENT → APPROVE ACCESS
 * =========================
 */
router.post("/approve", verifyToken, async (req, res) => {
  try {
    const { accessId } = req.body;
    const patientUid = req.user.healthUid;

    const access = await prisma.accessRequest.findUnique({
      where: { id: accessId },
      include: {
        patient: true,
      },
    });

    if (!access || access.patient.healthUid !== patientUid) {
      return res.status(403).json({ message: "Unauthorized approval" });
    }

    const updated = await prisma.accessRequest.update({
      where: { id: accessId },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    res.json({
      message: "Doctor access approved",
      validTill: updated.expiresAt,
    });
  } catch (error) {
    console.error("ACCESS APPROVE ERROR:", error);
    res.status(500).json({ message: "Failed to approve access" });
  }
});

export default router;