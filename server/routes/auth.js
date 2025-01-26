import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  logoutUser,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// 用户注册路由
router.route('/register')
  .post(registerUser);

// 用户登录路由  
router.route('/login')
  .post(authUser);

// 用户注销路由
router.post('/logout', logoutUser);

router.route('/')
  .get(protect, admin, getUsers);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
