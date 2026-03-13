import { Router } from 'express';
import {
  getAllBars,
  getBarById,
  createBar,
  updateBar,
  deleteBar
} from '../controllers/barController';

const router = Router();

// GET /api/bars - Get all bars
router.get('/', getAllBars);

// GET /api/bars/:id - Get bar by ID
router.get('/:id', getBarById);

// POST /api/bars - Create new bar
router.post('/', createBar);

// PUT /api/bars/:id - Update bar
router.put('/:id', updateBar);

// DELETE /api/bars/:id - Delete bar
router.delete('/:id', deleteBar);

export default router;
