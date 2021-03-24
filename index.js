require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

// Server Express
const app = express();

// CORS
app.use(cors());

// Read and Parse Body
app.use(express.json());

// Database
dbConnection();

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

app.listen(process.env.PORT, () => {
  console.log("Server node " + process.env.PORT);
});
