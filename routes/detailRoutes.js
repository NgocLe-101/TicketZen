const express = require("express");
const router = express.Router();
const detailController = require("../controllers/detailController");

router.get("/movies/:id", detailController.getDetailPage);

module.exports = router;
