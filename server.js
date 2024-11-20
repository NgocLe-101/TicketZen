require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
// require("./dbs/init.postgresql");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const filterRoutes = require("./routes/search_filter.route");
const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const productRoutes = require("./routes/productRoutes");
const detailRoutes = require("./routes/detailRoutes");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

app.use(flash());
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./configs/passport")(passport);

app.set("view engine", "ejs");
// init DB
app.set("views", path.join(__dirname, "views"));
app.use(authRoutes);
app.use(indexRoutes);
app.use(productRoutes);
app.use(detailRoutes);
app.use(filterRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.render("404");
});

module.exports = app;
