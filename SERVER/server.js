const app = require("./app");
const connection = require("./config/db");

connection
  .connectDB()
  .then(() => {
    app.listen(8080, () => {
      console.log("Listening at http://localhost:8080");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database, server not starting:", err);
    process.exit(1);
  });
