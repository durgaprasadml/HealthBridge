import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { generateHealthUid } from "../utils/healthUid.js";
import { generateHospitalUid } from "../utils/hospitalUid.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================================
   HOSPITAL SIGNUP → SEND OTP
===================================================== */
router.post("/hospital/signup/send-otp", async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    if (!name || !phone || !location) {
      return res.status(400).json({
        message: "Hospital name, phone, and location are required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const exists = await prisma.hospital.findFirst({
      where: { phone },
    });

    if (exists) {
      return res.status(400).json({ message: "Hospital already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        phone,
        otp,
        purpose: "HOSPITAL_SIGNUP",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`🏥 HOSPITAL SIGNUP OTP for ${phone}: ${otp}`);

    res.json({ message: "OTP sent for hospital signup" });
  } catch (err) {
    console.error("HOSPITAL SIGNUP SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* =====================================================
   HOSPITAL SIGNUP → VERIFY OTP
===================================================== */
router.post("/hospital/signup/verify-otp", async (req, res) => {
  try {
    const { name, phone, location, otp } = req.body;

    if (!name || !phone || !location || !otp) {
      return res.status(400).json({ message: "All fields required" });
    }

    const record = await prisma.otp.findFirst({
      where: { phone, otp, purpose: "HOSPITAL_SIGNUP" },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.otp.delete({ where: { id: record.id } });

    const hospital = await prisma.hospital.create({
      data: {
        name,
        phone,
        location,
        hospitalUid: generateHospitalUid(),
      },
    });

    res.json({
      message: "Hospital registered successfully",
      hospital: {
        name: hospital.name,
        phone: hospital.phone,
        location: hospital.location,
        hospitalUid: hospital.hospitalUid,
      },
    });
  } catch (err) {
    console.error("HOSPITAL SIGNUP VERIFY ERROR:", err);
    res.status(500).json({ message: "Hospital signup failed" });
  }
});

/* =====================================================
   HOSPITAL LOGIN → SEND OTP (PHONE or UID)
===================================================== */
router.post("/hospital/login/send-otp", async (req, res) => {
  try {
    let identifier = req.body.phone || req.body.hospitalUid;

    if (!identifier) {
      return res.status(400).json({ message: "Phone or Hospital UID required" });
    }

    identifier = identifier.toUpperCase();

    const hospital = identifier.startsWith("HOSP-")
      ? await prisma.hospital.findUnique({ where: { hospitalUid: identifier } })
      : await prisma.hospital.findFirst({ where: { phone: identifier } });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        phone: hospital.phone,
        otp,
        purpose: "HOSPITAL_LOGIN",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`🏥 HOSPITAL LOGIN OTP for ${hospital.phone}: ${otp}`);

    res.json({ message: "OTP sent for hospital login" });
  } catch (err) {
    console.error("HOSPITAL LOGIN SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* =====================================================
   HOSPITAL LOGIN → VERIFY OTP
===================================================== */
router.post("/hospital/login/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = await prisma.otp.findFirst({
      where: { phone, otp, purpose: "HOSPITAL_LOGIN" },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.otp.delete({ where: { id: record.id } });

    const hospital = await prisma.hospital.findFirst({ where: { phone } });

    const token = jwt.sign(
      {
        role: "HOSPITAL",
        hospitalId: hospital.id,
        hospitalUid: hospital.hospitalUid,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Hospital login successful",
      token,
      hospital: {
        name: hospital.name,
        hospitalUid: hospital.hospitalUid,
      },
    });
  } catch (err) {
    console.error("HOSPITAL LOGIN VERIFY ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;