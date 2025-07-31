import express from 'express';
import { initializeCalculations, addDailyRecord, getDailyRecords, updateDailyRecord, getHubRecordsByDate } from '../controllers/calculationController.js';

const router = express.Router();

// Initialize all hub-product combinations
router.post('/initialize', initializeCalculations);

// Add daily stock input
router.post('/add', addDailyRecord);

// Get daily records for a hub-product
router.get('/:hubId/:productId', getDailyRecords);

router.put('/update', updateDailyRecord);

router.get('/hub/:hubId/:date', getHubRecordsByDate);

export default router;
