import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { generateOTP, sendOTP } from "../utils/otp.js";

const router = express.Router();

/**
 * =========================
 * SIGNUP (NO OTP)
 * =========================
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate Health UID
    const healthUid =
      "HB-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        healthUid,
        role: "PATIENT",
      },
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        healthUid: user.healthUid,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({ message: "Signup failed" });
  }
});

/**
 * =========================
 * SEND OTP (LOGIN)
 * =========================
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.oTP.create({
      data: {
        phone,
        otp,
        expiresAt,
      },
    });

    await sendOTP(phone, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/**
 * =========================
 * VERIFY OTP (LOGIN)
 * =========================
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const record = await prisma.oTP.findFirst({
      where: {
        phone,
        otp,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.oTP.delete({
      where: { id: record.id },
    });

    const token = jwt.sign(
      { phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

export default router;
