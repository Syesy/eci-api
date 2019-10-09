const Sequelize = require("sequelize");
const sequelize = require("../lib/db");
const City = sequelize.define(
  "city",
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
    }
  },
  {
    tableName: "cities"
  }
);

module.exports = City;
