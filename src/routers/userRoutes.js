import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.patch('/users/me/avatar', authenticate);

export default router;
