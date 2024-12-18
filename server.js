import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path"; // Ensure this line is added

// // Get the current file's path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // Ensure this is imported and used

import session from "express-session";
import cookieParser from "cookie-parser";
import connectPgSimple from "connect-pg-simple"; // Import connect-pg-simple correctly
const PgSession = connectPgSimple(session); // Initialize it by passing `session`

import passport from "passport";
import pkg from "pg"; // Import the whole package as `pkg`
const { Pool } = pkg; // Destructure Pool from `pkg`
import indexRouter from "./components/index/index.router.js";
import authRouter from "./components/auth/auth.router.js";
import productRouter from "./components/product/product.router.js";
import searchRouter from "./components/search/search.router.js";
import profileRouter from "./components/user/user.router.js";
import cartRouter from "./components/cart/cart.router.js";
import orderRoute from "./components/order/order.route.js";
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const sslConfig =
  process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: sslConfig, // Only use SSL in production, in development, disable SSL for potential connection issues
});

// Session middleware
app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "users_session",
      errorLog: (err) => {
        console.log(err);
      },
    }),
    secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: false, // Have to set this to false as a fix. The cookie still doesn't work in production
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
import passportConfig from "./configs/passport.js";
passportConfig(passport); // Use the imported passport configuration

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/auth", authRouter);
app.use("/movies", productRouter);
app.use("/search", searchRouter);
app.use("/profile", profileRouter);
app.use("/cart", cartRouter);
app.use("/", indexRouter);
app.use("/orders", orderRoute);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.render("404");
});
/*
It is recommended to keep export default app; and running "vercel dev" in the terminal to test the application locally.
If you want to use node or nodemon, comment out this line and uncomment the app.listen() method below.
But remember to keep the export default app; line uncommented before pushing the code to the remote repository.
*/
export default app;

/* 
Using the app.listen() method only when developing the application locally (with node or nodemon).
*/
// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
