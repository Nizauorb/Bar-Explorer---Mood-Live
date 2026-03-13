import { Router } from 'express';
import barsRouter from './bars';
import usersRouter from './users';
import authRouter from './auth';

const router = Router();

// API routes
router.use('/auth', authRouter);
router.use('/bars', barsRouter);
router.use('/users', usersRouter);

export default router;
