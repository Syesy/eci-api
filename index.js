require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./authMiddleware");
const User = require("./models/User");
const City = require("./models/City");
const Person = require("./models/Person");
const HMAC_JWT_SECRET = process.env.HMAC_JWT_SECRET;
const port = 3000;

const app = express();
app.use(authMiddleware);
//Prende i body codificati con
//x-www-form-urlencoded e li trasforma in oggetti
//javascript
app.use(bodyParser.urlencoded());

//Prende i body codificati con
//application/json e li trasforma in oggetti
//javascript
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log("Middleware 1");
  next();
});
app.use((req, res, next) => {
  console.log("Middleware 2");
  next();
});

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
//x-www-form-urlencoded
//passiamo name: String
//mi crea la persona con name = name passato
//cityId = cityId nel path
app.post("/cities/:cityId/people", async (req, res) => {
  const createdPeople = [];
  for (const person of req.body) {
    const newPerson = await Person.create({
      name: person.name,
      cityId: req.params.cityId
    });
    createdPeople.push(newPerson);
  }

  return res.json(createdPeople);

  //   const person = await Person.create({
  //       name: req.body.name,
  //       cityId: req.params.cityId
  //   })

  //   return res.json(person)
});


app.post("/auth/login", (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  })
  if (!user) return res.sendStatus(404)
  const authenticated = await bcrypt.compare(
    req.body.password, user.password)

  if (authenticated) {

//Dobbiamo generare il token
    const token = jwt.sign(
      {
        userId: user.id
      },
      HMAC_JWT_SECRET,
      {
        expiresIn: "10d"
      }
    );

    return res.json({
      user: user,
      token: token
    });
    
  } else {
    return res.sendStatus(404)
  }
})

app.post("/users", async (req, res) => {
  if (!validator.validate(req.body.email)) {
    return res.status(400).json({
      error: "invalid_email"
    });
  }

  let hashPw;
  try {
    hashPw = await bcrypt.hash(req.body.password, 10);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }

  // if (
  //   await User.findOne({
  //     where: {
  //       email: req.body.email
  //     }
  //   })
  // ) {
  //   return res.status(400).json({
  //     error: "email_already_exists"
  //   });
  // }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashPw
  });

  const token = jwt.sign(
    {
      userId: user.id
    },
    HMAC_JWT_SECRET,
    {
      expiresIn: "10d"
    }
  );

  return res.json({
    user: user,
    token: token
  });
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
