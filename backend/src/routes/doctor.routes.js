import express from "express";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * HOSPITAL → CREATE DOCTOR
 */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { role, hospitalId } = req.user;
    const { name, phone } = req.body;

    if (role !== "HOSPITAL") {
      return res.status(403).json({ message: "Only hospital can create doctors" });
    }

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone required" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const existing = await prisma.doctor.findUnique({
      where: { phone },
    });

    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    const doctorUid = `DOC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const doctor = await prisma.doctor.create({
      data: {
        name,
        phone,
        doctorUid,
        hospitalId,
      },
    });

    res.json({
      message: "Doctor created successfully",
      doctor: {
        name: doctor.name,
        phone: doctor.phone,
        doctorUid: doctor.doctorUid,
      },
    });
  } catch (err) {
    console.error("CREATE DOCTOR ERROR:", err);
    res.status(500).json({ message: "Failed to create doctor" });
  }
});

export default router;