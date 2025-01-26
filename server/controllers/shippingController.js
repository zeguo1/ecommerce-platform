// shippingController.js

// @desc    Get shipping options
// @route   GET /api/shipping
// @access  Public
const getShippingOptions = async (req, res) => {
  res.json([
    {
      name: 'Standard Shipping',
      price: 5.99,
      deliveryTime: '3-5 business days',
    },
    {
      name: 'Express Shipping',
      price: 12.99,
      deliveryTime: '1-2 business days',
    },
  ]);
};

export { getShippingOptions };
