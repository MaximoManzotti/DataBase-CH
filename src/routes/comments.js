const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Comments = require('../models/Comments')
const Propousals = require("../models/Propousals");
const checkAuth = require("../middleware/Auth");
const client = require("../middleware/Redis");

router.get("/:id", checkAuth, async (req,res)=>{
let idComments = req.params.id
try{
  const serchedComment = await Comments.findAll({
        where: { idPropousal: idComments },
      });
res.status(200).json({ message: serchedComment });
}catch(err){
       res.status(500).json({ message: "Error at getting comments" });
}

})

router.post("/add", checkAuth, (req, res) => {
  const comments = req.body.comments;
   const idPropousal = req.body.idPropousal

  client.get("id", async (err, idUsuario) => {
    if (err) {
      console.log(err);
    } else {
      try {
          const newComment = await Comments.create({
           idUser: idUsuario,
            idPropousal: idPropousal,
            comments : comments,
          })
;
res.status(200).json({message: newComment})
} catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error while creating comment;" });
      }
    }
})
})

router.patch("/suppress/:id", checkAuth, async (req, res) => {
  const data = parseInt(req.params.id);
  client.get("id", async (err, idUsuario) => {
    try {
      const removedComment = await Comments.findOne({
        where: { id: data },
      });
      let user = await User.findOne({ where: { id: idUsuario } });

      if (removedComment === null) {
        return res.status(404).json({ message: "Comment not found" });
      } else if (idUsuario != user.id) {
        res.status(401).json({ message: " Unauthorized " });
      } else {
        await Comments.destroy(
          { where: { id: removedComment } }
        );
        await Propousals.update({ visible: false }, { where: { id: data } });
        res.status(200).json({ message: "Comment Deleted!" });
      }
    } catch (err) {
      res.status(500).json({ message: "Delete failed" });
    }
  });
});

module.exports = router;
