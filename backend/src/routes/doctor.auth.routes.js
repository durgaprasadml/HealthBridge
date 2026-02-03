import express from "express";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/* =====================================================
   DOCTOR LOGIN → SEND OTP
===================================================== */
router.post("/login/send-otp", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Doctor UID or phone required" });
    }

    const value = identifier.trim().toUpperCase();

    const isPhone = /^[6-9]\d{9}$/.test(value);
    const isDoctorUid = /^DOC-[A-Z0-9]+$/.test(value);

    let doctor;

    if (isPhone) {
      doctor = await prisma.doctor.findUnique({
        where: { phone: value },
      });
    } else if (isDoctorUid) {
      doctor = await prisma.doctor.findUnique({
        where: { doctorUid: value },
      });
    } else {
      return res.status(400).json({ message: "Invalid identifier" });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        phone: doctor.phone,
        otp,
        purpose: "DOCTOR_LOGIN",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`DOCTOR LOGIN OTP for ${doctor.phone}: ${otp}`);

    res.json({
      message: "OTP sent to doctor",
    });
  } catch (err) {
    console.error("DOCTOR LOGIN SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* =====================================================
   DOCTOR LOGIN → VERIFY OTP
===================================================== */
router.post("/login/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const record = await prisma.otp.findFirst({
      where: {
        phone,
        otp,
        purpose: "DOCTOR_LOGIN",
      },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.otp.delete({ where: { id: record.id } });

    const doctor = await prisma.doctor.findUnique({
      where: { phone },
    });

    const token = jwt.sign(
      {
        role: "DOCTOR",
        doctorId: doctor.id,
        hospitalId: doctor.hospitalId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Doctor login successful",
      token,
      doctor: {
        name: doctor.name,
        doctorUid: doctor.doctorUid,
      },
    });
  } catch (err) {
    console.error("DOCTOR LOGIN VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;