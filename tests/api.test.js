const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

process.env.JWT_SECRET = "test_secret_that_is_at_least_32_characters_long";
process.env.NODE_ENV = "test";
const app = require("../src/app");

test("GET / returns API status", async () => {
  const response = await request(app).get("/");
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.message, "NoteNest API is running");
});

test("unknown routes return JSON 404", async () => {
  const response = await request(app).get("/not-a-route");
  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});

test("notes routes reject missing authentication", async () => {
  const response = await request(app).get("/api/notes");
  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
});

test("notes routes reject invalid JWTs", async () => {
  const response = await request(app).get("/api/notes").set("Authorization", "Bearer invalid-token");
  assert.equal(response.status, 401);
});
