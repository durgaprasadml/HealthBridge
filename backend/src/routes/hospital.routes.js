import express from "express";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { verifyHospital } from "../middlewares/hospital.middleware.js";
import { generateDoctorUid } from "../utils/doctorUid.js";

const router = express.Router();

/**
 * HOSPITAL → CREATE DOCTOR
 */
router.post("/create-doctor", verifyToken, verifyHospital, async (req, res) => {
  try {
    const { name, phone, specialization, password } = req.body;
    const { hospitalId } = req.user;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone and password required" });
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

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    let doctorUid = generateDoctorUid();
    while (await prisma.doctor.findUnique({ where: { doctorUid } })) {
      doctorUid = generateDoctorUid();
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const doctor = await prisma.doctor.create({
      data: {
        name,
        phone,
        doctorUid,
        hospitalId,
        specialization: specialization || null,
        passwordHash,
      },
    });

    res.json({
      message: "Doctor created successfully",
      doctor: {
        id: doctor.id,
        name: doctor.name,
        phone: doctor.phone,
        doctorUid: doctor.doctorUid,
        specialization: doctor.specialization,
      },
    });
  } catch (err) {
    console.error("CREATE DOCTOR ERROR:", err);
    res.status(500).json({ message: "Failed to create doctor" });
  }
});

/**
 * HOSPITAL → GET DOCTORS
 */
router.get("/doctors", verifyToken, verifyHospital, async (req, res) => {
  try {
    const { hospitalId } = req.user;
    const doctors = await prisma.doctor.findMany({
      where: { hospitalId },
      select: {
        id: true,
        name: true,
        phone: true,
        doctorUid: true,
        specialization: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ doctors });
  } catch (err) {
    console.error("FETCH DOCTORS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

/**
 * HOSPITAL → GET PROFILE
 */
router.get("/profile", verifyToken, verifyHospital, async (req, res) => {
  try {
    const { hospitalId } = req.user;
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
      select: {
        id: true,
        name: true,
        location: true,
        hospitalUid: true,
        adminName: true,
        phone: true,
        email: true,
        createdAt: true,
      },
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    res.json({ hospital });
  } catch (err) {
    console.error("HOSPITAL PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch hospital profile" });
  }
});

export default router;
