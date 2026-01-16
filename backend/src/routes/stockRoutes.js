const express = require('express');
const { getStockData, searchStocks } = require('../controllers/dataController');

const router = express.Router();

// Route to get detailed data for a specific stock
router.get('/:symbol', getStockData);

// Route to search for stocks
router.get('/search/:query', searchStocks);

module.exports = router;
