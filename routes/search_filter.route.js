const express = require('express');
const router = express.Router();
const FilterController = require('../controllers/search_filter.controller');

// Route để render trang với tất cả sản phẩm hoặc tìm kiếm
router.get('/search', FilterController.renderMovies);
router.get('/search/result', FilterController.getMovies);

module.exports = router;
