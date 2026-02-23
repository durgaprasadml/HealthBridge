import prisma from "../prismaClient.js";

export async function expireAccessJob() {
  const now = new Date();

  // ⛔ Expire NORMAL access
  await prisma.accessRequest.updateMany({
    where: {
      status: "APPROVED",
      expiresAt: { lt: now },
    },
    data: {
      status: "EXPIRED",
    },
  });

  // 🚨 Expire EMERGENCY access
  await prisma.emergencyAccess.updateMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: now },
    },
    data: {
      status: "EXPIRED",
    },
  });

  console.log("✔ Access expiry job executed");
}