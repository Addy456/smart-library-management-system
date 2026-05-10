/**
 * Auth endpoint behaviour. These tests assert the security properties
 * the audit flagged as critical: no token in response body, generic
 * messages that resist enumeration, and type validation against NoSQL
 * operator injection.
 */
const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");
const { createUser, DEFAULT_PASSWORD } = require("./factories");

describe("POST /api/auth/register", () => {
  test("rejects non-string email (NoSQL injection attempt)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "X", email: { $gt: "" }, password: "Password123!" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("rejects short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Alice", email: "a@b.com", password: "short" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least/i);
  });

  test("returns identical 201 shape whether email is new or taken (anti-enumeration)", async () => {
    const first = await request(app)
      .post("/api/auth/register")
      .send({ name: "Alice", email: "alice@test.com", password: "Password123!" });
    const second = await request(app)
      .post("/api/auth/register")
      .send({ name: "Alice2", email: "alice@test.com", password: "Password123!" });
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    // Shape must match — attacker can't distinguish new vs duplicate.
    expect(Object.keys(first.body).sort()).toEqual(Object.keys(second.body).sort());
  });
});

describe("POST /api/auth/login", () => {
  test("never returns JWT in response body", async () => {
    const { user } = await createUser({ email: "login1@test.com" });
    expect(user.verified).toBe(true);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login1@test.com", password: DEFAULT_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toMatch(/eyJ/); // JWT prefix
  });

  test("sets httpOnly token cookie on success", async () => {
    await createUser({ email: "login2@test.com" });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login2@test.com", password: DEFAULT_PASSWORD });
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    const tokenCookie = cookies.find((c) => c.startsWith("token="));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie.toLowerCase()).toContain("httponly");
  });

  test("returns identical 401 body for wrong email vs wrong password", async () => {
    await createUser({ email: "login3@test.com" });
    const wrongEmail = await request(app)
      .post("/api/auth/login")
      .send({ email: "nope@test.com", password: "anything" });
    const wrongPassword = await request(app)
      .post("/api/auth/login")
      .send({ email: "login3@test.com", password: "anything" });
    expect(wrongEmail.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(wrongEmail.body.message).toBe(wrongPassword.body.message);
  });

  test("locks account after 5 consecutive failed attempts", async () => {
    await createUser({ email: "lock@test.com" });
    for (let i = 0; i < 5; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await request(app)
        .post("/api/auth/login")
        .send({ email: "lock@test.com", password: "wrong" });
    }
    const locked = await request(app)
      .post("/api/auth/login")
      .send({ email: "lock@test.com", password: DEFAULT_PASSWORD });
    expect(locked.status).toBe(423);
  });

  test("rejects operator-object payload", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: { $ne: null }, password: { $ne: null } });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/auth/logout", () => {
  test("is reachable without a valid token", async () => {
    const res = await request(app).get("/api/auth/logout");
    expect(res.status).toBe(200);
    const cookies = res.headers["set-cookie"] || [];
    const tokenCookie = cookies.find((c) => c.startsWith("token="));
    expect(tokenCookie).toMatch(/token=;/);
  });
});

describe("POST /api/auth/forgot-password", () => {
  test("returns generic 200 whether the email exists or not", async () => {
    await createUser({ email: "fp@test.com" });
    const existing = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "fp@test.com" });
    const missing = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nobody@test.com" });
    expect(existing.status).toBe(200);
    expect(missing.status).toBe(200);
    expect(existing.body.message).toBe(missing.body.message);
  });
});
