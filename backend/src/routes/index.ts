import { Router } from 'express';
import barsRouter from './bars';
import usersRouter from './users';

const router = Router();

// API routes
router.use('/bars', barsRouter);
router.use('/users', usersRouter);

export default router;
