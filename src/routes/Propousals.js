const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Propousals = require("../models/Propousals");
const checkAuth = require("../middleware/Auth");
const checkBusinessMan = require("../middleware/businessman");
const client = require("../middleware/Redis");

router.get("/", checkAuth, async (req, res) => {
  try {
    const propousal = await Propousals.findAll();
    console.log("Getting repositories");
    res.status(200).json({ propousal });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/add", checkBusinessMan, checkAuth, (req, res) => {
  const data = req.body;
  let { title, description } = data;
  client.get("id", async (err, idUsuario) => {
    if (err) {
      console.log(err);
    } else {
      try {
        const propousalsRegistred = await Propousals.findAll({
          where: { title },
        });
        let user = await User.findOne({ where: { id: idUsuario } });
        if (propousalsRegistred.length) {
          res.status(409).json({ message: `title in use, Please chose other` });
        } else if (user.openPropousal === true) {
          res
            .status(401)
            .json({ message: `you all ready have one repository in use` });
        } else {
          const newPropousals = await Propousals.create({
            title,
            description,
            idUser: idUsuario,
          });
          await User.update(
            { openPropousal: true },
            { where: { id: idUsuario } }
          );

          res.status(200).json({ message: "Propousal created succesfully!" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error while creating propousal;" });
      }
    }
  });
});

router.patch("/suppress/:id", checkAuth, async (req, res) => {
  const data = parseInt(req.params.id);
  client.get("id", async (err, idUsuario) => {
    try {
      const removedPropousal = await Propousals.findOne({
        where: { id: data },
      });
      let user = await User.findOne({ where: { id: idUsuario } });

      if (removedPropousal === null) {
        return res.status(404).json({ message: "Propousal not found" });
      } else if (idUsuario != user.id) {
        res.status(401).json({ message: " Unauthorized " });
      } else {
        await User.update(
          { openPropousal: false },
          { where: { id: idUsuario } }
        );
        await Propousals.update({ visible: false }, { where: { id: data } });
        res.status(200).json({ message: "Propousal Deleted!" });
      }
    } catch (err) {
      res.status(500).json({ message: "Delete failed" });
    }
  });
});

module.exports = router;
