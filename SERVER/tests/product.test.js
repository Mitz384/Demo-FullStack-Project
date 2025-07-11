const request = require("supertest");
const app = require("../app");
const db = require("../config/db");

describe("GET /api/products/get-all-products", () => {
  beforeAll(async () => {
    await db.connectDB();
  });
  afterAll(async () => {
    await db.disconnectDB();
  });

  it("should return status 200 and an array of products", async () => {
    const res = await request(app).get("/api/products/get-all-products");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("description");
    expect(res.body[0]).toHaveProperty("price");
    expect(res.body[0]).toHaveProperty("image");
  });
});
