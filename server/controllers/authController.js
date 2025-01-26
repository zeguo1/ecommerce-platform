import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import bcrypt from 'bcryptjs';

// @desc    注册新用户
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 必填字段验证
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('请填写所有必填字段');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409).json({
      success: false,
      errorCode: 'EMAIL_EXISTS',
      message: '该邮箱已被注册'
    });
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 创建用户并明确返回字段
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: false  // 明确设置管理员状态
  });

  // 更完整的响应数据
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    token: generateToken(user._id)
  };

  res.status(201).json({
    success: true,
    data: userData
  });
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    用户注销
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // 清除客户端token
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: '成功注销' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// 新增微信登录控制器
const wechatLogin = asyncHandler(async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    res.status(400).json({
      success: false,
      errorCode: "WECHAT_CODE_REQUIRED",
      message: "微信授权码不能为空"
    });
    return;
  }

  try {
    // 调用微信API获取openid
    const wechatResponse = await axios.get(`https://api.weixin.qq.com/sns/jscode2session`, {
      params: {
        appid: process.env.WECHAT_APP_ID,
        secret: process.env.WECHAT_APP_SECRET,
        js_code: code,
        grant_type: "authorization_code"
      }
    });

    const { openid, unionid } = wechatResponse.data;
    
    // 查找或创建用户
    let user = await User.findOne({ wechatOpenId: openid });
    
    if (!user) {
      user = await User.create({
        wechatOpenId: openid,
        wechatUnionId: unionid,
        isAdmin: false
      });
    }

    // 生成并返回token
    const userData = {
      _id: user._id,
      wechatOpenId: user.wechatOpenId,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      token: generateToken(user._id)
    };

    res.status(200).json({
      success: true,
      data: userData
    });

  } catch (error) {
    if (error.response) {
      res.status(401).json({
        success: false,
        errorCode: "WECHAT_AUTH_FAILED",
        message: "微信登录失败: " + error.response.data.errmsg
      });
    } else {
      res.status(500).json({
        success: false,
        errorCode: "SERVER_ERROR",
        message: "服务器内部错误"
      });
    }
  }
});

export {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  wechatLogin
};
