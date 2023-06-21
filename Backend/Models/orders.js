const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  status: { type: DataTypes.STRING, allowNull: false },
  orderId: { type: DataTypes.STRING, allowNull: false },
  paymentId: { type: DataTypes.STRING },
});

module.exports = Order;
