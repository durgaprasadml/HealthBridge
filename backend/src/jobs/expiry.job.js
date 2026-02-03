import cron from "node-cron";
import prisma from "../prismaClient.js";

/**
 * Runs every 5 minutes
 * Expires:
 *  - AccessRequest
 *  - EmergencyAccess
 */
export function startExpiryJob() {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();

    try {
      // Expire normal access
      await prisma.accessRequest.updateMany({
        where: {
          status: "APPROVED",
          expiresAt: { lt: now },
        },
        data: { status: "EXPIRED" },
      });

      // Expire emergency access
      await prisma.emergencyAccess.updateMany({
        where: {
          status: "ACTIVE",
          expiresAt: { lt: now },
        },
        data: { status: "EXPIRED" },
      });

      console.log("⏱️ Access expiry job executed");
    } catch (err) {
      console.error("EXPIRY JOB ERROR:", err);
    }
  });
}