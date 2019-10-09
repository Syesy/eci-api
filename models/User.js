const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const User = sequelize.define(
  "user",
  {
    // attributes
    id: {
      primaryKey: true,
      type: Sequelize.UUIDV4,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  },
  {
    tableName: "users"
  }
);

module.exports = User;
