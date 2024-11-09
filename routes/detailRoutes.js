const express = require("express");
const router = express.Router();
const detailController = require("../controllers/detailController");

router.get("/detail/:id", detailController.getDetailPage);

module.exports = router;
