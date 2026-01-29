import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { generateHealthUid } from "../utils/healthUid.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================================
   SIGNUP → SEND OTP
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

    await prisma.oTP.create({
      data: {
        phone,
        otp,
        purpose: "SIGNUP",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    console.log(`SIGNUP OTP for ${phone}: ${otp}`);

    res.json({
      message: "OTP sent for signup",
      sentTo: phone,
    });
  } catch (error) {
    console.error("SIGNUP SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* =====================================================
   SIGNUP → VERIFY OTP → CREATE USER
===================================================== */
router.post("/signup/verify-otp", async (req, res) => {
  try {
    const { name, phone, otp } = req.body;

    if (!name || !phone || !otp) {
      return res.status(400).json({ message: "Name, phone and OTP required" });
    }

    const record = await prisma.oTP.findFirst({
      where: { phone, otp, purpose: "SIGNUP" },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 🔥 DELETE OTP AFTER USE
    await prisma.oTP.delete({ where: { id: record.id } });

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
  } catch (error) {
    console.error("SIGNUP VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* =====================================================
   LOGIN → SEND OTP (UID or PHONE)
===================================================== */
router.post("/login/send-otp", async (req, res) => {
  try {
    let identifier = null;

    if (typeof req.body.identifier === "string") {
      identifier = req.body.identifier.trim().toUpperCase();
    } else if (req.body.phone) {
      identifier = req.body.phone.trim();
    } else if (req.body.healthUid) {
      identifier = req.body.healthUid.trim().toUpperCase();
    }

    if (!identifier) {
      return res.status(400).json({ message: "Identifier required" });
    }

    const isPhone = /^[6-9]\d{9}$/.test(identifier);
    const isUid = /^HB-[A-Z0-9]+$/.test(identifier);

    let user;

    if (isPhone) {
      user = await prisma.user.findUnique({ where: { phone: identifier } });
    } else if (isUid) {
      user = await prisma.user.findUnique({ where: { healthUid: identifier } });
    } else {
      return res.status(400).json({ message: "Invalid UID or phone number" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.oTP.create({
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
   LOGIN → VERIFY OTP
===================================================== */
router.post("/login/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const record = await prisma.oTP.findFirst({
      where: { phone, otp, purpose: "LOGIN" },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 🔥 DELETE OTP AFTER USE
    await prisma.oTP.delete({ where: { id: record.id } });

    const user = await prisma.user.findUnique({ where: { phone } });

    const token = jwt.sign(
      { healthUid: user.healthUid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("LOGIN VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

/* =====================================================
   GET PROFILE
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
  } catch (error) {
    console.error("AUTH ME ERROR:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

export default router;