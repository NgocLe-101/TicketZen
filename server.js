require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const dbConnection = require("./dbs/init.postgresql");

const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const productRoutes = require("./routes/productRoutes");
const detailRoutes = require("./routes/detailRoutes");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
// init DB
dbConnection;
app.set("views", path.join(__dirname, "views"));
app.use(authRoutes);
app.use(indexRoutes);
app.use(productRoutes);
app.use(detailRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

module.exports = app;
