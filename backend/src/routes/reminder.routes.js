import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================================
   PATIENT → GET MY REMINDERS
===================================================== */
router.get("/my-reminders", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can view their reminders" });
    }

    const reminders = await prisma.reminder.findMany({
      where: { patientId: userId },
      include: {
        doctor: {
          select: { name: true, doctorUid: true, hospital: { select: { name: true } } },
        },
      },
      orderBy: { checkupDate: "asc" },
    });

    res.json({ reminders });
  } catch (err) {
    console.error("GET REMINDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
});

/* =====================================================
   PATIENT → COMPLETE/REMIND REMINDER
===================================================== */
router.put("/:id/complete", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { id } = req.params;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can complete reminders" });
    }

    const reminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!reminder || reminder.patientId !== userId) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    const updated = await prisma.reminder.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    res.json({ message: "Reminder completed", reminder: updated });
  } catch (err) {
    console.error("COMPLETE REMINDER ERROR:", err);
    res.status(500).json({ message: "Failed to complete reminder" });
  }
});

/* =====================================================
   DOCTOR → GET PATIENT REMINDERS (for their patients)
===================================================== */
router.get("/patient/:patientUid", verifyToken, async (req, res) => {
  try {
    const { role, doctorId } = req.user;
    const { patientUid } = req.params;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors can view patient reminders" });
    }

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const reminders = await prisma.reminder.findMany({
      where: { 
        patientId: patient.id,
        doctorId,
      },
      orderBy: { checkupDate: "asc" },
    });

    res.json({ reminders });
  } catch (err) {
    console.error("GET PATIENT REMINDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
});

export default router;

