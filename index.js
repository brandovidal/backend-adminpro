require("dotenv").config();
const path = require("path");

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

// Directorio publico
app.use(express.static("public"));

// Routes
app.use("/api/search", require("./routes/search"));
app.use("/api/users", require("./routes/users"));
app.use("/api/hospitals", require("./routes/hospitals"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));

// Index
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Server node " + process.env.PORT);
});
