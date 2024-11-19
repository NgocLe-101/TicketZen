require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
require("./dbs/init.postgresql");

const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const productRoutes = require("./routes/productRoutes");
const detailRoutes = require("./routes/detailRoutes");
const filterRoutes = require("./routes/filter.route");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
// route



app.use(authRoutes);
app.use(indexRoutes);
app.use(productRoutes);
app.use(detailRoutes);
app.use("", filterRoutes);



app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.render("404");
});


const PORT = 3000
const server = app.listen(PORT, ()=>{
  console.log(`localhost:${PORT}`)
})

// module.exports = app;
