import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { auditLog } from "../utils/audit.js";

const router = express.Router();

/* =====================================================
   DOCTOR → REQUEST NORMAL ACCESS
===================================================== */
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

/* =====================================================
   PATIENT → VIEW REQUESTS
===================================================== */
router.get("/requests", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients allowed" });
    }

    const requests = await prisma.accessRequest.findMany({
      where: { patientId: userId },
      include: {
        doctor: {
          select: { name: true, doctorUid: true },
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

/* =====================================================
   PATIENT → VIEW ACTIVE ACCESSES
===================================================== */
router.get("/active-accesses", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients allowed" });
    }

    const now = new Date();
    
    // Get approved normal accesses
    const normalAccesses = await prisma.accessRequest.findMany({
      where: {
        patientId: userId,
        status: "APPROVED",
        expiresAt: { gt: now },
      },
      include: {
        doctor: {
          select: { name: true, doctorUid: true, specialization: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get active emergency accesses
    const emergencyAccesses = await prisma.emergencyAccess.findMany({
      where: {
        patientId: userId,
        status: "ACTIVE",
        expiresAt: { gt: now },
      },
      include: {
        doctor: {
          select: { name: true, doctorUid: true, specialization: true },
        },
        hospital: {
          select: { name: true, hospitalUid: true },
        },
      },
      orderBy: { startedAt: "desc" },
    });

    res.json({
      activeAccesses: [
        ...normalAccesses.map((a) => ({
          id: a.id,
          type: "STANDARD",
          doctor: a.doctor,
          startedAt: a.createdAt,
          expiresAt: a.expiresAt,
        })),
        ...emergencyAccesses.map((e) => ({
          id: e.id,
          type: "EMERGENCY",
          doctor: e.doctor,
          hospital: e.hospital,
          reason: e.reason,
          startedAt: e.startedAt,
          expiresAt: e.expiresAt,
        })),
      ],
    });
  } catch (err) {
    console.error("FETCH ACTIVE ACCESSES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch active accesses" });
  }
});

/* =====================================================
   PATIENT → REVOKE ACCESS
===================================================== */
router.post("/revoke", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { accessId, accessType } = req.body; // accessType: 'normal' or 'emergency'

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients allowed" });
    }

    if (!accessId || !accessType) {
      return res.status(400).json({ message: "accessId and accessType required" });
    }

    if (accessType === "normal") {
      const request = await prisma.accessRequest.findUnique({
        where: { id: accessId },
      });

      if (!request || request.patientId !== userId) {
        return res.status(404).json({ message: "Access request not found" });
      }

      await prisma.accessRequest.update({
        where: { id: accessId },
        data: { status: "REVOKED" },
      });

      await auditLog({
        actorRole: "PATIENT",
        actorId: userId,
        action: "REVOKE_ACCESS",
        targetId: request.doctorId,
      });
    } else if (accessType === "emergency") {
      const emergency = await prisma.emergencyAccess.findUnique({
        where: { id: accessId },
      });

      if (!emergency || emergency.patientId !== userId) {
        return res.status(404).json({ message: "Emergency access not found" });
      }

      await prisma.emergencyAccess.update({
        where: { id: accessId },
        data: { 
          status: "REVOKED",
          revokedAt: new Date(),
        },
      });

      await auditLog({
        actorRole: "PATIENT",
        actorId: userId,
        action: "REVOKE_EMERGENCY_ACCESS",
        targetId: emergency.doctorId,
      });
    }

    res.json({ message: "Access revoked successfully" });
  } catch (err) {
    console.error("REVOKE ACCESS ERROR:", err);
    res.status(500).json({ message: "Failed to revoke access" });
  }
});

/* =====================================================
   PATIENT → APPROVE / REVOKE
===================================================== */
router.post("/respond", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { requestId, action } = req.body;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients allowed" });
    }

    const request = await prisma.accessRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.patientId !== userId) {
      return res.status(404).json({ message: "Access request not found" });
    }

    const status = action === "APPROVE" ? "APPROVED" : "REVOKED";

    const updated = await prisma.accessRequest.update({
      where: { id: requestId },
      data: { status },
    });

    await auditLog({
      actorRole: "PATIENT",
      actorId: userId,
      action: status === "APPROVED" ? "APPROVE_ACCESS" : "REVOKE_ACCESS",
      targetId: request.doctorId,
    });

    res.json({
      message: `Access ${status.toLowerCase()}`,
      status: updated.status,
    });
  } catch (err) {
    console.error("RESPOND ERROR:", err);
    res.status(500).json({ message: "Failed to respond" });
  }
});

