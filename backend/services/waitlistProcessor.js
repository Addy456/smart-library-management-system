const cron = require("node-cron");
const Waitlist = require("../models/waitlistModel");
const sendEmail = require("../utils/sendEmail");
const logger = require("../utils/logger");
const { escapeHtml } = require("../utils/helpers");
const { WAITLIST_CLAIM_WINDOW_HOURS } = require("../config/constants");

const CLAIM_WINDOW_MS = WAITLIST_CLAIM_WINDOW_HOURS * 60 * 60 * 1000;

// Hourly cron (0 * * * *): expires unclaimed notified slots and advances the queue.
const startWaitlistProcessor = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const expired = await Waitlist.find({
        status: "notified",
        expiresAt: { $lt: new Date() },
      }).populate("book", "title");

      for (const entry of expired) {
        entry.status = "expired";
        await entry.save();

        await Waitlist.updateMany(
          {
            book: entry.book._id,
            status: "waiting",
            position: { $gt: entry.position },
          },
          { $inc: { position: -1 } }
        );

        const next = await Waitlist.findOne({
          book: entry.book._id,
          status: "waiting",
          position: 1,
        })
          .populate("user", "name email")
          .populate("book", "title");

        if (next) {
          next.status = "notified";
          next.expiresAt = new Date(Date.now() + CLAIM_WINDOW_MS);
          await next.save();

          sendEmail({
            email: next.user.email,
            subject: `"${next.book.title}" is now available for you — Smart Library`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4f46e5;">Your Turn to Claim!</h2>
                <p>Hi <strong>${escapeHtml(next.user.name)}</strong>,</p>
                <p>The previous person in the waitlist for <strong>"${escapeHtml(next.book.title)}"</strong> did not claim it in time.</p>
                <p>You are now <strong>first in line</strong> — you have <strong>${WAITLIST_CLAIM_WINDOW_HOURS} hours</strong> to log in and borrow it.</p>
                <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">Smart Library Management System</p>
              </div>
            `,
          }).catch((emailErr) =>
            logger.error({ err: emailErr.message }, "Waitlist advance email failed")
          );
        }
      }

      if (expired.length > 0) {
        logger.info({ count: expired.length }, "Waitlist processor expired slots");
      }
    } catch (err) {
      logger.error({ err: err.message }, "Waitlist processor error");
    }
  });

  logger.info("Waitlist processor cron started (runs every hour)");
};

module.exports = startWaitlistProcessor;
