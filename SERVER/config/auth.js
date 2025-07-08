const passport = require("passport");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const connection = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/users/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const firstName = profile.name.givenName || "";
      const lastName = profile.name.familyName || "";
      const email =
        profile.emails && profile.emails.length > 0
          ? profile.emails[0].value
          : null;

      if (!email) {
        return done(
          new Error("Cannot sign in to Google: No email provided"),
          null
        );
      }

      // Nếu đã tồn tại email nhưng không tồn tại password thì đăng nhập luôn bằng google
      try {
        const existedEmail = await connection.query(
          `SELECT id, password FROM users WHERE email = $1`,
          [email]
        );

        if (existedEmail.rows.length > 0) {
          const existedUser = existedEmail.rows[0];
          if (existedUser.password) {
            return done(
              new Error(
                "This mail has already been registered with email/password. Please log in using that method"
              ),
              null
            );
          }
          const payload = {
            id: existedUser.id,
            email: existedUser.email,
          };

          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });

          request.token = token;
          return done(null, existedUser);
        }
      } catch (err) {
        console.error(err);
        return done(err, null);
      }

      // ---------------------------------------------------------------------------------

      // Tạo người dùng mới khi chưa tồn tại trong hệ thống
      let newUser;
      try {
        newUser = await connection.query(
          `INSERT INTO users(first_name, last_name, email) VALUES ($1, $2, $3) RETURNING id, first_name, last_name, email`,
          [firstName, lastName, email]
        );
      } catch (err) {
        console.error(err);
        return done(err, null);
      }

      if (newUser.rows.length === 0) {
        return done(new Error(`Cannot push user to database`), null);
      }
      const user = newUser.rows[0];

      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      request.token = token;
      return done(null, user);
    }
  )
);
