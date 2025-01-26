import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  taxPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  deliveredAt: {
    type: DataTypes.DATE,
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  paymentResult: {
    type: DataTypes.JSON,
  },
}, {
  tableName: 'Orders',
  timestamps: true,
});

export default Order;
