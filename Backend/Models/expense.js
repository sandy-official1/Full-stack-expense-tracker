const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = require("./users"); // Import the User model

const Expense = sequelize.define("expense", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Establish the association between Expense and User
Expense.belongsTo(User); // Adds the foreign key UserId to the Expense model

module.exports = Expense;
