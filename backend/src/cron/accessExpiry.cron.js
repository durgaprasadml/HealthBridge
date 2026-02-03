import prisma from "../prismaClient.js";

export async function expireAccesses() {
  const now = new Date();

  // Normal access
  await prisma.accessRequest.updateMany({
    where: {
      status: "APPROVED",
      expiresAt: { lt: now },
    },
    data: { status: "EXPIRED" },
  });

  // Emergency access
  await prisma.emergencyAccess.updateMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: now },
    },
    data: { status: "EXPIRED" },
  });

  console.log("✅ Access expiry cron executed");
}