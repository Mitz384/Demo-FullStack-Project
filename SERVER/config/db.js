const { Client } = require("pg");

const connection = new Client({
  host: process.env.DB_HOST,
  user: "postgres",
  password: "300804",
  port: 5432,
  database: "DOPDOPDOP",
});

connection._connected = false;

connection.connectDB = async () => {
  if (!connection._connected) {
    try {
      await connection.connect();
      connection._connected = true;
      console.log(`Connected to PostgreSQL database: ${connection.database}`);
    } catch (err) {
      console.error(`Error connecting to PostgreSQL: ${err.message}`);
      throw err;
    }
  }
};

connection.disconnectDB = async () => {
  if (connection._connected) {
    try {
      await connection.end();
      connection._connected = false;
      console.log("Disconnected from PostgreSQL");
    } catch (err) {
      console.error(`Error disconnecting from PostgreSQL: ${err.message}`);
    }
  }
};

module.exports = connection;
