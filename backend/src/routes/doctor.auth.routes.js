import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";

const router = express.Router();

function getDoctorToken(doctor) {
  return jwt.sign(
    {
      role: "DOCTOR",
      doctorId: doctor.id,
      hospitalId: doctor.hospitalId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

/* =====================================================
   DOCTOR LOGIN → SEND OTP
===================================================== */
router.post("/login/send-otp", async (req, res) => {
  try {
    const { doctorUid } = req.body;
    const normalizedUid = doctorUid?.trim().toUpperCase();

    if (!normalizedUid) {
      return res.status(400).json({ message: "doctorUid is required" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { doctorUid: normalizedUid },
    });

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

    res.json({ message: "OTP sent to registered phone" });
  } catch (error) {
    console.error("DOCTOR SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* =====================================================
   DOCTOR LOGIN → VERIFY OTP
===================================================== */
router.post("/login/verify-otp", async (req, res) => {
  try {
    const { doctorUid, otp } = req.body;
    const normalizedUid = doctorUid?.trim().toUpperCase();

    if (!normalizedUid || !otp) {
      return res.status(400).json({ message: "doctorUid and OTP required" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { doctorUid: normalizedUid },
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const record = await prisma.otp.findFirst({
      where: {
        phone: doctor.phone,
        otp,
        purpose: "DOCTOR_LOGIN",
      },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.otp.delete({ where: { id: record.id } });

    const token = getDoctorToken(doctor);

    res.json({
      message: "Doctor login successful",
      token,
      user: {
        role: "DOCTOR",
        name: doctor.name,
      },
      doctor: {
        id: doctor.id,
        name: doctor.name,
        doctorUid: doctor.doctorUid,
        hospitalId: doctor.hospitalId,
      },
    });
  } catch (error) {
    console.error("DOCTOR VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Doctor login failed" });
  }
});

/* =====================================================
   DOCTOR LOGIN → PASSWORD
===================================================== */
router.post("/login/password", async (req, res) => {
  try {
    const { doctorUid, password } = req.body;
    const normalizedUid = doctorUid?.trim().toUpperCase();

    if (!normalizedUid || !password) {
      return res.status(400).json({ message: "doctorUid and password required" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { doctorUid: normalizedUid },
    });

    if (!doctor || !doctor.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, doctor.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = getDoctorToken(doctor);

    res.json({
      message: "Doctor login successful",
      token,
      user: {
        role: "DOCTOR",
        name: doctor.name,
      },
      doctor: {
        id: doctor.id,
        name: doctor.name,
        doctorUid: doctor.doctorUid,
        hospitalId: doctor.hospitalId,
      },
    });
  } catch (error) {
    console.error("DOCTOR PASSWORD LOGIN ERROR:", error);
    res.status(500).json({ message: "Doctor login failed" });
  }
});

export default router;
