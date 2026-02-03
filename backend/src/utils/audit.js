import prisma from "../prismaClient.js";

export async function auditLog({
  actorRole,
  actorId,
  action,
  targetId = null,
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorRole,
        actorId,
        action,
        targetId,
      },
    });
  } catch (err) {
    console.error("AUDIT LOG ERROR:", err);
  }
}