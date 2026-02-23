import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

/* =====================================================
   PUBLIC EMERGENCY ACCESS BY PHONE
   Anyone can access this - no auth required
===================================================== */
router.get("/by-phone/:phone", async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const patient = await prisma.user.findUnique({
      where: { phone },
      select: {
        name: true,
        healthUid: true,
        bloodGroup: true,
        allergies: true,
        emergencyContact: true,
        emergencyPhone: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found with this phone number" });
    }

    // Return basic emergency info only
    res.json({
      emergency: {
        name: patient.name,
        healthUid: patient.healthUid,
        bloodGroup: patient.bloodGroup || "Not set",
        allergies: patient.allergies || "None",
        emergencyContact: patient.emergencyContact || "Not set",
        emergencyPhone: patient.emergencyPhone || "Not set",
      },
    });
  } catch (err) {
    console.error("EMERGENCY ACCESS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch emergency info" });
  }
});

export default router;

