const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const sequelize = new Sequelize("ecipar", "patrick", "1", {
  host: "localhost",
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});
const port = 3000;

const app = express();
app.use(bodyParser.urlencoded());
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

app.get("/cities", async (req, res) => {
  if (req.query.name) {
    var where = {
      name: req.query.name
    };
  } else {
    var where = {};
  }
  const cities = await City.findAll({
    where: where
  });
  return res.json(cities);
});
app.get("/cities/:cityId", async (req, res) => {
  const city = await City.findOne({
    id: req.params.cityId
  });
  return res.json(city);
});
app.post("/cities", async (req, res) => {
  const city = await City.create({
    name: req.body.name
  });
  return res.json(city);
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
