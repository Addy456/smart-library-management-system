const cron = require("node-cron");
const Borrow = require("../models/borrowModel");
const sendEmail = require("../utils/sendEmail");
const { overdueReminderTemplate } = require("../utils/emailTemplates");
const calculateFine = require("../utils/fineCalculator");
const logger = require("../utils/logger");

// Cron job: runs every day at 9:00 AM
// Finds all overdue borrow records and sends reminder emails.
const notifyUsers = () => {
  cron.schedule("0 9 * * *", async () => {
    logger.info("Running overdue notification job");

    try {
      const today = new Date();

      const overdueRecords = await Borrow.find({
        status: "borrowed",
        returnDate: { $exists: true, $ne: null, $lte: today },
      })
        .populate("user", "name email")
        .populate("book", "title");

      logger.info({ count: overdueRecords.length }, "Overdue records found");

      for (const record of overdueRecords) {
        // Defensive: if a user or book was deleted, skip this record so
        // the whole cron doesn't bail out on a single bad row.
        if (!record.user || !record.book) continue;

        try {
          const fine = calculateFine(record.returnDate, today);

          await sendEmail({
            email: record.user.email,
            subject: "Overdue Book Reminder - Smart Library",
            html: overdueReminderTemplate(
              record.user.name,
              record.book.title,
              record.returnDate,
              fine
            ),
          });

          logger.info({ email: record.user.email }, "Overdue reminder sent");
        } catch (emailError) {
          logger.error(
            { err: emailError.message, email: record.user.email },
            "Overdue reminder failed"
          );
        }
      }

      logger.info("Overdue notification job completed");
    } catch (error) {
      logger.error({ err: error.message }, "Overdue notification job error");
    }
  });
};

module.exports = notifyUsers;
