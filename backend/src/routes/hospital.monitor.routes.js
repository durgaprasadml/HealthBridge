import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * HOSPITAL → VIEW LIVE ACTIVE ACCESS
 * Shows:
 * - Active consent-based access
 * - Active emergency access
 */
router.get("/active-access", verifyToken, async (req, res) => {
  try {
    const { role, hospitalId } = req.user;

    if (role !== "HOSPITAL") {
      return res.status(403).json({ message: "Only hospitals can view this" });
    }

    const now = new Date();

    // 🔹 Active consent-based access
    const consentAccess = await prisma.accessRequest.findMany({
      where: {
        status: "APPROVED",
        expiresAt: { gt: now },
        doctor: { hospitalId },
      },
      include: {
        doctor: {
          select: { name: true, doctorUid: true },
        },
        patient: {
          select: { healthUid: true },
        },
      },
    });

    // 🔹 Active emergency access
    const emergencyAccess = await prisma.emergencyAccess.findMany({
      where: {
        status: "ACTIVE",
        expiresAt: { gt: now },
        hospitalId,
      },
      include: {
        doctor: {
          select: { name: true, doctorUid: true },
        },
        patient: {
          select: { healthUid: true },
        },
      },
    });

    res.json({
      activeAccesses: [
        ...consentAccess.map(a => ({
          type: "CONSENT",
          doctor: a.doctor,
          patient: a.patient,
          expiresAt: a.expiresAt,
          createdAt: a.createdAt,
        })),
        ...emergencyAccess.map(e => ({
          type: "EMERGENCY",
          doctor: e.doctor,
          patient: e.patient,
          startedAt: e.startedAt,
          expiresAt: e.expiresAt,
        })),
      ],
    });
  } catch (err) {
    console.error("HOSPITAL MONITOR ERROR:", err);
    res.status(500).json({ message: "Failed to fetch active access" });
  }
});

export default router;