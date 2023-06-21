const Sequelize = require("sequelize");

const sequelize = new Sequelize("trackerexpense", "root", "Sandeep@123", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
