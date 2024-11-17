require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const dbConnection = require("./dbs/init.postgresql");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const productRoutes = require("./routes/productRoutes");
const detailRoutes = require("./routes/detailRoutes");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./config/passport")(passport);

app.set("view engine", "ejs");
// init DB
dbConnection;
app.set("views", path.join(__dirname, "views"));
app.use(authRoutes);
app.use(indexRoutes);
app.use(productRoutes);
app.use(detailRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.render("404");
});

module.exports = app;
