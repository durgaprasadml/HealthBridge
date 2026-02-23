import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================================
   DOCTOR → ADD MEDICAL RECORD
===================================================== */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { role, doctorId } = req.user;
    const { patientUid, diagnosis, symptoms, medications, notes, followUpDate } = req.body;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors can add medical records" });
    }

    if (!patientUid || !diagnosis || !medications) {
      return res.status(400).json({ message: "Patient UID, diagnosis and medications required" });
    }

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Create medical record
    const record = await prisma.medicalRecord.create({
      data: {
        patientId: patient.id,
        doctorId,
        diagnosis,
        symptoms: symptoms || "",
        medications,
        notes: notes || "",
        followUpDate: followUpDate || null,
      },
    });

    // If follow-up date is set, create a reminder
    if (followUpDate) {
      await prisma.reminder.create({
        data: {
          patientId: patient.id,
          doctorId,
          message: `Follow-up checkup for: ${diagnosis}`,
          checkupDate: new Date(followUpDate),
          status: "PENDING",
        },
      });
    }

    res.json({
      message: "Medical record added successfully",
      record: {
        id: record.id,
        diagnosis: record.diagnosis,
        createdAt: record.createdAt,
      },
    });
  } catch (err) {
    console.error("ADD MEDICAL RECORD ERROR:", err);
    res.status(500).json({ message: "Failed to add medical record" });
  }
});

/* =====================================================
   GET MEDICAL RECORDS (by patient UID)
===================================================== */
router.get("/patient/:patientUid", verifyToken, async (req, res) => {
  try {
    const { role, doctorId } = req.user;
    const { patientUid } = req.params;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors can view medical records" });
    }

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if doctor has access
    const now = new Date();
    const normalAccess = await prisma.accessRequest.findFirst({
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

    if (!normalAccess && !emergencyAccess) {
      return res.status(403).json({ message: "No access to this patient's records" });
    }

    const records = await prisma.medicalRecord.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: {
          select: { name: true, doctorUid: true, hospital: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ records });
  } catch (err) {
    console.error("GET MEDICAL RECORDS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch medical records" });
  }
});

/* =====================================================
   PATIENT → GET OWN MEDICAL RECORDS
===================================================== */
router.get("/my-records", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can view their records" });
    }

    const records = await prisma.medicalRecord.findMany({
      where: { patientId: userId },
      include: {
        doctor: {
          select: { name: true, doctorUid: true, hospital: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ records });
  } catch (err) {
    console.error("GET MY RECORDS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch medical records" });
  }
});

export default router;

