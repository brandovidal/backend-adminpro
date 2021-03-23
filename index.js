require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// Server Express
const app = express();

// CORS
app.use(cors());

// Database
dbConnection();

// Routes
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    msg: "Server node",
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server node " + process.env.PORT);
});
