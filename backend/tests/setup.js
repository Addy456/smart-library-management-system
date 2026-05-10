/**
 * Jest test setup — boots an in-memory MongoDB instance before the test
 * suite runs and tears it down when all suites finish. Keeps each test
 * run hermetic (no shared state with dev/prod DBs).
 */
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

// Env values the app asserts at boot. Must be set BEFORE requiring app.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET_KEY = "test-secret-key-for-jest-only-do-not-use-in-prod";
process.env.JWT_EXPIRE = "1d";
process.env.COOKIE_EXPIRE = "1";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.PORT = "0";
// Cloudinary + email creds aren't needed for tests but the boot validator
// may look for them. Dummy values prevent spurious failures.
process.env.CLOUDINARY_CLOUD_NAME = "test";
process.env.CLOUDINARY_API_KEY = "test";
process.env.CLOUDINARY_API_SECRET = "test";
process.env.RESEND_API_KEY = "test";
process.env.LOG_LEVEL = "silent";

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Clear every collection between tests so state doesn't leak between them.
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
});
