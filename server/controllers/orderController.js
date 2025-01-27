import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import axios from 'axios';
import config from '../config/config.json' assert { type: 'json' };
import xml2js from 'xml2js';

// 微信支付配置
const WECHAT_PAY_CONFIG = {
  appId: config.wechatAppId,
  mchId: config.wechatMchId,
  apiKey: config.wechatApiKey,
  notifyUrl: `${config.baseUrl}/api/orders/wechat/callback`,
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user.id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: ['User'],
  });

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(orders);
});

// @desc    Generate WeChat payment parameters
// @route   POST /api/orders/:id/wechat/pay
// @access  Private
const generateWechatPayParams = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // 生成随机字符串
  const nonceStr = crypto.randomBytes(16).toString('hex');

  // 生成时间戳
  const timeStamp = Math.floor(Date.now() / 1000).toString();

  // 统一下单
  const unifiedOrderParams = {
    appid: WECHAT_PAY_CONFIG.appId,
    mch_id: WECHAT_PAY_CONFIG.mchId,
    nonce_str: nonceStr,
    body: `订单支付 - ${order.id}`,
    out_trade_no: order.id,
    total_fee: Math.round(order.totalPrice * 100),
    spbill_create_ip: req.ip,
    notify_url: WECHAT_PAY_CONFIG.notifyUrl,
    trade_type: 'JSAPI',
    openid: req.user.wechatOpenId,
  };

  // 生成签名
  const sign = generateWechatSign(unifiedOrderParams);
  unifiedOrderParams.sign = sign;

  // 调用微信统一下单接口
  const response = await axios.post(
    'https://api.mch.weixin.qq.com/pay/unifiedorder',
    unifiedOrderParams,
    {
      headers: {
        'Content-Type': 'application/xml',
      },
      transformRequest: [(data) => buildXML(data)],
    }
  );

  // 解析返回结果
  const result = await parseXML(response.data);

  if (result.return_code !== 'SUCCESS') {
    res.status(400);
    throw new Error(result.return_msg || '微信支付下单失败');
  }

  // 返回支付参数
  const payParams = {
    appId: WECHAT_PAY_CONFIG.appId,
    timeStamp,
    nonceStr,
    package: `prepay_id=${result.prepay_id}`,
    signType: 'MD5',
  };

  payParams.paySign = generateWechatSign(payParams);

  res.json(payParams);
});

// @desc    Verify WeChat payment
// @route   POST /api/orders/:id/wechat/verify
// @access  Private
const verifyWechatPayment = asyncHandler(async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // 验证支付结果
  const { result } = req.body;
  const verifyParams = {
    appid: WECHAT_PAY_CONFIG.appId,
    mch_id: WECHAT_PAY_CONFIG.mchId,
    nonce_str: result.nonceStr,
  };

  const sign = generateWechatSign(verifyParams);
  if (sign !== result.paySign) {
    res.status(400);
    throw new Error('支付签名验证失败');
  }

  // 更新订单状态
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  res.json({ message: '支付验证成功' });
});

// @desc    Handle WeChat payment callback
// @route   POST /api/orders/wechat/callback
// @access  Public
const handleWechatCallback = asyncHandler(async (req, res) => {
  // 解析回调数据
  const data = await parseXML(req.body);

  if (data.return_code !== 'SUCCESS') {
    res.status(400);
    throw new Error('支付回调失败');
  }

  // 验证签名
  const sign = generateWechatSign(data);
  if (sign !== data.sign) {
    res.status(400);
    throw new Error('支付回调签名验证失败');
  }

  // 更新订单状态
  const order = await Order.findByPk(data.out_trade_no);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();
  }

  // 返回成功响应
  res.send(buildXML({
    return_code: 'SUCCESS',
    return_msg: 'OK',
  }));
});

// Helper functions
const generateWechatSign = (params) => {
  const sortedParams = Object.keys(params)
    .filter(key => params[key] && key !== 'sign')
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const stringSignTemp = `${sortedParams}&key=${WECHAT_PAY_CONFIG.apiKey}`;
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
};

const buildXML = (obj) => {
  let xml = '<xml>';
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      xml += `<${key}>${obj[key]}</${key}>`;
    }
  }
  xml += '</xml>';
  return xml;
};

const parseXML = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) reject(err);
      else resolve(result.xml);
    });
  });
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  generateWechatPayParams,
  verifyWechatPayment,
  handleWechatCallback,
};
