import express from 'express';
import { getPersonalProfile } from '../controllers/personalController';

const router = express.Router();

router.get('/', getPersonalProfile);

export default router;
