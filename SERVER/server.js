require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const authUserRouter = require('./Routers/User/auth_user')

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json());
app.use("/users", authUserRouter);

app.get("/", (req, res) => {
  const date = new Date();
  res.send("API ne");
});

app.listen(8080, () => {
  console.log("Listening at http://localhost:8080");
});
