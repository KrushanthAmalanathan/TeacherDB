import express from 'express';
import { signup, signin } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);  // User signup
router.post('/signin', signin);  // User/Admin/Super Admin signin

export default router;
