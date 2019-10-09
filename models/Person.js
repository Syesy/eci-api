const Sequelize = require("sequelize");
const sequelize = require("../lib/db");

const Person = sequelize.define(
  "person",
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
    cityId: {
      type: Sequelize.UUIDV4
    }
  },
  {
    tableName: "people"
  }
);

module.exports = Person;
