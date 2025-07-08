const { Client } = require("pg");

const connection = new Client({
  host: process.env.DB_HOST,
  user: "postgres",
  password: "300804",
  port: 5432,
  database: "DOPDOPDOP",
});

connection.connect().then(() => console.log("Connected"));

module.exports = connection;