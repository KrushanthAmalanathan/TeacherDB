// routes/postalCodeRoutes.js
import express from 'express';
import { lookupPostalCode } from '../controllers/postalCodeController.js';

const router = express.Router();

router.get('/:code', lookupPostalCode);

export default router;
