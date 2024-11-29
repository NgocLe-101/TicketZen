require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const passport = require("passport");
const knex = require("./dbs/db");
const { Pool } = require("pg");

const filterRoutes = require("./routes/search_filter.route");
const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const productRoutes = require("./routes/productRoutes");
const detailRoutes = require("./routes/detailRoutes");

console.log("Server is starting...");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Session middleware
app.use(
    session({
        store: new PgSession({
            pool: pool,
            tableName: "users_session",
        }),
        secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: process.env.NODE_ENV === "production", // Ensure cookies are only used over HTTPS
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        },
    })
);

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
