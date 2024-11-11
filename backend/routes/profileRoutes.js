// routes/profileRoutes.js
import express from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/profileController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getProfile);           // Get user profile
router.put('/', updateProfile);        // Create or update profile
router.delete('/', deleteProfile);     // Delete profile

export default router;
