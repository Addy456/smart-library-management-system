const cron = require("node-cron");
const User = require("../models/userModel");
const logger = require("../utils/logger");

// Cron job: runs every day at midnight (00:00).
// Deletes unverified accounts older than 24 hours so stale registrations
// don't accumulate and don't block the unique email index.
const removeUnverifiedAccounts = () => {
  cron.schedule("0 0 * * *", async () => {
    logger.info("Running unverified accounts cleanup job");

    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await User.deleteMany({
        verified: false,
        createdAt: { $lt: twentyFourHoursAgo },
      });

      logger.info({ deleted: result.deletedCount }, "Unverified accounts cleanup completed");
    } catch (error) {
      logger.error({ err: error.message }, "Unverified accounts cleanup error");
    }
  });
};

module.exports = removeUnverifiedAccounts;
