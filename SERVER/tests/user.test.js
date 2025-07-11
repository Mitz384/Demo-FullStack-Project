const request = require("supertest");
const app = require("../app");
const db = require("../config/db");
const passport = require("passport");

describe("POST /api/user/login", () => {
  const testLoginUser = [
    // Correct user [0]
    {
      email: "nguyenanh123@gmail.com",
      password: "nguyenanh123",
    },
    // Account loged by Google [1]
    {
      email: "dnson384@gmail.com",
      password: "dnson384",
    },
    // Incorrect Password [2]
    {
      email: "doannhuson2004@gmail.com",
      password: "doannhuson234",
    },
    // Blank Input [3]
    {
      email: "",
      password: "",
    },
  ];

  beforeAll(async () => await db.connectDB());
  afterAll(async () => await db.disconnectDB());

  describe("Email/Password", () => {
    it("login successful -> access /me", async () => {
      const testUser = testLoginUser[0];
      const resLogin = await request(app).post("/api/users/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(resLogin.statusCode).toBe(200);
      expect(resLogin.body).toHaveProperty("token");

      const loginToken = resLogin.body.token;

      const resMe = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${loginToken}`);

      expect(resMe.statusCode).toBe(200);
      expect(resMe.body.user.email).toBe(testUser.email);
    });

    it("incorrect password -> re-enter password", async () => {
      const testUser = testLoginUser[2];
      const resLogin = await request(app).post("/api/users/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(resLogin.statusCode).toBe(401);
      expect(resLogin.body).toHaveProperty(
        "message",
        "Email or Password incorrect"
      );
    });

    it("blank input -> re-enter input", async () => {
      const testUser = testLoginUser[3];
      const resLogin = await request(app).post("/api/users/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(resLogin.statusCode).toBe(400);
      expect(resLogin.body).toHaveProperty(
        "message",
        "Email and password can not be blank"
      );
    });
  });

  describe("Google", () => {
    it("logged with Google -> login again with Google", async () => {
      const testUser = testLoginUser[1];
      const resLogin = await request(app).post("/api/users/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(resLogin.statusCode).toBe(401);
      expect(resLogin.body).toHaveProperty(
        "message",
        "This account is logged by Google, please login with Google"
      );
    });
  });
});
