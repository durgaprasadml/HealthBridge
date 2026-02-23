import express from "express";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateHospitalUid } from "../utils/hospitalUid.js";

const router = express.Router();

/**
 * HOSPITAL SIGNUP
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, location, adminName, phone, email, password } = req.body;

    if (!name || !location || !adminName || !phone || !email || !password) {
      return res.status(400).json({ message: "Name, location, adminName, phone, email and password are required" });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingHospital = await prisma.hospital.findFirst({
      where: {
        OR: [{ phone }, { email: email.toLowerCase() }],
      },
    });

    if (existingHospital) {
      return res.status(400).json({ message: "Hospital with this phone/email already exists" });
    }

    let hospitalUid = generateHospitalUid();
    while (await prisma.hospital.findUnique({ where: { hospitalUid } })) {
      hospitalUid = generateHospitalUid();
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const hospital = await prisma.hospital.create({
      data: {
        name,
        location,
        adminName,
        phone,
        email: email.toLowerCase(),
        passwordHash,
        hospitalUid,
      },
    });

    // create hospital token
    const token = jwt.sign(
      {
        role: "HOSPITAL",
        hospitalId: hospital.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Hospital registered successfully",
      hospital: {
        id: hospital.id,
        name: hospital.name,
        location: hospital.location,
        hospitalUid: hospital.hospitalUid,
        adminName: hospital.adminName,
        phone: hospital.phone,
        email: hospital.email,
      },
      token,
    });
  } catch (err) {
    console.error("HOSPITAL SIGNUP ERROR:", err);
    res.status(500).json({ message: "Hospital signup failed" });
  }
});

/**
 * HOSPITAL LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { hospitalUid, email, phone, password } = req.body;
    const identifier = hospitalUid || email || phone;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    const normalized = identifier.trim();
    const where = normalized.includes("@")
      ? { email: normalized.toLowerCase() }
      : /^[6-9]\d{9}$/.test(normalized)
      ? { phone: normalized }
      : { hospitalUid: normalized.toUpperCase() };

    const hospital = await prisma.hospital.findUnique({ where });
    if (!hospital || !hospital.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, hospital.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        role: "HOSPITAL",
        hospitalId: hospital.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Hospital login successful",
      token,
      hospital: {
        id: hospital.id,
        name: hospital.name,
        location: hospital.location,
        hospitalUid: hospital.hospitalUid,
        adminName: hospital.adminName,
        phone: hospital.phone,
        email: hospital.email,
      },
    });
  } catch (err) {
    console.error("HOSPITAL LOGIN ERROR:", err);
    res.status(500).json({ message: "Hospital login failed" });
  }
});

export default router;
