const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { createUserWithGoogle } = require("../services/userService");

if (process.env.NODE_ENV !== "test") {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/users/auth/google/callback",
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

        createUserWithGoogle({ firstName, lastName, email, done }).catch(
          (err) => {
            console.error("Error creating user with Google:", err);
            return done(err, null);
          }
        );
      }
    )
  );
}
