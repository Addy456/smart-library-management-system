/**
 * Borrow lifecycle tests. The critical assertion here is the IDOR fix
 * on returnBook — a member must NOT be able to return someone else's
 * borrow record. Other tests cover the approve/reject race and the
 * overdue query's $exists guard.
 */
const request = require("supertest");
const app = require("../app");
const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const { createUser, createAdmin, createBook, createBorrow, authCookie } =
  require("./factories");

describe("PUT /api/borrow/return/:id — IDOR protection", () => {
  test("member cannot return another member's borrow record", async () => {
    const { user: owner } = await createUser();
    const { user: attacker } = await createUser();
    const book = await createBook({ availableCopies: 2, totalCopies: 3 });
    const borrow = await createBorrow(owner, book, {
      status: "borrowed",
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const res = await request(app)
      .put(`/api/borrow/return/${borrow._id}`)
      .set("Cookie", authCookie(attacker))
      .set("Origin", process.env.FRONTEND_URL);

    expect(res.status).toBe(403);
    const fresh = await Borrow.findById(borrow._id);
    expect(fresh.status).toBe("borrowed"); // Untouched
  });

  test("owner can return their own record", async () => {
    const { user: owner } = await createUser();
    const book = await createBook({ availableCopies: 2, totalCopies: 3 });
    const borrow = await createBorrow(owner, book, {
      status: "borrowed",
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const res = await request(app)
      .put(`/api/borrow/return/${borrow._id}`)
      .set("Cookie", authCookie(owner))
      .set("Origin", process.env.FRONTEND_URL);

    expect(res.status).toBe(200);
    const fresh = await Borrow.findById(borrow._id);
    expect(fresh.status).toBe("returned");
    const freshBook = await Book.findById(book._id);
    expect(freshBook.availableCopies).toBe(3); // incremented
  });

  test("admin can return any record", async () => {
    const { user: owner } = await createUser();
    const { user: admin } = await createAdmin();
    const book = await createBook({ availableCopies: 2, totalCopies: 3 });
    const borrow = await createBorrow(owner, book, {
      status: "borrowed",
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const res = await request(app)
      .put(`/api/borrow/return/${borrow._id}`)
      .set("Cookie", authCookie(admin))
      .set("Origin", process.env.FRONTEND_URL);
    expect(res.status).toBe(200);
  });

  test("cannot return a record that is already returned", async () => {
    const { user: owner } = await createUser();
    const book = await createBook();
    const borrow = await createBorrow(owner, book, { status: "returned" });
    const res = await request(app)
      .put(`/api/borrow/return/${borrow._id}`)
      .set("Cookie", authCookie(owner))
      .set("Origin", process.env.FRONTEND_URL);
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/borrow/approve/:id", () => {
  test("concurrent approvals don't double-decrement availableCopies", async () => {
    const { user: member } = await createUser();
    const { user: admin } = await createAdmin();
    const book = await createBook({ availableCopies: 1, totalCopies: 1 });
    const borrow = await createBorrow(member, book, { status: "pending" });

    const cookie = authCookie(admin);
    const origin = process.env.FRONTEND_URL;

    const [a, b] = await Promise.all([
      request(app)
        .put(`/api/borrow/approve/${borrow._id}`)
        .set("Cookie", cookie)
        .set("Origin", origin),
      request(app)
        .put(`/api/borrow/approve/${borrow._id}`)
        .set("Cookie", cookie)
        .set("Origin", origin),
    ]);

    // Exactly one succeeds; the second sees it's already processed.
    const successes = [a, b].filter((r) => r.status === 200);
    expect(successes).toHaveLength(1);

    const fresh = await Book.findById(book._id);
    expect(fresh.availableCopies).toBe(0);
  });
});

describe("GET /api/borrow/overdue", () => {
  test("does not include pending records (returnDate null)", async () => {
    const { user: member } = await createUser();
    const { user: admin } = await createAdmin();
    const book = await createBook();
    // Pending record — no returnDate set yet.
    await createBorrow(member, book, { status: "pending" });
    // Actually overdue record.
    const overdueUser = await createUser();
    await createBorrow(overdueUser.user, book, {
      status: "borrowed",
      returnDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    const res = await request(app)
      .get("/api/borrow/overdue")
      .set("Cookie", authCookie(admin))
      .set("Origin", process.env.FRONTEND_URL);

    expect(res.status).toBe(200);
    expect(res.body.records).toHaveLength(1);
    expect(res.body.records[0].status).toBe("borrowed");
  });
});
