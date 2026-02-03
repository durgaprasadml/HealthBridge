import express from "express";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * HOSPITAL SIGNUP
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    const hospital = await prisma.hospital.create({
      data: {
        name,
        location,
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
      },
      token,
    });
  } catch (err) {
    console.error("HOSPITAL SIGNUP ERROR:", err);
    res.status(500).json({ message: "Hospital signup failed" });
  }
});

export default router;