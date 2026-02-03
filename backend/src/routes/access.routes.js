import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * ================================
 * DOCTOR → REQUEST ACCESS
 * ================================
 */
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

/**
 * ================================
 * PATIENT → VIEW REQUESTS
 * ================================
 */
router.get("/requests", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can view requests" });
    }

    const requests = await prisma.accessRequest.findMany({
      where: { patientId: userId },
      include: {
        doctor: {
          select: {
            name: true,
            doctorUid: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(requests);
  } catch (err) {
    console.error("FETCH REQUESTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

/**
 * ================================
 * PATIENT → APPROVE / REJECT
 * ================================
 */
router.post("/respond", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { requestId, action } = req.body;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can respond" });
    }

    if (!requestId || !["APPROVE", "REJECT"].includes(action)) {
      return res.status(400).json({ message: "Invalid requestId or action" });
    }

    const request = await prisma.accessRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.patientId !== userId) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.expiresAt < new Date()) {
      return res.status(400).json({ message: "Request already expired" });
    }

    const updated = await prisma.accessRequest.update({
      where: { id: requestId },
      data: {
        status: action === "APPROVE" ? "APPROVED" : "REVOKED",
      },
    });

    res.json({
      message: `Access ${updated.status.toLowerCase()}`,
      status: updated.status,
    });
  } catch (err) {
    console.error("RESPOND ERROR:", err);
    res.status(500).json({ message: "Failed to respond to request" });
  }
});

export default router;