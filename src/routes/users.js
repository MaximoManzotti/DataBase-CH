const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const checkAdmin = require("../middleware/Admin");
const checkAuth = require("../middleware/Auth");
const client = require("../middleware/Redis");

router.get("/", checkAdmin, checkAuth, async (req, res) => {
  try {
    let user = await User.findAll();
      console.log("Getting users");
      res.status(200).json({ user });
  
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post("/login", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user.lenght > 1) {
      res.status(401).json({ message: " Unauthorized " });
    } else {
      bcrypt.compare(req.body.password, user.password, async (err, result) => {
        if (err) {
          res.status(401).json({ message: " Unauthorized " });
        } else if (result) {
          let token = JWT.sign({ email: email }, process.env.SECRET, {
            expiresIn: "1h",
          });
          client.set("token", token);
          client.set("email", email);
          client.set("id", user.id);
          client.set("businessman", user.businessman);
          res.status(200).json({ message: user });
        } else {
          res.status(400).json({ error: "User or Password are incorrect" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ error: "User or Password are incorrect" });
  }
});

router.post("/register", async (req, res) => {
  const data = req.body;
  let { name, lastName, email, password, businessman } = data;

  try {
    const emailAlreadyRegistered = await User.findAll({ where: { email } });

    if (emailAlreadyRegistered.length) {
      res.status(409).json({ message: `Email in use, Please chose other` });
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const newUser = await User.create({
            name,
            lastName,
            email,
            password: hash,
            businessman,
          });
          res.status(201).json({ message: "User created succesfully!" });
        }
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "you have empty fields or error was produce" });
  }
});

router.patch("/suppress/:id", checkAuth, async (req, res) => {
  const data = parseInt(req.params.id);
  client.get("id", async (err, idUsuario) => {
    try {
      const removedUser = await User.findOne({
        where: { id: data },
      });

      if (removedUser === null) {
        return res.status(404).json({ message: "User not found" });
      } else if (idUsuario != removedUser.id) {
        res.status(401).json({ message: " Unauthorized " });
      } else {
        await User.update(
          { openPropousal: false },
          { where: { id: idUsuario } }
        );
        res.status(200).json({ message: "User Deleted!" });
      }
    } catch (err) {
      res.status(500).json({ message: "Delete failed" });
    }
  });
});

router.delete("/delete/:email", checkAdmin, checkAuth, async (req, res) => {
  try {
    const data = req.params.email;
    const removedUser = await User.destroy({ where: { email: data } });
    if (!removedUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({ message: "User Deleted!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
