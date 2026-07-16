import { Router } from 'express';
import analyzeController from '../controllers/analyzeController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

// POST /api/analyze  { username, refresh? }
router.post('/analyze', asyncHandler(analyzeController.analyze));

export default router;
