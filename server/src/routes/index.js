import { Router } from 'express';
import analyzeRoutes from './analyzeRoutes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'devdna-api' }));
router.use('/', analyzeRoutes);

export default router;
