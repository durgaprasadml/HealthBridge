import prisma from "../prismaClient.js";

export async function verifyDoctorAccess(req, res, next) {
  try {
    const { doctorUid } = req.user;
    const { patientUid } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { doctorUid },
    });

    const patient = await prisma.user.findUnique({
      where: { healthUid: patientUid },
    });

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or patient not found" });
    }

    const access = await prisma.accessRequest.findFirst({
      where: {
        doctorId: doctor.id,
        patientId: patient.id,
        status: "APPROVED",
        expiresAt: { gt: new Date() },
      },
    });

    if (!access) {
      return res.status(403).json({ message: "Access expired or not approved" });
    }

    next();
  } catch (error) {
    console.error("ACCESS CHECK ERROR:", error);
    res.status(500).json({ message: "Access verification failed" });
  }
}