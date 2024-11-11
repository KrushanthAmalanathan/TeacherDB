// userRoutes.js

import express from 'express';
import { getAllUsers, createUser, deleteUser, editUser, getCurrentUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { restrictTo } from '../middlewares/roleMiddleware.js';
// Removed the duplicate import of getAllUsers

const router = express.Router();

router.get('/me', protect, getCurrentUser);

// Super Admin and Admin can get all users
router.get('/', protect, restrictTo('super-admin', 'admin'), getAllUsers);

// Super Admin can create admins and users
router.post('/create', protect, restrictTo('super-admin', 'admin'), createUser);

// Admin and Super Admin can delete or edit users
router.delete('/:userId', protect, restrictTo('admin', 'super-admin'), deleteUser);
router.patch('/:userId', protect, restrictTo('admin', 'super-admin'), editUser);

export default router;
