const express = require("express");
const app = express();
const path = require("path");
const dbConnection = require('./dbs/init.postgresql');
const userRoutes = require('./routes/register.route');
require("dotenv").config();

const PORT = process.env.PORT || 3000;
// Middleware
app.use(express.json());

// init DB
dbConnection;
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
