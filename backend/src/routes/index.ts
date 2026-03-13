import { Router } from 'express';
import barsRouter from './bars';
import usersRouter from './users';
import authRouter from './auth';
import votesRouter from './votes';

const router = Router();

// API routes
router.use('/auth', authRouter);
router.use('/bars', barsRouter);
router.use('/users', usersRouter);
router.use('/votes', votesRouter);

export default router;
