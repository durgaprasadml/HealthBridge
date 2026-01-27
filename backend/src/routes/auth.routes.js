const MOCK_OTP = true;
import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import { generateOTP } from "../utils/otp.js";
import { generateHealthUid } from "../utils/healthUid.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = express.Router();

/**
 * SIGNUP (Create account)
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

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
        id: user.id,
        name: user.name,
        phone: user.phone,
        healthUid: user.healthUid,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

/**
 * LOGIN → SEND OTP
 */
router.post("/login/send-otp", async (req, res) => {
  try {
    const { phone, healthUid } = req.body;

    if (!phone && !healthUid) {
      return res.status(400).json({
        message: "Provide phone or healthUid",
      });
    }

    // Find user by phone OR healthUid
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone } : undefined,
          healthUid ? { healthUid } : undefined,
        ].filter(Boolean),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Remove previous OTPs
    await prisma.oTP.deleteMany({
      where: {
        phone: user.phone,
        purpose: "LOGIN",
      },
    });

    await prisma.oTP.create({
      data: {
        phone: user.phone,
        otp,
        purpose: "LOGIN",
        expiresAt,
      },
    });

    console.log(`📌 MOCK LOGIN OTP for ${user.phone}: ${otp}`);

    return res.json({
      message: "OTP sent (mock mode)",
      sentTo: user.phone,
      otp, // REMOVE IN PRODUCTION
    });

  } catch (error) {
    console.error("LOGIN SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});



/**
 * LOGIN → VERIFY OTP
 */
router.post("/login/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = await prisma.oTP.findFirst({
      where: { phone, otp },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await prisma.user.findUnique({ where: { phone } });

    const token = jwt.sign(
      { healthUid: user.healthUid, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        healthUid: user.healthUid,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

/**
 * =========================
 * GET LOGGED-IN USER
 * =========================
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const { healthUid } = req.user;

    const user = await prisma.user.findUnique({
      where: { healthUid },
      select: {
        id: true,
        name: true,
        phone: true,
        healthUid: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile fetched",
      user,
    });
  } catch (error) {
    console.error("AUTH ME ERROR:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});


export default router;
