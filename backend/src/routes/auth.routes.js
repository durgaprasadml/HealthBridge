import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { generateHealthUid } from "../utils/healthUid.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================================
   PATIENT SIGNUP → SEND OTP
===================================================== */
router.post("/signup/send-otp", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        phone,
        otp,
        purpose: "SIGNUP",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`PATIENT SIGNUP OTP for ${phone}: ${otp}`);

    res.json({ message: "OTP sent for signup" });
  } catch (err) {
    console.error("SIGNUP SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* =====================================================
   PATIENT SIGNUP → VERIFY OTP → CREATE ACCOUNT
===================================================== */
router.post("/signup/verify-otp", async (req, res) => {
  try {
    const { name, phone, otp } = req.body;

    if (!name || !phone || !otp) {
      return res.status(400).json({ message: "Name, phone and OTP required" });
    }

    const record = await prisma.otp.findFirst({
      where: { phone, otp, purpose: "SIGNUP" },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.otp.delete({ where: { id: record.id } });

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        role: "PATIENT",
        healthUid: generateHealthUid(),
      },
    });

    res.json({
      message: "Signup successful",
      user: {
        name: user.name,
        phone: user.phone,
        healthUid: user.healthUid,
      },
    });
  } catch (err) {
    console.error("SIGNUP VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* =====================================================
   PATIENT LOGIN → SEND OTP (UID OR PHONE)
===================================================== */
router.post("/login/send-otp", async (req, res) => {
  try {
    const { phone, healthUid, identifier } = req.body;

    let value = identifier || phone || healthUid;

    if (!value) {
      return res.status(400).json({ message: "Identifier required" });
    }

    value = value.trim().toUpperCase();

    const isPhone = /^[6-9]\d{9}$/.test(value);
    const isUid = /^HB-[A-Z0-9]{8}$/.test(value);

    let user;

    if (isPhone) {
      user = await prisma.user.findUnique({ where: { phone: value } });
    } else if (isUid) {
      user = await prisma.user.findUnique({ where: { healthUid: value } });
    } else {
      return res.status(400).json({ message: "Invalid UID or phone number" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        phone: user.phone,
        otp,
        purpose: "LOGIN",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`LOGIN OTP for ${user.phone}: ${otp}`);

    res.json({
      message: "OTP sent",
      sentTo: user.phone,
    });
  } catch (error) {
    console.error("LOGIN SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* =====================================================
   PATIENT LOGIN → VERIFY OTP
===================================================== */
router.post("/login/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const record = await prisma.otp.findFirst({
      where: { phone, otp, purpose: "LOGIN" },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.otp.delete({ where: { id: record.id } });

    const user = await prisma.user.findUnique({ where: { phone } });

    const token = jwt.sign(
      { role: user.role, healthUid: user.healthUid, userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("LOGIN VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* =====================================================
   GET CURRENT USER PROFILE
===================================================== */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const { healthUid } = req.user;

    const user = await prisma.user.findUnique({
      where: { healthUid },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

export default router;