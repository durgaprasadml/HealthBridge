import express from "express";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * 🔢 Generate 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 📤 SEND OTP (MOCK MODE)
 * POST /auth/send-otp
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Delete old OTPs for same phone
    await prisma.oTP.deleteMany({
      where: { phone },
    });

    // Save new OTP
    await prisma.oTP.create({
      data: {
        phone,
        otp,
        expiresAt,
      },
    });

    // 🔥 MOCK OTP OUTPUT
    console.log(`📲 MOCK OTP for ${phone}: ${otp}`);

    res.json({
      message: "OTP sent successfully (MOCK MODE)",
      otp, // ⚠️ expose only in dev
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

/**
 * ✅ VERIFY OTP
 * POST /auth/verify-otp
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res
        .status(400)
        .json({ message: "Phone and OTP are required" });
    }

    const record = await prisma.oTP.findFirst({
      where: { phone, otp },
      orderBy: { expiresAt: "desc" },
    });

    if (!record) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(401).json({ message: "OTP expired" });
    }

    // Delete OTP after successful verification
    await prisma.oTP.deleteMany({
      where: { phone },
    });

    // Create JWT
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
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
});

export default router;
