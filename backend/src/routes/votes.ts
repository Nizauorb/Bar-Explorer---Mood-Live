import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createVote } from '../controllers/voteController.js';

const router = Router();

// POST /api/votes - Create new vote (protected)
router.post('/', authenticateToken, createVote);

export default router;