/* =====================================================
   DOCTOR → START EMERGENCY ACCESS
===================================================== */
router.post("/emergency/start", verifyToken, async (req, res) => {
  try {
    const { role, doctorId, hospitalId } = req.user;
    const { patientUid, reason } = req.body;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors allowed" });
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
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

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
    console.error("EMERGENCY ERROR:", err);
    res.status(500).json({ message: "Failed to start emergency access" });
  }
});

/* =====================================================
   DOCTOR → VIEW PATIENT (NORMAL / EMERGENCY)
===================================================== */
router.get("/patient/:patientUid", verifyToken, async (req, res) => {
  try {
    const { role, doctorId } = req.user;
    const { patientUid } = req.params;

    if (role !== "DOCTOR") {
      return res.status(403).json({ message: "Only doctors allowed" });
    }

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const now = new Date();

    const normal = await prisma.accessRequest.findFirst({
      where: {
        doctorId,
        patientId: patient.id,
        status: "APPROVED",
        expiresAt: { gt: now },
      },
    });

    const emergency = await prisma.emergencyAccess.findFirst({
      where: {
        doctorId,
        patientId: patient.id,
        status: "ACTIVE",
        expiresAt: { gt: now },
      },
    });

    if (!normal && !emergency) {
      return res.status(403).json({ message: "No permission" });
    }

    await auditLog({
      actorRole: "DOCTOR",
      actorId: doctorId,
      action: "VIEW_PATIENT",
      targetId: patient.id,
    });

    res.json({
      patient: {
        name: patient.name,
        healthUid: patient.healthUid,
        accessedVia: normal ? "NORMAL" : "EMERGENCY",
      },
    });
  } catch (err) {
    console.error("VIEW PATIENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch patient" });
  }
});

/* =====================================================
   HOSPITAL → VIEW ACTIVE ACCESS
===================================================== */
router.get("/hospital/active-access", verifyToken, async (req, res) => {
  try {
    const { role, hospitalId } = req.user;

    if (role !== "HOSPITAL") {
      return res.status(403).json({ message: "Only hospitals allowed" });
    }

    const now = new Date();
    const [normal, emergencies] = await Promise.all([
      prisma.accessRequest.findMany({
        where: {
          status: "APPROVED",
          expiresAt: { gt: now },
          doctor: { hospitalId },
        },
        include: {
          doctor: { select: { id: true, name: true, doctorUid: true } },
          patient: { select: { healthUid: true } },
        },
      }),
      prisma.emergencyAccess.findMany({
        where: { hospitalId, status: "ACTIVE", expiresAt: { gt: now } },
        include: {
          doctor: { select: { id: true, name: true, doctorUid: true } },
          patient: { select: { healthUid: true } },
        },
      }),
    ]);

    res.json({
      activeAccesses: [
        ...normal.map((a) => ({
          id: a.id,
          type: "STANDARD",
          doctor: a.doctor,
          patient: a.patient,
          createdAt: a.createdAt,
          expiresAt: a.expiresAt,
        })),
        ...emergencies.map((e) => ({
          id: e.id,
          type: "EMERGENCY",
          doctor: e.doctor,
          patient: e.patient,
          createdAt: e.startedAt,
          expiresAt: e.expiresAt,
        })),
      ],
    });
  } catch (err) {
    console.error("HOSPITAL VIEW ERROR:", err);
    res.status(500).json({ message: "Failed to fetch active access" });
  }
});

export default router;
