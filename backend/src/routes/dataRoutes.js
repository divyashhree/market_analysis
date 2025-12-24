const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// GET /api/data/all - Get all data
router.get('/all', dataController.getAllData);

// GET /api/data/cpi - Get CPI data
router.get('/cpi', dataController.getCPIData);

// GET /api/data/usdinr - Get USD-INR data
router.get('/usdinr', dataController.getUSDINRData);

// GET /api/data/nifty - Get NIFTY 50 data
router.get('/nifty', dataController.getNiftyData);

// GET /api/data/range - Get data by date range
router.get('/range', dataController.getDataByRange);

module.exports = router;
