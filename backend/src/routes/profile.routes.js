import express from "express";
import prisma from "../prismaClient.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =====================================================
   GET PATIENT PROFILE
===================================================== */
router.get("/", verifyToken, async (req, res) => {
  try {
    const { role, userId, healthUid } = req.user;

    // For patients
    if (role === "PATIENT") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          phone: true,
          healthUid: true,
          bloodGroup: true,
          allergies: true,
          emergencyContact: true,
          emergencyPhone: true,
          dateOfBirth: true,
          gender: true,
          address: true,
          createdAt: true,
        },
      });
      return res.json({ user });
    }

    // For doctors - get their profile
    if (role === "DOCTOR") {
      const { doctorId } = req.user;
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
          hospital: {
            select: { name: true, location: true },
          },
        },
      });
      return res.json({ doctor });
    }

    // For hospitals
    if (role === "HOSPITAL") {
      const { hospitalId } = req.user;
      const hospital = await prisma.hospital.findUnique({
        where: { id: hospitalId },
        include: {
          doctors: {
            select: { id: true, name: true, doctorUid: true, phone: true },
          },
        },
      });
      return res.json({ hospital });
    }

    res.status(400).json({ message: "Invalid role" });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

/* =====================================================
   UPDATE PATIENT PROFILE
===================================================== */
router.put("/", verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.user;
    const { name, bloodGroup, allergies, emergencyContact, emergencyPhone, dateOfBirth, gender, address } = req.body;

    if (role !== "PATIENT") {
      return res.status(403).json({ message: "Only patients can update profile" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        bloodGroup: bloodGroup,
        allergies: allergies,
        emergencyContact: emergencyContact,
        emergencyPhone: emergencyPhone,
        dateOfBirth: dateOfBirth,
        gender: gender,
        address: address,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        healthUid: updated.healthUid,
        bloodGroup: updated.bloodGroup,
        allergies: updated.allergies,
        emergencyContact: updated.emergencyContact,
        emergencyPhone: updated.emergencyPhone,
        dateOfBirth: updated.dateOfBirth,
        gender: updated.gender,
        address: updated.address,
      },
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;

