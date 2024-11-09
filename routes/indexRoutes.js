const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// Define a simple route
router.get("/", indexController.getIndexPage);

// Export the router
module.exports = router;
