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
    res.status(500).json({ message: "Failed to create access request" });
  }
});

/* ===============================
   PATIENT → VIEW ACCESS REQUESTS
================================ */
router.get("/requests", verifyToken, async (req, res) => {
  const { role, userId } = req.user;

  if (role !== "PATIENT") {
    return res.status(403).json({ message: "Only patients can view requests" });
  }

  const requests = await prisma.accessRequest.findMany({
    where: { patientId: userId },
    include: {
      doctor: { select: { name: true, doctorUid: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(requests);
});

/* ===============================
   PATIENT → APPROVE / REJECT / REVOKE
================================ */
router.post("/respond", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { requestId, action } = req.body;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can respond" });
    }

    const request = await prisma.accessRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.patientId !== userId) {
      return res.status(404).json({ message: "Request not found" });
    }

    const status =
      action === "APPROVE"
        ? "APPROVED"
        : action === "REJECT"
        ? "REVOKED"
        : "REVOKED";

    await prisma.accessRequest.update({
      where: { id: requestId },
      data: { status },
    });

    await auditLog({
      actorRole: "PATIENT",
      actorId: userId,
      action: `ACCESS_${status}`,
      targetId: request.doctorId,
    });

    res.json({ message: `Access ${status.toLowerCase()}`, status });
  } catch (err) {
    res.status(500).json({ message: "Failed to respond" });
  }
});

/* ===============================
   PATIENT → REVOKE ACCESS (ANYTIME)
================================ */
router.post("/revoke", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { requestId } = req.body;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can revoke access" });
    }

    const request = await prisma.accessRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.patientId !== userId) {
      return res.status(404).json({ message: "Access request not found" });
    }

    await prisma.accessRequest.update({
      where: { id: requestId },
      data: { status: "REVOKED" },
    });

    await auditLog({
      actorRole: "PATIENT",
      actorId: userId,
      action: "ACCESS_REVOKED",
      targetId: request.doctorId,
    });

    res.json({ message: "Access revoked", status: "REVOKED" });
  } catch (err) {
    res.status(500).json({ message: "Failed to revoke access" });
  }
});

export default router;