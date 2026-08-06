import express from 'express';
import { getPersonalProfile, updatePersonalProfile } from '../controllers/personalController';

const router = express.Router();

router.get('/', getPersonalProfile);
router.put('/', updatePersonalProfile);

export default router;
