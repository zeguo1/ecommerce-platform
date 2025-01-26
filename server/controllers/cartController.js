const Cart = require('../models/Cart');
const Product = require('../models/Product');

// 获取购物车
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product')
      .exec();
      
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    
    res.status(200).json({
      items: cart.items.map(item => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      }))
    });
  } catch (error) {
    res.status(500).json({ message: '获取购物车失败' });
  }
};

// 修改商品数量
exports.updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: '购物车不存在' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: '数量更新成功' });
    } else {
      res.status(404).json({ message: '商品不存在' });
    }
  } catch (error) {
    res.status(500).json({ message: '更新数量失败' });
  }
};

// 删除商品
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: '购物车不存在' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    
    await cart.save();
    res.status(200).json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除失败' });
  }
};

// 清空购物车
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] }
    );
    res.status(200).json({ message: '购物车已清空' });
  } catch (error) {
    res.status(500).json({ message: '清空失败' });
  }
};
